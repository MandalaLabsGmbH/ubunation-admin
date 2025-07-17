import { NextResponse, NextRequest } from "next/server";
import axios, { AxiosError } from 'axios';
import { getToken } from "next-auth/jwt";

const API_BASE_URL = process.env.API_BASE_URL;

export async function GET(request: NextRequest) {
    try {

        const { searchParams } = new URL(request.url);
        const collectionId = searchParams.get("collectionId");

        // Check if the collectionId is provided in the request.
        if (!collectionId) {
            return NextResponse.json({ message: 'Bad Request: collectionId must be provided' }, { status: 400 });
        }

        // Make the API call to get the collection data.
        const response = await axios.get(`${API_BASE_URL}/Collection/getCollectionByCollectionId`, {
            params: { collectionId },
        });

        // Return the successful response data.
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
        const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
        if (!token || token.userRole !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        if (!body.collectionId) {
            return NextResponse.json({ message: 'Bad Request: collectionId is required' }, { status: 400 });
        }

        const response = await axios.patch(`${API_BASE_URL}/Collection/updateCollectionByCollectionId`, body, {
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
