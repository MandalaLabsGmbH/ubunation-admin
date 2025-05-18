import { NextResponse } from "next/server";
import {
	CognitoUserPool,
	CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import {hash} from 'bcrypt';
import axios from 'axios';

const poolId = process.env.USER_POOL_ID;
const clientId = process.env.CLIENT_ID;

const poolData = {
    UserPoolId: poolId ? poolId : 'no Cognito poolId found', // Your user pool id here
    ClientId: clientId ? clientId : 'no Cognito clientId found', // Your client id here
};

const userPool = new CognitoUserPool(poolData);

async function cognitoRegister (email: string, password: string) {
    const attributeList: CognitoUserAttribute[] = [];

    userPool.signUp(
        email,
        password,
        attributeList,
        attributeList,
        function (err, result) {
            if (err) {
                console.log(err.message || JSON.stringify(err));
                return;
            }
            const cognitoUser = result ? result.user : 'no user found';


            if (cognitoUser == result?.user) {
                console.log('user name is ' + cognitoUser.getUsername());
            }
        }
    );
}

            export async function POST(request: Request) {

                try {
                    const { email, password, nlBox, tcBox } = await request.json();
                    //validate here (zod)
                    console.log(email, password);
                    const tc = tcBox ? tcBox : 'no';
                    const nl = nlBox ? nlBox : 'no'
                    const hashedPassword = await hash(password, 10);
                    console.log(hashedPassword);
                    // write POST request to User table in API here
                    await cognitoRegister(email, password);
                    axios.post('https://l2gvl5jlxi5x5y3uzcqubcozy40yuzeh.lambda-url.eu-central-1.on.aws/User/createUser', {
                        "email":email,
                        "deviceId": nl,
                        "passwordHashed":hashedPassword,
                        "userType": "unregistered",
                        "username":email,
                  })
                  .then(response => {
                    console.log(response.data);
                  })
                  .catch(error => {
                    console.error(error);
                    return error;
                  });
                }
                catch (e) {
                    console.log({ e });
                }

                return NextResponse.json({ message: 'success' });
            }
