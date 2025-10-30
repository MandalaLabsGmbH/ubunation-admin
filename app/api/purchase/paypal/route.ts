import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import axios from 'axios';

const CREATE_PAYPAL_ORDER_URL = process.env.CREATE_PAYPAL_ORDER_LAMBDA_URL;

export async function POST(request: NextRequest) {
    try {
        const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
        const { cart } = await request.json();

        if (!cart || cart.length === 0) {
            return NextResponse.json({ message: 'Shopping cart is empty.' }, { status: 400 });
        }
        
        if (!CREATE_PAYPAL_ORDER_URL) {
            throw new Error("PayPal Lambda URL is not configured.");
        }

        const payload = { userId: token?.sub, cart: cart };

        const lambdaResponse = await axios.post(CREATE_PAYPAL_ORDER_URL, payload);

        return NextResponse.json(lambdaResponse.data);

    } catch (error) {
        console.error("API route /api/purchase/paypal error:", error);
        const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred.';
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
