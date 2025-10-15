import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.COGNITO_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
      Prefix: 'ubunation/gallery/',
    });

    const { Contents } = await s3Client.send(command);

    // Handle case where Contents might be undefined (e.g., empty folder)
    const files = Contents
      ? Contents.map((file) => ({
          key: file.Key,
          // FIX: Removed the incorrect '/assets/' from the URL path.
          url: `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`,
        }))
      : []; // Return an empty array if there are no contents

    return NextResponse.json(files);
  } catch (error) {
    console.error('Error listing S3 files:', error);
    // Return a proper error response with a message
    return NextResponse.json({ message: 'Error listing S3 files', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
