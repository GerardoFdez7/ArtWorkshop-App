import { useState, useEffect, useCallback } from "react";
import { WorkshopData } from "@lib/types";

export function useWorkshops() {
  const [workshops, setWorkshops] = useState<WorkshopData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshData = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const fetchWorkshops = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:3000/api/workshops");
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data: WorkshopData[] = await response.json();
        setWorkshops(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred while fetching workshops.");
        }
        setWorkshops([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkshops();
  }, [refreshTrigger]); 

  return { workshops, isLoading, error, refreshData };
}
