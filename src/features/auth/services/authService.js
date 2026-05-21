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
