import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import axios from 'axios';

// This should be the URL for your API Gateway endpoint that triggers the Lambda
const CREATE_PAYMENT_INTENT_URL = process.env.NEXT_PUBLIC_CREATE_PAYMENT_INTENT_LAMBDA_URL;

export async function POST(request: NextRequest) {
    try {
        const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
        const { cart } = await request.json();

        if (!cart || cart.length === 0) {
            return NextResponse.json({ message: 'Shopping cart is empty.' }, { status: 400 });
        }
        
        if (!CREATE_PAYMENT_INTENT_URL) {
            throw new Error("Lambda URL is not configured.");
        }

        // The body that will be sent to your Lambda function
        const payload = {
            userId: token?.sub, // Pass the user's ID (from the JWT subject) if they are logged in
            cart: cart,
        };

        // Call your AWS Lambda function via API Gateway
        const lambdaResponse = await axios.post(CREATE_PAYMENT_INTENT_URL, payload);

        // Forward the response from the Lambda (which includes the clientSecret) back to the frontend
        return NextResponse.json(lambdaResponse.data);

    } catch (error) {
        console.error("API route /api/purchase error:", error);
        const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred.';
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
