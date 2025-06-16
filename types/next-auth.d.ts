import 'next-auth';
import 'next-auth/jwt';

/**
 * By declaring this module, we're extending the existing NextAuth types.
 * This allows us to add custom properties to the session and token objects.
 */

// 1. Augment the `User` object
declare module 'next-auth' {
  /**
   * The `User` object is passed to the `jwt` callback on initial sign-in.
   * We're adding the properties from Cognito's AuthenticationResult here.
   */
  interface User {
    IdToken?: string;
    AccessToken?: string;
    RefreshToken?: string;
  }

  /**
   * The `Session` object is what's returned from `useSession`, `getSession`, etc.
   * We're adding the `accessToken` to it so we can access it on the client.
   */
  interface Session {
    accessToken?: string;
  }
}

// 2. Augment the `JWT` object
declare module 'next-auth/jwt' {
  /**
   * The `JWT` interface is used for the `token` object in the `jwt` callback.
   * We're adding our custom properties here so we can access them in the `session` callback.
   */
  interface JWT {
    idToken?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}