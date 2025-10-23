/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.COGNITO_REGION, // Server-side variable
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!, // Server-side variable
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!, // Server-side variable
  },
});

export async function GET() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME, // Server-side variable
      Prefix: 'gallery/',
    });

    const { Contents } = await s3Client.send(command);

    const files = Contents?.map((file) => ({
      key: file.Key,
      url: `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.COGNITO_REGION}.amazonaws.com/${file.Key}`,
    }))
    // --- FIX: Filter out the "folder" object which has a key ending in "/" ---
    .filter(file => file.key && !file.key.endsWith('/'));

    return NextResponse.json(files);
  } catch (error: any) {
    console.error('Error listing S3 files:', error);
    return NextResponse.json(
      { message: 'Error listing S3 files', details: error.message || String(error) },
      { status: 500 }
    );
  }
}

