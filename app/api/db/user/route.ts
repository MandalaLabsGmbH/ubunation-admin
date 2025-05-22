import { NextResponse } from "next/server";
import axios, { AxiosError } from 'axios';

            export async function GET(request: Request) {
                try {
                    const { email } = await request.json();
                    // validate here (zod)
                    axios.get(`https://l2gvl5jlxi5x5y3uzcqubcozy40yuzeh.lambda-url.eu-central-1.on.aws/User/getUserByUsername/${email}`)
                  return NextResponse.json({ message: 'success' });
                }
                catch (e)
                 {
                    console.log({ e });
                    const err = e as AxiosError;
                    return NextResponse.json({ message: e }, {status: err.status, statusText: "invalid database call"});
                }    
            };

            export async function PATCH(request: Request) {
                try {
                    const { email, token } = await request.json();
                    // validate here (zod)
                    axios.post('https://l2gvl5jlxi5x5y3uzcqubcozy40yuzeh.lambda-url.eu-central-1.on.aws/User/updateUserByUsername', {
                       "username": email,
                       "authToken": token,
                  })
                  return NextResponse.json({ message: 'success' });
                }
                catch (e)
                 {
                    console.log({ e });
                    const err = e as AxiosError;
                    return NextResponse.json({ message: e }, {status: err.status, statusText: "invalid database call"});
                }    
            };