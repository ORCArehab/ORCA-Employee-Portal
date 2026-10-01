import type { DefaultSession } from "next-auth";
import type { ApiSession } from "@/lib/userRepository";
import type { OrcaUser } from "@/types/user";

declare module "next-auth" {
  interface Session {
    user: OrcaUser & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    orcaUser?: OrcaUser;
    /** Server-side only: never copied into the session the browser can read. */
    orcaApi?: ApiSession;
  }
}
