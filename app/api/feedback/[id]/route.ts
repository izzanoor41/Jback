import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { PrismaTiDBCloud } from "@tidbcloud/prisma-adapter";
import { connect } from "@tidbcloud/serverless";
import { NextResponse } from "next/server";

function getPrismaClient() {
  const connection = connect({ url: process.env.DATABASE_URL });
  const adapter = new PrismaTiDBCloud(connection);
  return new PrismaClient({ adapter });
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const prisma = getPrismaClient();
  
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const feedback = await prisma.feedback.findUnique({
    where: { id },
    include: { customer: true },
  });

  if (!feedback) {
    return NextResponse.json({ success: false, message: "Feedback not found" }, { status: 404 });
  }

  // Get related feedback by sentiment and language
  let relateds: any[] = [];
  try {
    relateds = await prisma.feedback.findMany({
      where: {
        teamId: feedback.teamId,
        id: { not: id },
        OR: [
          { sentiment: feedback.sentiment },
          { detectedLanguage: feedback.detectedLanguage },
        ],
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        originalText: true,
        translatedText: true,
        sentiment: true,
        detectedLanguage: true,
        createdAt: true,
      },
    });
  } catch (e) {
    console.warn('Failed to get related feedback:', e);
  }

  return NextResponse.json({ 
    success: true, 
    message: "Success to get feedback", 
    data: { ...feedback, relateds } 
  }, { status: 200 });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const prisma = getPrismaClient();
  
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  
  const feedback = await prisma.feedback.update({
    where: { id },
    data: {
      isResolved: body.isResolved,
    },
  });

  return NextResponse.json({ success: true, message: "Feedback updated", data: feedback }, { status: 200 });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const prisma = getPrismaClient();
  
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  await prisma.feedback.delete({
    where: { id },
  });

  return NextResponse.json({ success: true, message: "Feedback deleted" }, { status: 200 });
}
