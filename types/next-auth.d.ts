import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    // ...other user properties
  }

  interface Session {
    user: User & {
      id: string;
    };
  }
}