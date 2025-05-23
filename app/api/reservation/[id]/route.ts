import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json(
      { error: "Invalid or missing ID" },
      { status: 400 }
    );
  }

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { reservation_id: parseInt(id) },
      include: {
        user: true,
        workshop: true,
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(reservation);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json(
      { error: "Invalid or missing ID" },
      { status: 400 }
    );
  }

  try {
    const data = await req.json();

    // Verificar si la reservación existe antes de actualizar
    const existingReservation = await prisma.reservation.findUnique({
      where: { reservation_id: parseInt(id) },
    });

    if (!existingReservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.reservation.update({
      where: { reservation_id: parseInt(id) },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json(
      { error: "Invalid or missing ID" },
      { status: 400 }
    );
  }

  try {
    // Verificar si la reservación existe antes de eliminar
    const existingReservation = await prisma.reservation.findUnique({
      where: { reservation_id: parseInt(id) },
    });

    if (!existingReservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    await prisma.reservation.delete({
      where: { reservation_id: parseInt(id) },
    });

    return NextResponse.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
