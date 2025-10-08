import { NextResponse, NextRequest } from "next/server";
import axios, { AxiosError } from 'axios';

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");
        const collectionId = searchParams.get("collectionId");

        if (!type || !collectionId) {
            return NextResponse.json({ message: 'Bad Request: type and collectionId are required' }, { status: 400 });
        }

        const response = await axios.get(`${NEXT_PUBLIC_API_BASE_URL}/Sponsor/getSponsorsByOrganization`, {
            params: {
                'sponsor.organization.type': type,
                'sponsor.organization.collectionId': collectionId
            },
        });

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