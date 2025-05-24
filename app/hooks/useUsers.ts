import { useState, useEffect, useCallback } from "react";
import { UserData } from "@lib/types";

export function useUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshData = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:3000/api/users");
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data: UserData[] = await response.json();
        setUsers(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred while fetching users.");
        }
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [refreshTrigger]); 

  return { users, isLoading, error, refreshData };
}
