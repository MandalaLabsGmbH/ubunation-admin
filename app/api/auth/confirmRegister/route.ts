import { NextResponse } from "next/server";
import {
	CognitoUserPool,
    CognitoUser,
    CookieStorage
} from 'amazon-cognito-identity-js';

const poolId = "eu-central-1_flxgJwy19";
const clientId = "3habrhuviqskit3ma595m5dp0b";

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
            console.log(err.message || JSON.stringify(err));
            return;
        }
        console.log('call result: ' + result);
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
    console.log({ e });
 }

 return NextResponse.json({ message: 'success'});
}