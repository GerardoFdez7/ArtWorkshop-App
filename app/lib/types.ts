export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED"

export interface User {
  id: number
  fullName: string
  email: string
}

export interface Workshop {
  id: number
  title: string
  duration_minutes: number
  instructorId: number
}

export interface Instructor {
  id: number
  fullName: string
}

export interface Reservation {
  id: number
  userId: number
  workshopId: number
  reservation_date: string
  status: ReservationStatus
  attended: boolean
}

export interface ReservationSummary {
  userFullName: string
  userEmail: string
  workshopTitle: string
  reservation_date: string
  status: ReservationStatus
  attended: boolean
  duration_minutes: number
  instructorFullName: string
}
