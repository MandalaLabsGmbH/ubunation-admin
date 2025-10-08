import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Prefix: 'ubunation/gallery/',
    });

    const { Contents } = await s3Client.send(command);
    const files = Contents?.map((file) => ({
      key: file.Key,
      url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/assets/${file.Key}`,
    }));

    return NextResponse.json(files);
  } catch (error) {
    console.error('Error listing S3 files:', error);
    return NextResponse.json({ message: 'Error listing S3 files' }, { status: 500 });
  }
}