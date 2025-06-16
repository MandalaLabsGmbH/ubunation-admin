import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { CognitoIdentityProviderClient, InitiateAuthCommand, AuthFlowType } from "@aws-sdk/client-cognito-identity-provider";
import process from 'process';

export const authOptions: AuthOptions = {
    secret: process.env.AUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Username" },
                password: { label: "Password", type: "text", placeholder: "Password" },
            },

            authorize: async (credentials) => {

                if (!credentials) return null;

                const cognito = new CognitoIdentityProviderClient({
                    region: process.env.COGNITO_REGION,
                });

                const params = {
                    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
                    ClientId: process.env.CLIENT_ID!,
                    AuthParameters: {
                        USERNAME: credentials.username,
                        PASSWORD: credentials.password,
                    },
                };
                //CLIENT_ID is COGNITO_CLIENT_ID

                try {
                    const command = new InitiateAuthCommand(params);
                    const cognitoResponse = await cognito.send(command);
                    
                    if (cognitoResponse.AuthenticationResult) {
                    return {
                        id: credentials.username,
                        name: credentials.username,
                        email: credentials.username,
                        ...cognitoResponse.AuthenticationResult,
                    };
                }
                    return null;
                } catch (error) {
                    console.error("Authorize error:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            // The 'user' object is only passed on the initial sign-in.
            // We're taking the tokens from the 'user' object and putting them in the JWT 'token'.
            if (user) {
                token.idToken = user.IdToken;
                token.accessToken = user.AccessToken;
                token.refreshToken = user.RefreshToken;
            }
            return token;
        },
        async session({ session, token }) {
            // The session callback makes the token data available on the client-side session object.
            if (token) {
                session.accessToken = token.accessToken as string;
            }
            return session;
        }
    },
    pages: {
        signIn:  "/login"
    },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };