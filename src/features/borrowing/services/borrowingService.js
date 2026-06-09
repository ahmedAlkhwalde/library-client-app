import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../config/apiClient";

export const fetchMyBorrows = async (status = "") => {
  const params = status ? { status } : {};
  const token = localStorage.getItem("token");
  const response = await apiClient.get("/borrows", {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return response.data;
};

export const useMyBorrowsQuery = (status = "", options = {}) =>
  useQuery({
    queryKey: ["myBorrows", status],
    queryFn: () => fetchMyBorrows(status),
    ...options,
  });
