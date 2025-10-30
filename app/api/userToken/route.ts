import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.AUTH_SECRET;

export async function GET(req: NextRequest) {
    const token = await getToken({ req, secret });

    if (token) {
        console.log("Decoded JWT on server:", token);
        return NextResponse.json({
            message: 'success',
            email: token.email,
            fullToken: token
        });
    } else {
        return NextResponse.json({
            message: 'token retrieval error'
        });
    }
}
