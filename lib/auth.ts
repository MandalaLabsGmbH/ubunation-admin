import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { CognitoJwtVerifier } from "aws-jwt-verify";
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
        async jwt({ token, user, account }) {
            if (account && user) {
                token.accessToken = user.AccessToken;
                token.idToken = user.IdToken;
                token.refreshToken = user.RefreshToken;
            }
            
            // On subsequent calls, check the user's group from the idToken
            if (token.idToken) {
                const verifier = CognitoJwtVerifier.create({
                    userPoolId: process.env.USER_POOL_ID!,
                    tokenUse: "id",
                    clientId: process.env.CLIENT_ID!,
                });
                try {
                    const payload = await verifier.verify(token.idToken as string);
                    token.userRole = (payload['cognito:groups'] as string[])?.includes('admin') ? 'admin' : 'user';
                } catch (e) {
                    console.error("Token verification failed:", e);
                    token.userRole = 'user';
                }
            }

            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            // @ts-expect-error : role is automatic
            session.user.role = token.userRole; 
            return session;
        }
    },
    pages: {
        signIn:  "/login"
    },
}