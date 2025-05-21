import {
	CognitoUserPool,
    CognitoUser,
	CognitoUserAttribute,
    CookieStorage
} from 'amazon-cognito-identity-js';


const poolId = process.env.USER_POOL_ID;
const clientId = process.env.CLIENT_ID;

function dec2hex (dec: { toString: (arg0: number) => string; }) {
    return dec.toString(16).padStart(2, "0")
  }
  
  // generateId :: Integer -> String
  export function generateId (len: number) {
    const arr = new Uint8Array((len || 40) / 2)
    crypto.getRandomValues(arr)
    return Array.from(arr, dec2hex).join('')
  }

const poolData = {
    UserPoolId: poolId ? poolId : 'no Cognito poolId found', // Your user pool id here
    ClientId: clientId ? clientId : 'no Cognito clientId found', // Your client id here
    Storage: new CookieStorage({domain: 'localhost', secure: false})
};

const userPool = new CognitoUserPool(poolData);

export function cognitoRegister(email: string, password: string): Promise<string> {
    const attributeList: CognitoUserAttribute[] = [];
        return new Promise((resolve, reject) => {
        userPool.signUp(
            email,
            password,
            attributeList,
            attributeList,
            function (err, result) {
                if (err) {
                    return reject(err.name || 'UnknownError');
                }
                const cognitoUser = result?.user;
                if (cognitoUser) {
                    console.log('user name is ' + cognitoUser.getUsername());
                    return resolve('success');
                } else {
                    return reject('UserNotFound');
                }
            }
        );
    });
}

export async function cognitoConfirm(email: string, confirmCode: string): Promise<string> {
    const userData = {
        Username: email,
        Pool: userPool,
        Storage: new CookieStorage({domain: 'localhost', secure: false})    
    };
    const cognitoUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(confirmCode, true, function (err, result) {
        if (err) {
            return reject(err.name || 'UnknownError');
        }
        console.log(result);
        return resolve('success');
    });
    });
    }