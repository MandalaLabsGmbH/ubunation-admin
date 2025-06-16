import { NextResponse, NextRequest } from "next/server";
import axios, { AxiosError } from 'axios';
import { getToken } from "next-auth/jwt";

const API_BASE_URL = process.env.API_BASE_URL;

export async function GET(request: NextRequest) {
    try {
        const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
        if (!token?.accessToken) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const collectibleId = searchParams.get("collectibleId");
        
        const userResponse = await axios.get(`${API_BASE_URL}/Collectible/getCollectibleByCollectibleId?collectibleId=${collectibleId}`, {
            headers: { 'Authorization': `Bearer ${token.accessToken}` }
        });

        const objectUrl = userResponse.data.embedRef['url'];
        return NextResponse.json({ message: 'success', objectUrl: objectUrl });
    } catch (e) {
        console.log({ e });
        const err = e as AxiosError;
        return NextResponse.json({ message: e }, { status: err.status, statusText: "invalid database call" });
    }
}