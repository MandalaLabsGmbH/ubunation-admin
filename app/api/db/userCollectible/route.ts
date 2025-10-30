import { NextResponse, NextRequest } from "next/server";
import axios, { AxiosError } from 'axios';
import { getToken } from "next-auth/jwt";

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest) {
    try {
        const token = await getToken({ req: request, secret: process.env.NEXT_AUTH_SECRET });
        if (!token?.accessToken) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const headers = { 'Authorization': `Bearer ${token.accessToken}` };

        const userResponse = await axios.get(`${NEXT_PUBLIC_API_BASE_URL}/User/getUserByEmail?email=${token.email}`, { headers });
        const userId = userResponse.data.userId;

        if (!userId) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        
        const userCollectibleResponse = await axios.get(`${NEXT_PUBLIC_API_BASE_URL}/UserCollectible/getUserCollectiblesByOwnerId?ownerId=${userId}`, { headers });

        const collectibleId = userCollectibleResponse.data[0].collectibleId;
        console.log(userCollectibleResponse.data[0].collectibleId);
        return NextResponse.json({ message: 'success', collectibleId: collectibleId });
    } catch (e) {
        console.log({ e });
        const err = e as AxiosError;
        return NextResponse.json({ message: e }, { status: err.status, statusText: "invalid database call" });
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = await getToken({ req: request, secret: process.env.NEXT_AUTH_SECRET });
        if (!token?.accessToken) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { userId, collectibleId, mint } = await request.json();
        
        await axios.post(`${NEXT_PUBLIC_API_BASE_URL}/UserCollectible/createUserCollectible`, {
            "ownerId": userId,
            "collectibleId": collectibleId,
            "mint": mint
        }, {
            headers: { 'Authorization': `Bearer ${token.accessToken}` }
        });

        return NextResponse.json({ message: 'success' });
    } catch (e) {
        console.log({ e });
        const err = e as AxiosError;
        return NextResponse.json({ message: e }, { status: err.status, statusText: "invalid database call" });
    }
}