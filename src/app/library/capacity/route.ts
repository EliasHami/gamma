import { NextResponse } from "next/server";
import { prisma } from "~/server/db";

export async function GET() {
  const data = await prisma.productCapacity.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return NextResponse.json(data);
}
