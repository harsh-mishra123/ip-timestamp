// app/api/documents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const documents = await prisma.document.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: 'desc' }
  });
  
  return NextResponse.json(documents);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const data = await request.json();
  
  const document = await prisma.document.create({
    data: {
      title: data.title,
      hash: data.hash,
      txHash: data.txHash,
      arweaveId: data.cid,
      fileUrl: data.url,
      metadata: data.metadata,
      user: { connect: { email: session!.user!.email! } }
    }
  });
  
  return NextResponse.json(document);
}