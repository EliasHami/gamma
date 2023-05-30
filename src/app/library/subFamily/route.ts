import { NextResponse } from "next/server";
import { prisma } from "~/server/db";

export async function GET() {
  const data = await prisma.productSubFamily.findMany({
    select: {
      name: true,
    },
  });

  return NextResponse.json(data);
}
