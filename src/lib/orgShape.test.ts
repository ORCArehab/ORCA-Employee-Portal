import { describe, expect, it } from "vitest";
import { facilityList, staffGroups, type ApiFacility, type ApiStaff } from "./orgShape";

const staff = (o: Partial<ApiStaff>): ApiStaff => ({ id: o.displayName ?? "x", displayName: "X", title: null, category: "other", workEmail: null, ...o });
const facility = (o: Partial<ApiFacility>): ApiFacility => ({
  id: o.name ?? "f",
  name: "F",
  abbreviation: null,
  type: "snf",
  region: null,
  county: null,
  address: { line1: null, line2: null, city: null, state: null, postalCode: null },
  phone: null,
  operationalStatus: "active",
  ...o,
});

describe("directory", () => {
  it("groups staff, sorts by name, and leaves out hidden and former staff", () => {
    const groups = staffGroups([
      staff({ displayName: "Zed Example, MD", category: "physician", workEmail: "zed@example.com", ringcentralPhone: "(555) 010-0100" }),
      staff({ displayName: "Ann Sample, NP", category: "np_pa", title: "Nurse practitioner" }),
      staff({ displayName: "Bo Demo", category: "scribe" }),
      staff({ displayName: "Cy Office", category: "administrative" }),
      staff({ displayName: "Dee Unknown", category: "unknown" }),
      staff({ displayName: "Hidden Person", category: "physician", directoryVisible: false }),
      staff({ displayName: "Former Person", category: "scribe", employmentStatus: "separated" }),
    ]);
    expect(groups.map((g) => [g.name, g.members.map((m) => m.name)])).toEqual([
      ["Providers", ["Ann Sample, NP", "Zed Example, MD"]],
      ["Administrative & Operations", ["Cy Office"]],
      ["Scribes", ["Bo Demo"]],
      ["Other Staff", ["Dee Unknown"]],
    ]);
    expect(groups[0]!.members[1]).toMatchObject({ title: "Physician", email: "zed@example.com", phone: "(555) 010-0100" });
    expect(groups[0]!.members[0]!.title).toBe("Nurse practitioner");
  });
});

describe("facilities", () => {
  it("lists current facilities by region with a one-line address", () => {
    const list = facilityList([
      facility({ name: "Beta Care", county: "Orange County", address: { line1: "1 Main St", line2: null, city: "Anaheim", state: "CA", postalCode: "92804" }, phone: "555-0100" }),
      facility({ name: "Alpha Post Acute", region: "San Diego", type: "alf" }),
      facility({ name: "Closed Place", operationalStatus: "inactive" }),
      facility({ name: "Gamma Hospital", type: "hospital" }),
    ]);
    expect(list.map((f) => [f.region, f.name])).toEqual([
      ["Orange", "Beta Care"],
      ["Other", "Gamma Hospital"],
      ["San Diego", "Alpha Post Acute"],
    ]);
    expect(list[0]).toMatchObject({ address: "1 Main St, Anaheim, CA 92804", phone: "555-0100", type: "Skilled nursing" });
  });
});
