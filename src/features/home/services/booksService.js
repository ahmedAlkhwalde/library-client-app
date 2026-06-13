import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../config/apiClient";

export const fetchBooks = async (page = 1, categoryId = null, status = "all") => {
  
  if (categoryId) {
    const response = await apiClient.get("/books/filter", {
      params: { 
        page: page,
        category_id: Number(categoryId), 
        status: status
      }
    });

    const data = response.data?.data;
    return {
      books: data?.books || [],
      pagination: data?.pagination,
    };
  }

  const response = await apiClient.get("/books", {
    params: {
      page,
      category_name: "All",
    },
  });

  const data = response.data?.data;
  return {
    books: data?.books || [],
    pagination: data?.pagination,
  };
};

export const useBooksQuery = (page = 1, categoryId = null, status = "all") => {
  return useQuery({
    queryKey: ["books", page, categoryId, status],
    queryFn: () => fetchBooks(page, categoryId, status),
    keepPreviousData: true, 
  });
};
