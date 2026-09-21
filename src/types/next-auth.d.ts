import type { DefaultSession } from "next-auth";
import type { OrcaUser } from "@/types/user";

declare module "next-auth" {
  interface Session {
    user: OrcaUser & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    orcaUser?: OrcaUser;
  }
}
