import { NextResponse } from "next/server";
import {
	CognitoUserPool,
    CognitoUser,
    CookieStorage
} from 'amazon-cognito-identity-js';

const poolId = process.env.NEXT_PUBLIC_USER_POOL_ID!;
const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;

console.log(poolId, clientId);

const poolData = {
    UserPoolId: poolId, // Your user pool id here
    ClientId: clientId,
    Storage: new CookieStorage({domain: 'localhost', secure: false}) // Your client id here
};

const userPool = new CognitoUserPool(poolData);

async function cognitoConfirm(email: string, userPool: CognitoUserPool, confirmCode: string) {
    const userData = {
        Username: email,
        Pool: userPool,
        Storage: new CookieStorage({domain: 'localhost', secure: false})
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(confirmCode, true, function (err, result) {
        if (err) {
            console.log('testconfirm1')
            console.log(err.message || JSON.stringify(err));
            return;
        }
        console.log('testconfirm2');
        console.log(result);
        return result;
    });
}

// async function authenticateUser (email: string, password: string) {
//     const authenticationData = {
//         Username: email,
//         Password: password,
//     };
//     const authenticationDetails = new AuthenticationDetails(
//         authenticationData
//     );
//     const userPool = new CognitoUserPool(poolData);
//     const userData = {
//         Username: email,
//         Pool: userPool,
//         Storage: new CookieStorage({domain: 'localhost', secure: false})
//     };
//     const cognitoUser = new CognitoUser(userData);
//     cognitoUser.authenticateUser(authenticationDetails, {
//         onSuccess: function (result) {
//             const accessToken = result.getAccessToken().getJwtToken();
//             console.log(accessToken);
//             return accessToken;
//         },
//         onFailure: function (err) {
//             console.log(err.message || JSON.stringify(err));
//         },
//     });
// }

export async function POST (request: Request) {

 try {
    const { email, confirmCode } = await request.json();
    //validate here (zod)
    console.log(email, confirmCode);

    // write POST request to User table in API here
    await cognitoConfirm(email, userPool, confirmCode);
    
    
 }
catch (e) {
    console.log('testconfirm3');
    console.log({ e });
 }

 return NextResponse.json({ message: 'success'});
}