import "next-auth";

declare module "next-auth" {
  export interface Session {
    accessToken: string;
  }
  export interface User {
    id: number;
    jwt: string;
  }
  export interface JWT {
    id: number;
    jwt: string;
  }
}
