import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../config/apiClient";

export const fetchStatistics = async () => {
  const token = localStorage.getItem("token");

  const response = await apiClient.get("/statistics", {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : undefined,
  });

  return response.data.data;
};

export const useStatisticsQuery = (options = {}) =>
  useQuery({
    queryKey: ["statistics"],
    queryFn: fetchStatistics,
    ...options,
  });