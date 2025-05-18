import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { CognitoIdentityProviderClient, InitiateAuthCommand, AuthFlowType } from "@aws-sdk/client-cognito-identity-provider";
import process from 'process';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Username" },
                password: { label: "Password", type: "password" }
            },

            authorize: async (credentials) => {

                const cognito = new CognitoIdentityProviderClient({
                    region: process.env.COGNITO_REGION,
                });

                if (!credentials) return null;
                console.log('testing...')
                //CLIENT_ID is COGNITO_CLIENT_ID
                const params = {
                    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
                    ClientId: process.env.CLIENT_ID,
                    AuthParameters: {
                        USERNAME: credentials.username,
                        PASSWORD: credentials.password,
                    },
                };

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