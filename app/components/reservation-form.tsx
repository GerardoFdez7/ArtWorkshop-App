"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@components/ui/button"
import { Calendar } from "@components/ui/calendar"
import { Checkbox } from "@components/ui/checkbox"
import { DialogFooter } from "@components/ui/dialog"
import { Label } from "@components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { mockUsers, mockWorkshops } from "@lib/mock-data"
import type { Reservation, ReservationStatus } from "@lib/types"

interface ReservationFormProps {
  reservation: Reservation | null
  onSubmit: (reservation: Reservation) => void
  onCancel: () => void
}

export function ReservationForm({ reservation, onSubmit, onCancel }: ReservationFormProps) {
  const [formData, setFormData] = useState<Reservation>({
    id: reservation?.id || 0,
    userId: reservation?.userId || mockUsers[0].id,
    workshopId: reservation?.workshopId || mockWorkshops[0].id,
    reservation_date: reservation?.reservation_date || new Date().toISOString(),
    status: reservation?.status || "PENDING",
    attended: reservation?.attended || false,
  })

  const [date, setDate] = useState<Date | undefined>(reservation ? new Date(reservation.reservation_date) : new Date())

  useEffect(() => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        reservation_date: date.toISOString(),
      }))
    }
  }, [date])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="userId" className="text-right">
            User
          </Label>
          <Select
            value={formData.userId.toString()}
            onValueChange={(value) => setFormData({ ...formData, userId: Number.parseInt(value) })}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {mockUsers.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.fullName} ({user.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="workshopId" className="text-right">
            Workshop
          </Label>
          <Select
            value={formData.workshopId.toString()}
            onValueChange={(value) => setFormData({ ...formData, workshopId: Number.parseInt(value) })}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a workshop" />
            </SelectTrigger>
            <SelectContent>
              {mockWorkshops.map((workshop) => (
                <SelectItem key={workshop.id} value={workshop.id.toString()}>
                  {workshop.title} ({workshop.duration_minutes} min)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="date" className="text-right">
            Date
          </Label>
          <div className="col-span-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">
            Status
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value: ReservationStatus) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="attended" className="text-right">
            Attended
          </Label>
          <div className="col-span-3 flex items-center space-x-2">
            <Checkbox
              id="attended"
              checked={formData.attended}
              onCheckedChange={(checked) => setFormData({ ...formData, attended: checked === true })}
            />
            <label
              htmlFor="attended"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Mark as attended
            </label>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  )
}
