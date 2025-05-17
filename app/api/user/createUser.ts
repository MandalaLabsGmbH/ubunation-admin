import { NextResponse } from "next/server";

export async function POST (request: Request) {

 try {
    const { email } = await request.json();
    //validate here (zod)
    console.log(email);

    // write POST request to User table in API here
 }
catch (e) {
    console.log({ e });
 }

 return NextResponse.json({ message: 'success'});
}