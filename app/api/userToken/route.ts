import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.AUTH_SECRET;
            
            export default async function handler(req: NextRequest, res: NextResponse) {
                const token = await getToken({ req, secret });

                if (token) {
                    // You now have the decoded JWT payload
                    console.log("Decoded JWT on server:", token);
                    return NextResponse.json({ message: 'success', email: token.email, fullToken: token }, {status: res.status, statusText: "invalid database call"});
                } else {
                   return NextResponse.json({ message: 'token retrieval error' }, {status: res.status, statusText: res.statusText});
                }
            }