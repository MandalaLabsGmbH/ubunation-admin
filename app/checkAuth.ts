'use client'

import {
    CognitoUserPool,
    CognitoUserSession
} from 'amazon-cognito-identity-js';

const poolId = process.env.NEXT_PUBLIC_USER_POOL_ID;
const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;

const poolData = {
  UserPoolId: poolId ? poolId : 'no Cognito poolId found', // Your user pool id here
  ClientId: clientId ? clientId : 'no Cognito clientId found', // Your client id here
};

export default function CheckUser() {
const userPool = new CognitoUserPool(poolData);
  const cognitoUser = userPool.getCurrentUser();
  console.log("user: " + cognitoUser);
  if (cognitoUser != null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cognitoUser.getSession(function (err: any, session: CognitoUserSession) {
      if (err) {
        console.log(err.message || JSON.stringify(err));
        return;
      }
      console.log('session validity: ' + session.isValid());
      return 'session validity: ' + session.isValid();
    });
  }
}