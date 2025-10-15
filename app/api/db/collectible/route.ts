import { NextResponse, NextRequest } from "next/server";
import axios, { AxiosError } from 'axios';
import { getToken } from "next-auth/jwt";

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const collectibleId = searchParams.get("collectibleId");
        const collectionId = searchParams.get("collectionId");
        const projectId = searchParams.get("projectId"); // New parameter

        // Case 1: Fetch a single collectible by its ID.
        if (collectibleId) {
            const response = await axios.get(`${NEXT_PUBLIC_API_BASE_URL}/Collectible/getCollectibleByCollectibleId`, {
                params: { collectibleId }
            });
            return NextResponse.json(response.data);
        }
        
        // Case 2: Fetch all collectibles in a collection.
        if (collectionId) {
            const response = await axios.get(`${NEXT_PUBLIC_API_BASE_URL}/Collectible/getCollectiblesByCollection`, {
                params: { collectionId }
            });
            return NextResponse.json(response.data);
        }

        // Case 3: (New) Fetch all collectibles in a project.
        if (projectId) {
            const response = await axios.get(`${NEXT_PUBLIC_API_BASE_URL}/Collectible/getCollectiblesByProjectId`, {
                params: { projectId }
            });
            return NextResponse.json(response.data);
        }
        
        // Case 4: Fetch ALL collectibles if no specific ID is provided.
        const response = await axios.get(`${NEXT_PUBLIC_API_BASE_URL}/Collectible/getAllCollectibles`);
        return NextResponse.json(response.data);

    } catch (e) {
        console.error({ e });
        if (axios.isAxiosError(e)) {
            const err = e as AxiosError;
            return NextResponse.json(
                { message: err.message, details: err.response?.data },
                { status: err.response?.status || 500, statusText: "API call failed" }
            );
        }
        return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const token = await getToken({ req: request, secret: process.env.NEXT_PUBLIC_SECRET });
        if (!token || token.userRole !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        if (!body.collectibleId) {
            return NextResponse.json({ message: 'Bad Request: collectibleId is required' }, { status: 400 });
        }

        const response = await axios.patch(`${NEXT_PUBLIC_API_BASE_URL}/Collectible/updateCollectibleByCollectibleId`, body, {
            headers: { 'Authorization': `Bearer ${token.accessToken}` }
        });

        return NextResponse.json(response.data);

    } catch (e) {
        console.error("Collectible PATCH error:", { e });
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