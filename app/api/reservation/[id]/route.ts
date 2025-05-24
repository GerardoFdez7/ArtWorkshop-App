import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const routeParams = await Promise.resolve(context.params);
  const { id } = routeParams;

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
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const routeParams = await Promise.resolve(context.params);
  const { id } = routeParams;

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

    // Prepare update data - handle nested relations
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    
    // Handle direct fields
    if (data.reservation_date !== undefined) {
      updateData.reservation_date = data.reservation_date;
    }
    if (data.status !== undefined) {
      updateData.status = data.status;
    }
    if (data.attended !== undefined) {
      updateData.attended = data.attended;
    }
    
    // Handle relations
    if (data.user && data.user.connect && data.user.connect.user_id) {
      updateData.user_id = data.user.connect.user_id;
    }
    if (data.workshop && data.workshop.connect && data.workshop.connect.workshop_id) {
      updateData.workshop_id = data.workshop.connect.workshop_id;
    }

    const updated = await prisma.reservation.update({
      where: { reservation_id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (err) {
    // More robust error logging
    let errorDetails = "Unknown error during PUT operation";
    let errorStack = undefined;

    if (err instanceof Error) {
      errorDetails = err.message;
      errorStack = err.stack;
      console.error("PUT Error Name:", err.name);
      console.error("PUT Error Message:", err.message);
      if (err.stack) {
        console.error("PUT Error Stack:", err.stack);
      }
    } else {
      // Handle cases where 'err' is not an Error object
      errorDetails = String(err);
      console.error("PUT Error (non-Error type):", err);
    }

    return NextResponse.json(
      { error: "Server error", details: errorDetails, stack: process.env.NODE_ENV === 'development' ? errorStack : undefined }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const routeParams = await Promise.resolve(context.params);
  const { id } = routeParams;

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
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
