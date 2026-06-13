import { useState } from "react";
import { useMyBorrowsQuery } from "../features/borrowing/services/borrowingService";
import {
  LibraryBooksOutlined,
  AccessTimeOutlined,
  CheckCircleOutline,
  ErrorOutline,
} from "@mui/icons-material";

const STATUS_TABS = [
  { key: "", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "borrowed", label: "Active" },
  { key: "returned", label: "Returned" },
];

function StatusBadge({ status }) {
  const map = {
    pending: {
      label: "Pending",
      cls: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    },
    borrowed: {
      label: "Active",
      cls: "bg-indigo-100 text-indigo-700 border border-indigo-200",
    },
    returned: {
      label: "Returned",
      cls: "bg-green-100 text-green-700 border border-green-200",
    },
    overdue: {
      label: "Overdue",
      cls: "bg-red-100 text-red-700 border border-red-200",
    },
  };
  const s = map[status] ?? {
    label: status,
    cls: "bg-gray-100 text-gray-600 border border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.cls}`}
    >
      {s.label}
    </span>
  );
}

function BorrowCard({ borrow }) {
  const isOverdue =
    borrow.status === "borrowed" &&
    borrow.due_at &&
    new Date(borrow.due_at) < new Date();

  return (
    <div className="bg-white rounded-2xl border border-(--color-border) p-4 sm:p-5 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow">
      {/* Book cover */}
      <div className="shrink-0">
        {borrow.book?.image ? (
          <img
            src={borrow.book.image}
            alt={borrow.book.title}
            className="w-16 h-20 sm:w-14 sm:h-18 object-cover rounded-lg border border-(--color-border)"
          />
        ) : (
          <div className="w-16 h-20 sm:w-14 sm:h-18 bg-(--color-accent-soft) rounded-lg flex items-center justify-center border border-(--color-border)">
            <LibraryBooksOutlined className="text-(--color-accent) !text-2xl" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <h3 className="font-semibold text-(--color-text) text-sm sm:text-base leading-tight">
              {borrow.book?.title ?? "—"}
            </h3>
            <p className="text-xs text-(--color-grey) mt-0.5">
              {borrow.book?.author ?? ""}
            </p>
          </div>
          <StatusBadge status={isOverdue ? "overdue" : borrow.status} />
        </div>

        {/* Inline Timestamps Row */}
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-(--color-grey)">
          {borrow.requested_at && (
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-(--color-text)">Requested:</span>
              <span>{borrow.requested_at}</span>
            </div>
          )}
          
          {borrow.borrowed_at && (
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-(--color-text)">Borrowed:</span>
              <span>{borrow.borrowed_at}</span>
            </div>
          )}
          
          {borrow.due_at && (
            <div className="flex items-center gap-1.5">
              <span
                className={`font-medium ${isOverdue ? "text-red-600" : "text-(--color-text)"}`}
              >
                Due:
              </span>
              <span className={isOverdue ? "text-red-600 font-semibold" : ""}>
                {borrow.due_at}
              </span>
            </div>
          )}
          
          {borrow.expires_at && borrow.status === "pending" && (
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-(--color-text)">Expires:</span>
              <span>{borrow.expires_at}</span>
            </div>
          )}
          
          {borrow.returned_at && (
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-(--color-text)">Returned:</span>
              <span>{borrow.returned_at}</span>
            </div>
          )}
        </div>

        {isOverdue && (
          <div className="mt-3 flex items-center gap-1 text-xs text-red-600 font-medium">
            <ErrorOutline className="!text-sm" />
            Return overdue — please return this book as soon as possible.
          </div>
        )}


        {isOverdue && (
          <div className="mt-2 flex items-center gap-1 text-xs text-red-600 font-medium">
            <ErrorOutline className="!text-sm" />
            Return overdue — please return this book as soon as possible.
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ status }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <LibraryBooksOutlined className="text-(--color-grey) !text-5xl mb-3 opacity-40" />
      <p className="text-(--color-grey) text-sm">
        {status
          ? `No ${status} borrowings found.`
          : "You have no borrowing history yet."}
      </p>
    </div>
  );
}

export default function MyBorrowingPage() {
  const [activeTab, setActiveTab] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useMyBorrowsQuery(activeTab);

  const borrows = data?.data?.borrows ?? [];
  const pagination = data?.data?.pagination ?? null;

  const handleTabChange = (key) => {
    setActiveTab(key);
    setPage(1);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-(--color-text)">
          My Borrowings
        </h1>
        <p className="text-sm text-(--color-grey) mt-1">
          Track your active, pending, and returned books.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-(--color-primary) rounded-xl p-1 border border-(--color-border) mb-6 w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleTabChange(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-white text-(--color-accent) shadow-sm border border-(--color-border)"
                : "text-(--color-grey) hover:text-(--color-text)"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-(--color-border) p-5 h-28 animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl p-4 border border-red-200 text-sm">
          <ErrorOutline className="!text-base shrink-0" />
          Failed to load borrowings. Please try again later.
        </div>
      ) : borrows.length === 0 ? (
        <EmptyState status={activeTab} />
      ) : (
        <div className="flex flex-col gap-3">
          {borrows.map((borrow) => (
            <BorrowCard key={borrow.id} borrow={borrow} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-(--color-border)">
          <p className="text-xs text-(--color-grey)">
            Page {pagination.current_page} of {pagination.last_page} —{" "}
            {pagination.total} total
          </p>
          <div className="flex gap-1">
            <button
              type="button"
              disabled={pagination.current_page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-(--color-border) text-sm text-(--color-grey) disabled:opacity-40 hover:bg-(--color-primary) transition-colors"
            >
              ‹ Prev
            </button>
            <button
              type="button"
              disabled={!pagination.has_more}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-(--color-border) text-sm text-(--color-grey) disabled:opacity-40 hover:bg-(--color-primary) transition-colors"
            >
              Next ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
