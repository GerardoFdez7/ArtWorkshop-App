import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const data = await req.json();

  const { user_id, workshop_id, status } = data;

  try {
    const reservation = await prisma.reservation.create({
      data: {
        user_id,
        workshop_id,
        status,
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating reservation", details: error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await prisma.$queryRaw`
      SELECT * FROM reservation_summary
    `;
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching reservation summary:", error);
    return NextResponse.json(
      { error: "Error loading reservation summary" },
      { status: 500 }
    );
  }
}
