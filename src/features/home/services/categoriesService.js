import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../config/apiClient";


const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const formatTime = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

const normalizeCategory = (cat) => ({
  ...cat,
  status: cat.status || "active",
  created_date: formatDate(cat.created_at),
  created_time: formatTime(cat.created_at),
});

export const fetchCategories = async ({ page = 1, search = "", status = "" } = {}) => {
  const response = await apiClient.get("/categories", { params: { page, search, status } });
  const raw = response.data?.data?.categories || [];
  const categories = raw.map(normalizeCategory);
  const total = categories.length;
  return { data: categories, total, last_page: Math.max(1, Math.ceil(total / 6)) };
};
export const useCategoriesQuery = (params = {}) =>
  useQuery({
    queryKey: ["categories", params],
    queryFn: () => fetchCategories(params),
    placeholderData: (prev) => prev,
  });