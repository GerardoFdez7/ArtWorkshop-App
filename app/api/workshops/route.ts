import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const workshops = await prisma.workshop.findMany({
      orderBy: {
        date: 'asc', 
      },
    })

    return NextResponse.json(workshops)
  } catch (error) {
    console.error('Error fetching workshops:', error)
    return NextResponse.json({ error: 'Error loading workshops' }, { status: 500 })
  }
}
