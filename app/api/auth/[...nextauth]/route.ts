import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { CognitoIdentityProviderClient, InitiateAuthCommand, AuthFlowType } from "@aws-sdk/client-cognito-identity-provider";
import process from 'process';

const handler = NextAuth({
    secret: process.env.AUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Username" },
                password: { label: "Password", type: "text", placeholder: "Password" },
            },

            authorize: async (credentials) => {

                const cognito = new CognitoIdentityProviderClient({
                    region: process.env.COGNITO_REGION,
                });

                if (!credentials) return null;

                const params = {
                    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
                    ClientId: process.env.CLIENT_ID,
                    AuthParameters: {
                        USERNAME: credentials.username,
                        PASSWORD: credentials.password,
                    },
                };
                //CLIENT_ID is COGNITO_CLIENT_ID

                try {
                    const command = new InitiateAuthCommand(params);
                    await cognito.send(command);
                    const user = {
                        id: credentials.username,
                        name: credentials.username,
                    };
                    return user;
                } catch (error) {
                    console.error(error);
                    return null;
                }
            }
        })
    ],
    
    pages: {
        signIn:  "/register"
    },
})

export { handler as GET, handler as POST }