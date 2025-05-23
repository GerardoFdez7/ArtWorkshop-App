import type { User, Workshop, Instructor, Reservation, ReservationSummary } from "./types"

export const mockUsers: User[] = [
  { id: 1, fullName: "John Doe", email: "john.doe@example.com" },
  { id: 2, fullName: "Jane Smith", email: "jane.smith@example.com" },
  { id: 3, fullName: "Robert Johnson", email: "robert.j@example.com" },
  { id: 4, fullName: "Emily Davis", email: "emily.d@example.com" },
  { id: 5, fullName: "Michael Brown", email: "michael.b@example.com" },
]

export const mockInstructors: Instructor[] = [
  { id: 1, fullName: "Sarah Wilson" },
  { id: 2, fullName: "David Miller" },
  { id: 3, fullName: "Lisa Anderson" },
]

export const mockWorkshops: Workshop[] = [
  { id: 1, title: "Watercolor Basics", duration_minutes: 120, instructorId: 1 },
  { id: 2, title: "Oil Painting Techniques", duration_minutes: 180, instructorId: 2 },
  { id: 3, title: "Sculpture Fundamentals", duration_minutes: 240, instructorId: 3 },
  { id: 4, title: "Digital Art Workshop", duration_minutes: 150, instructorId: 1 },
  { id: 5, title: "Portrait Drawing", duration_minutes: 120, instructorId: 2 },
]

export const mockReservations: Reservation[] = [
  {
    id: 1,
    userId: 1,
    workshopId: 1,
    reservation_date: "2023-05-15T10:00:00.000Z",
    status: "CONFIRMED",
    attended: true,
  },
  {
    id: 2,
    userId: 2,
    workshopId: 3,
    reservation_date: "2023-05-20T14:00:00.000Z",
    status: "CONFIRMED",
    attended: false,
  },
  {
    id: 3,
    userId: 3,
    workshopId: 2,
    reservation_date: "2023-06-05T09:30:00.000Z",
    status: "PENDING",
    attended: false,
  },
  {
    id: 4,
    userId: 4,
    workshopId: 5,
    reservation_date: "2023-06-10T13:00:00.000Z",
    status: "CANCELLED",
    attended: false,
  },
  {
    id: 5,
    userId: 5,
    workshopId: 4,
    reservation_date: "2023-06-15T11:00:00.000Z",
    status: "CONFIRMED",
    attended: true,
  },
]

// Generate summary view by joining the data
export const mockSummaryView: ReservationSummary[] = mockReservations.map((reservation) => {
  const user = mockUsers.find((u) => u.id === reservation.userId)!
  const workshop = mockWorkshops.find((w) => w.id === reservation.workshopId)!
  const instructor = mockInstructors.find((i) => i.id === workshop.instructorId)!

  return {
    userFullName: user.fullName,
    userEmail: user.email,
    workshopTitle: workshop.title,
    reservation_date: reservation.reservation_date,
    status: reservation.status,
    attended: reservation.attended,
    duration_minutes: workshop.duration_minutes,
    instructorFullName: instructor.fullName,
  }
})
