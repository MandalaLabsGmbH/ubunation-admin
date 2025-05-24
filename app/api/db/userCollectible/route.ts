import { NextResponse } from "next/server";
import axios, { AxiosError } from 'axios';

            export async function POST(request: Request) {
                try {
                    const { userId, collectibleId, mint } = await request.json();
                    // validate here (zod)
                    axios.post('https://l2gvl5jlxi5x5y3uzcqubcozy40yuzeh.lambda-url.eu-central-1.on.aws/UserCollectible/createUserCollectible', {
                        "ownerId": userId,
                        "collectibleId": collectibleId,
                        "mint": mint
                  })
                  return NextResponse.json({ message: 'success' });
                }
                catch (e)
                 {
                    console.log({ e });
                    const err = e as AxiosError;
                    return NextResponse.json({ message: e }, {status: err.status, statusText: "invalid database call"});
                }    
            }