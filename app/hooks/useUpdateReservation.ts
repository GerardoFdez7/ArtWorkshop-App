import { useState, useCallback } from "react";
import { ReservationData, UpdateReservationParams} from "@lib/types";

export function useUpdateReservation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedReservation, setUpdatedReservation] = useState<ReservationData | null>(null);

  const updateReservation = useCallback(async (params: UpdateReservationParams) => {
    setIsLoading(true);
    setError(null);
    setUpdatedReservation(null);
    try {
      const { reservation_id, user_id, workshop_id, reservation_date, status, attended } = params;
      
      // Prepare the data payload for Prisma
      const updateData: any = {};
      if (user_id !== undefined) {
        updateData.user = { connect: { user_id: user_id } };
      }
      if (workshop_id !== undefined) {
        updateData.workshop = { connect: { workshop_id: workshop_id } };
      }
      if (reservation_date !== undefined) {
        updateData.reservation_date = reservation_date;
      }
      if (status !== undefined) {
        updateData.status = status;
      }
      if (attended !== undefined) {
        updateData.attended = attended;
      }

      const response = await fetch(`http://localhost:3000/api/reservation/${reservation_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data: ReservationData = await response.json();
      setUpdatedReservation(data);
      return data;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred while updating reservation.");
      }
      setUpdatedReservation(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetError = useCallback(() => setError(null), []);

  return {
    updateReservation,
    isLoading,
    error,
    updatedReservation,
    resetError,
  };
}