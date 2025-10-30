import { NextResponse, NextRequest } from "next/server";
import axios, { AxiosError } from 'axios';
import { getToken } from "next-auth/jwt";

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get("limit");
        const collectionId = searchParams.get("collectionId"); // Check for a specific collectionId

        // If a specific collectionId is requested, fetch that one.
        if (collectionId) {
            const response = await axios.get(`${NEXT_PUBLIC_API_BASE_URL}/Collection/getCollectionByCollectionId`, {
                params: { collectionId },
            });
            return NextResponse.json(response.data);
        }

        // If a limit is provided, use the original logic for getting multiple collections.
        if (limit) {
            const response = await axios.get(`${NEXT_PUBLIC_API_BASE_URL}/Collection/getAllCollections`, {
                params: { limit },
            });
            return NextResponse.json(response.data);
        }
        
        // Default case: Get all collections if no specific parameters are given.
        const response = await axios.get(`${NEXT_PUBLIC_API_BASE_URL}/Collection/getAllCollections`);
        return NextResponse.json(response.data);

    } catch (e) {
        // Log the error for debugging purposes.
        console.error({ e });

        // Handle Axios-specific errors to return a more informative response.
        if (axios.isAxiosError(e)) {
            const err = e as AxiosError;
            return NextResponse.json(
                { message: err.message, details: err.response?.data },
                { status: err.response?.status || 500, statusText: "API call failed" }
            );
        }

        // Handle generic errors.
        return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const token = await getToken({ req: request, secret: process.env.NEXT_AUTH_SECRET });
        if (!token || token.userRole !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        if (!body.collectionId) {
            return NextResponse.json({ message: 'Bad Request: collectionId is required' }, { status: 400 });
        }

        const response = await axios.patch(`${NEXT_PUBLIC_API_BASE_URL}/Collection/updateCollectionByCollectionId`, body, {
            headers: { 'Authorization': `Bearer ${token.accessToken}` }
        });

        return NextResponse.json(response.data);

    } catch (e) {
        console.error("Collection PATCH error:", { e });
        if (axios.isAxiosError(e)) {
            const err = e as AxiosError;
            return NextResponse.json(
                { message: "API call failed", details: err.response?.data },
                { status: err.response?.status || 500 }
            );
        }
        return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
    }
}
