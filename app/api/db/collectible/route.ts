import { NextResponse } from "next/server";
import axios, { AxiosError } from 'axios';

            export async function GET(request: Request) {
                try {
                    const { collectibleId } = await request.json();
                    // validate here (zod)
                    axios.get(`https://l2gvl5jlxi5x5y3uzcqubcozy40yuzeh.lambda-url.eu-central-1.on.aws/Collectible/getCollectibleByCollectibleId/${collectibleId}`)
                  return NextResponse.json({ message: 'success' });
                }
                catch (e)
                 {
                    console.log({ e });
                    const err = e as AxiosError;
                    return NextResponse.json({ message: e }, {status: err.status, statusText: "invalid database call"});
                }    
            }