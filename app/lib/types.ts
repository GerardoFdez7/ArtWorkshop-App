export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED"

export interface ReservationData {
  reservation_id: number;
  user: number;
  email: string;
  workshop: number;
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

export interface UserData {
  user_id: number;
  full_name: string;
  email: string;
  phone: string;
  created_at: Date;
}

export interface WorkshopData {
  workshop_id: number;
  title: string;
  description: string;
  date: string;
  duration_minutes: number;
  capacity: number;
  instructor_id: number;
}

export interface CreateReservationParams {
  user_id: number;
  workshop_id: number;
  date: Date;
  status?: ReservationStatus;
  attended?: boolean | false;
}

export interface UpdateReservationParams {
  reservation_id?: number;
  user_id?: number;
  workshop_id?: number;
  reservation_date?: string;
  status?: ReservationStatus;
  attended?: boolean;
}