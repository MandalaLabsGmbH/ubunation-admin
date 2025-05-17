// import {
// 	CognitoUserPool,
//     CognitoUserSession
// } from 'amazon-cognito-identity-js';

export default function RootPage() {
//   const poolId = process.env.USER_POOL_ID;
// const clientId = process.env.CLIENT_ID;

// const poolData = {
//   UserPoolId: poolId ? poolId : 'no Cognito poolId found', // Your user pool id here
//   ClientId: clientId ? clientId : 'no Cognito clientId found', // Your client id here
// };

// console.log("poolId: " + poolId);

// const userPool = new CognitoUserPool(poolData);
//   const cognitoUser = userPool.getCurrentUser();
  
//   if (cognitoUser != null) {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     cognitoUser.getSession(function (err: any, session: CognitoUserSession) {
//       if (err) {
//         console.log(err.message || JSON.stringify(err));
//         return;
//       }
//       console.log('session validity: ' + session.isValid());
//     });
//   }

  return <div>hello, world!</div>
 }