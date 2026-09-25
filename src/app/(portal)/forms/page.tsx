import type { Metadata } from "next";
import { FormCard } from "@/components/dashboard/FormCard";
import { BrandAccent } from "@/components/ui/BrandAccent";
import { portalForms } from "@/config/forms";

export const metadata: Metadata = { title: "Employee Forms" };

export default function FormsPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-orca-navy-900 sm:text-3xl">
          Employee Forms
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Requests and reports for ORCA Rehab employees. Each form opens in a
          new tab.
        </p>
        <BrandAccent className="mt-4" />
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {portalForms.map((form) => (
          <FormCard key={form.id} form={form} />
        ))}
      </div>
    </div>
  );
}
