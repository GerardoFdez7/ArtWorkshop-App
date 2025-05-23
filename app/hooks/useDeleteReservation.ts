import { useState } from "react";

export function useDeleteReservation() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteReservation = async (
    reservationId: number,
    onSuccess?: () => void
  ) => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/api/reservation/${reservationId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to delete reservation: ${response.status}`);
      }
      if (onSuccess) onSuccess();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setDeleteError(error.message || "Unknown error");
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteReservation, isDeleting, deleteError };
}