import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../config/apiClient";

export const registerUser = async (payload) => {
  const response = await apiClient.post("/register", payload);
  return response.data;
};

export const useRegisterMutation = (options = {}) =>
  useMutation({
    mutationFn: registerUser,
    ...options,
  });

export const loginUser = async (payload) => {
  const response = await apiClient.post("/login", payload);
  return response.data;
};

export const useLoginMutation = (options = {}) =>
  useMutation({
    mutationFn: loginUser,
    ...options,
  });


  

export const verifyCode = async (payload) => {
  const response = await apiClient.post("/verify-code", payload);
  return response.data;
};

export const useVerifyCodeMutation = (options = {}) =>
  useMutation({
    mutationFn: verifyCode,
    ...options,
  });

export const resendCode = async (payload) => {
  const response = await apiClient.post("/resend-code", payload);
  return response.data;
};

export const useResendCodeMutation = (options = {}) =>
  useMutation({
    mutationFn: resendCode,
    ...options,
  });

  export const logoutUser = async () => {
  const token = localStorage.getItem("token");
  const response = await apiClient.post("/logout", null, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return response.data;
};

export const useLogoutMutation = (options = {}) =>
  useMutation({
    mutationFn: logoutUser,
    ...options,
  });

