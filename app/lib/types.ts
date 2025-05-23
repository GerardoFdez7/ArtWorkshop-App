export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED"

export interface ReservationData {
  reservation_id: number;
  user: string;
  email: string;
  workshop: string;
  date: string;
  status: ReservationStatus;
  attended: boolean;
  duration: number;
  instructor: string;
}

export interface Reservation {
  id: number
  userId: number
  workshopId: number
  reservation_date: string
  status: ReservationStatus
  attended: boolean
}
