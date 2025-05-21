import { NextResponse } from "next/server";
import {
	CognitoUserPool,
	CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import {hash} from 'bcrypt';
import axios from 'axios';

const poolId = process.env.USER_POOL_ID;
const clientId = process.env.CLIENT_ID;

function dec2hex (dec: { toString: (arg0: number) => string; }) {
    return dec.toString(16).padStart(2, "0")
  }
  
  // generateId :: Integer -> String
  function generateId (len: number) {
    const arr = new Uint8Array((len || 40) / 2)
    crypto.getRandomValues(arr)
    return Array.from(arr, dec2hex).join('')
  }

const poolData = {
    UserPoolId: poolId ? poolId : 'no Cognito poolId found', // Your user pool id here
    ClientId: clientId ? clientId : 'no Cognito clientId found', // Your client id here
};

const userPool = new CognitoUserPool(poolData);

const pw = generateId(40);

async function cognitoRegister (email: string) {
    const attributeList: CognitoUserAttribute[] = [];
    userPool.signUp(
        email,
        pw,
        attributeList,
        attributeList,
        function (err, result) {
            if (err) {
                console.log('error 4');
                console.log(err.name || JSON.stringify(err));
                throw new Error(err.name);
            }
            const cognitoUser = result ? result.user : 'no user found';


            if (cognitoUser == result?.user) {
                console.log('user name is ' + cognitoUser.getUsername());
                return 'bababababa';
            }
        }
    );
}

            export async function POST(request: Request) {

                try {
                    const { email, nlBox } = await request.json();
                    // validate here (zod)
                    const nl = nlBox ? nlBox : 'no'
                    const hashedPassword = await hash(pw, 10);
                    console.log(hashedPassword);
                    // write POST request to User table in API here
                    const res = await cognitoRegister(email).then((resp) => {
                        console.log(resp);
                        return resp;
                    })
                    axios.post('https://l2gvl5jlxi5x5y3uzcqubcozy40yuzeh.lambda-url.eu-central-1.on.aws/User/createUser', {
                        "email":email,
                        "deviceId": nl,
                        "passwordHashed":pw,
                        "userType": "unregistered",
                        "username":email,
                  })
                  .then( (response) => {
                    console.log('test1');
                    console.log(response);
                    return response
                  })
                //   .catch(error => {
                //     console.log('test2');
                //     // console.error(error);
                //     return NextResponse.json({ message: error }, {status: 502, statusText: "invalid URL"}
                //     );
                //   })
                  return NextResponse.json({ message: res });
                }
                catch (e) {
                    console.log('test3');
                    console.log({ e });
                    return NextResponse.json({ message: e }, {status: 502, statusText: "invalid URL"});
                }    
            }
