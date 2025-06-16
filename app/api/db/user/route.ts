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
        
        const email = token.email;
        
        const userResponse = await axios.get(`${API_BASE_URL}/User/getUserByEmail?email=${email}`, {
            headers: { 'Authorization': `Bearer ${token.accessToken}` }
        });

        return NextResponse.json({ message: 'success', userId: userResponse.data.userId });
    } catch (e) {
        console.log({ e });
        const err = e as AxiosError;
        return NextResponse.json({ message: e }, { status: err.status, statusText: "invalid database call" });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
        if (!token?.accessToken) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        
        const { email, token: authToken } = await request.json();
        
        await axios.post(`${API_BASE_URL}/User/updateUserByUsername`, {
           "username": email,
           "authToken": authToken,
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