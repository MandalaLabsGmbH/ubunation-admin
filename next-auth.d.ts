import { DefaultSession } from "next-auth";

// This is a common pattern for extending NextAuth.js types.
// It merges your custom properties into the existing types.

declare module "next-auth" {
  // Extend the built-in Session type
  interface Session {
    user: {
      id: string; // Add id to user in session
      // Add any other custom properties you want to expose on the session user object
      // e.g., role: string;
    } & DefaultSession["user"]; // Inherit default session user properties
  }

  // Extend the `credentials` object for the CredentialsProvider
  interface Credentials {
    // These are the explicitly defined ones in your provider
    email?: string;
    password?: string;
    // Add your custom properties here!
    userType?: string; // For your 'userType' example
    // Add any other custom fields you pass to signIn
  }
}