import { NextResponse, NextRequest } from "next/server";
import axios, { AxiosError } from 'axios';
import { getToken } from "next-auth/jwt";

const LIVE_API_BASE_URL = process.env.LIVE_API_BASE_URL;
const LIVE_API_SECRET_KEY = process.env.LIVE_API_SECRET_KEY;

export async function POST(request: NextRequest) {
    try {
        // 1. Verify the admin's STAGING session
        const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
        if (!token || token.userRole !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // 2. Check for Live API configuration
        if (!LIVE_API_BASE_URL || !LIVE_API_SECRET_KEY) {
            console.error("Deployment configuration is missing. LIVE_API_BASE_URL or LIVE_API_SECRET_KEY not set.");
            return NextResponse.json({ message: 'Deployment is not configured on the server.' }, { status: 500 });
        }

        const { type, data } = await request.json();

        let liveEndpoint = '';
        let idKey = '';

        // 3. Determine which LIVE endpoint to call
        switch (type) {
            case 'collection':
                liveEndpoint = '/Collection/updateCollectionByCollectionId';
                idKey = 'collectionId';
                break;
            case 'collectible':
                liveEndpoint = '/Collectible/updateCollectibleByCollectibleId';
                idKey = 'collectibleId';
                break;
            case 'sponsor':
                liveEndpoint = '/Sponsor/updateSponsorBySponsorId'; // Assuming this endpoint name
                idKey = 'sponsorId';
                break;
            default:
                return NextResponse.json({ message: 'Invalid deployment type' }, { status: 400 });
        }

        if (!data || !data[idKey]) {
             return NextResponse.json({ message: `Missing data or ID key: ${idKey}` }, { status: 400 });
        }

        // 4. Make the secure M2M request to the LIVE API
        const response = await axios.patch(`${LIVE_API_BASE_URL}${liveEndpoint}`, data, {
            headers: { 
                'x-api-key': LIVE_API_SECRET_KEY, // The pre-shared secret
                'Content-Type': 'application/json'
            }
        });

        return NextResponse.json(response.data);

    } catch (e) {
        console.error("Deploy API error:", { e });
        if (axios.isAxiosError(e)) {
            const err = e as AxiosError;
            return NextResponse.json(
                { message: "Live API call failed", details: err.response?.data },
                { status: err.response?.status || 500 }
            );
        }
        return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
    }
}
