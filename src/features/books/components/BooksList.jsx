import { useState } from "react";
import { CircularProgress, Pagination, Stack } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";

import BookCard from "../../home/components/BookCard";
import { useBooksQuery } from "../../home/services/booksService";
import { useMyBorrowsQuery } from "../../home/services/borrowsService";
import { useCategoriesQuery } from "../../home/services/categoriesService";

export default function BooksList() {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { data: categoriesData } = useCategoriesQuery();
  const { data: booksData, isLoading, isError } = useBooksQuery(page, selectedCategory);
  const { data: borrows = [] } = useMyBorrowsQuery();

  const handleCategoryChange = (e) => {
    const value = e.target.value ? Number(e.target.value) : null;
    setSelectedCategory(value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
        Failed to load books
      </div>
    );
  }

  const books = booksData?.books || [];
  const pagination = booksData?.pagination;

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Explore Library</h2>
          <p className="text-gray-500">Search, filter, and discover books from our entire collection</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <TuneIcon sx={{ fontSize: 18 }} />
            <select
              value={selectedCategory || ""}
              onChange={handleCategoryChange}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 outline-none min-w-[180px]"
            >
              <option value="">All Categories</option>
              {categoriesData?.data?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {books.map((book) => {
          const userBorrow = borrows.find(
            (borrow) => borrow.book.id === book.id && borrow.status !== "returned"
          );
          return (
            <BookCard
              key={book.id}
              book={book}
              borrowStatus={userBorrow?.status || null}
            />
          );
        })}
      </div>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex justify-center pt-6">
          <Stack spacing={2}>
            <Pagination
              count={pagination.last_page}
              page={pagination.current_page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              shape="rounded"
              size="large"
            />
          </Stack>
        </div>
      )}

      {books.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No books found in this category.</p>
        </div>
      )}
    </div>
  );
}