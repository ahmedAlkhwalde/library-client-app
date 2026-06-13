import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../config/apiClient";

export const borrowBook = async (bookId) => {
  const token = localStorage.getItem("token");

  const response = await apiClient.post(
    "/borrows",
    {
      book_id: bookId,
    },
    {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
    }
  );

  return response.data;
};

export const useBorrowBookMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: borrowBook,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });

      queryClient.invalidateQueries({
        queryKey: ["statistics"],
      });

      queryClient.invalidateQueries({
        queryKey: ["myBorrows"],
      });
    },
  });
};