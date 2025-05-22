import { cookies } from 'next/headers'
import { NextResponse } from "next/server";

export async function GET() {
        try {
            const cookieStore = await cookies()
            const myCookie = cookieStore.get('next-auth.csrf-token'); 
            return NextResponse.json( {
        message: 'Cookie found!',
        cookieName: myCookie?.name,
        cookieValue: myCookie?.value,
      },
      { status: 200 }
    );
        }
            catch (e) {
            console.log({ e });
            return NextResponse.json({ message: e }, {status: 500, statusText: "invalid call"});
        }    
    }