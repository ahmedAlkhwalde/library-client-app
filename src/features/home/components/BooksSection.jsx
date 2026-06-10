import { CircularProgress } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import { useState } from "react";

import { useBooksQuery } from "../services/booksService";
import { useCategoriesQuery } from "../services/categoriesService";
import { useMyBorrowsQuery } from "../services/borrowsService";

import BookCard from "./BookCard";

export default function BooksSection() {
  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const { data: categoriesData } =
    useCategoriesQuery();

  const {
    data: booksData,
    isLoading: booksLoading,
    isError: booksError,
  } = useBooksQuery(
    1,
    selectedCategory
  );

  const {
    data: borrows = [],
  } = useMyBorrowsQuery();

  if (booksLoading) {
    return (
      <div className="flex justify-center py-10">
        <CircularProgress />
      </div>
    );
  }

  if (booksError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
        Failed to load books
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Browse the Collection
          </h2>

          <p className="text-gray-500">
            Discover new reads curated for you
          </p>
        </div>

        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <TuneIcon sx={{ fontSize: 18 }} />

            <select
              value={selectedCategory || ""}
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value
                    ? Number(e.target.value)
                    : null
                )
              }
              className="
                px-4 py-3
                border border-gray-200
                rounded-xl
                bg-white
                text-gray-700
                outline-none
                min-w-[180px]
              "
            >
              <option value="">
                All Categories
              </option>

              {categoriesData?.data?.map(
                (category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                )
              )}
            </select>
          </div>

          <button
            className="
              px-5 py-2
              rounded-xl
              bg-indigo-600
              text-white
              hover:bg-indigo-700
              transition
            "
          >
            See All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {booksData.books.map((book) => {
          const userBorrow = borrows.find(
            (borrow) =>
              borrow.book.id === book.id &&
              borrow.status !== "returned"
          );

          return (
            <BookCard
              key={book.id}
              book={book}
              borrowStatus={
                userBorrow?.status || null
              }
            />
          );
        })}
      </div>
    </section>
  );
}