import { useQuery, useMutation } from "@tanstack/react-query";
import apiClient from "../../../config/apiClient";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchProfile = async () => {
  const response = await apiClient.get("/profile", {
    headers: authHeaders(),
  });
  return response.data;
};

export const useProfileQuery = (options = {}) =>
  useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    ...options,
  });

export const updateProfile = async (payload) => {
  const response = await apiClient.put("/profile", payload, {
    headers: authHeaders(),
  });
  return response.data;
};

export const useUpdateProfileMutation = (options = {}) =>
  useMutation({
    mutationFn: updateProfile,
    ...options,
  });
