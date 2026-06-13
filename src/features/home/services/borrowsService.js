import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../config/apiClient";

export const fetchMyBorrows = async () => {
  const token = localStorage.getItem("token");

  const response = await apiClient.get("/borrows", {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : undefined,
  });

  return response.data.data.borrows || [];
};

export const useMyBorrowsQuery = (options = {}) =>
  useQuery({
    queryKey: ["myBorrows"],
    queryFn: fetchMyBorrows,
    ...options,
  });