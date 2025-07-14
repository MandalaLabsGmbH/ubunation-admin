import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import axios from 'axios';

const CREATE_PAYMENT_INTENT_URL = process.env.CREATE_PAYMENT_INTENT_LAMBDA_URL;

export async function POST(request: NextRequest) {
    try {
        const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
        const { cart } = await request.json();

        if (!cart || cart.length === 0) {
            return NextResponse.json({ message: 'Shopping cart is empty.' }, { status: 400 });
        }
        
        if (!CREATE_PAYMENT_INTENT_URL) {
            throw new Error("Stripe Lambda URL is not configured.");
        }

        const payload = { userId: token?.sub, cart: cart };

        const lambdaResponse = await axios.post(CREATE_PAYMENT_INTENT_URL, payload);

        return NextResponse.json(lambdaResponse.data);

    } catch (error) {
        console.error("API route /api/purchase/stripe error:", error);
        const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred.';
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
