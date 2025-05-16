import { NextResponse } from "next/server";
import {hash} from 'bcrypt';

export async function POST (request: Request) {
 try {
    const { email, password } = await request.json();
    //validate here (zod)
    console.log(email, password);

    const hashedPassword = await hash(password, 10);
    console.log(hashedPassword);
    // write POST request to User table in API here
 }
catch (e) {
    console.log({ e });
 }

 return NextResponse.json({ message: 'success'});
}