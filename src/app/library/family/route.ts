import { NextResponse } from "next/server";
import { prisma } from "~/server/db";

export async function GET() {
  const data = await prisma.productFamily.findMany({
    select: {
      name: true,
    },
  });

  return NextResponse.json(data);
}
