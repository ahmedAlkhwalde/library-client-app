import { useBorrowBookMutation } from "../services/borrowService";
import { useState, useMemo } from "react";
import BorrowConfirmationDialog from "./BorrowConfirmationDialog";
import { toast } from "sonner";

export default function BookCard({ book, borrowStatus }) {
  const borrowMutation = useBorrowBookMutation();
  const [openDialog, setOpenDialog] = useState(false);

  const effectiveStatus = useMemo(() => {
    if (borrowStatus) return borrowStatus;
    return book.status;
  }, [borrowStatus, book.status]);

  const statusConfig = {
    available: {
      label: "Available",
      badge: "bg-green-50 text-green-600",
      button: "Borrow Book",
      buttonClass: "bg-indigo-600 hover:bg-indigo-700 text-white",
      canBorrow: true,
    },

    borrowed: {
      label: "Borrowed",
      badge: "bg-indigo-50 text-indigo-600",
      button: "View My Borrow",
      buttonClass:
        "border border-indigo-500 text-indigo-600 hover:bg-indigo-50",
      canBorrow: false,
    },

    unavailable: {
      label: "Not Available",
      badge: "bg-gray-100 text-gray-600",
      button: "Unavailable",
      buttonClass: "bg-gray-200 text-gray-500 cursor-not-allowed",
      canBorrow: false,
    },

    pending: {
      label: "Pending",
      badge: "bg-yellow-100 text-yellow-700",
      button: "Request Pending",
      buttonClass: "bg-yellow-100 text-yellow-700 cursor-not-allowed",
      canBorrow: false,
    },

    overdue: {
      label: "Overdue",
      badge: "bg-red-100 text-red-600",
      button: "Return Required",
      buttonClass: "bg-red-100 text-red-600 cursor-not-allowed",
      canBorrow: false,
    },
  };

  const currentStatus =
    statusConfig[effectiveStatus] || statusConfig.available;

  const isDisabled = !currentStatus.canBorrow;

  const handleConfirmBorrow = () => {
    borrowMutation.mutate(book.id, {
      onSuccess: (response) => {
        setOpenDialog(false);
        toast.success("Reservation Confirmed", {
          description:
            response?.message ||
            "You have successfully reserved the book. Please pick it up within 12 hours.",
        });
      },

      onError: (error) => {
        setOpenDialog(false);

        toast.error(
          error?.response?.data?.message ||
            "Failed to borrow book"
        );
      },
    });
  };

  return (
    <div className="overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      {/* Image */}
      <div className="relative h-64 bg-gray-100">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${currentStatus.badge}`}
          >
            {currentStatus.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <span className="inline-block px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-600">
          {book.category_name}
        </span>

        <h3 className="mt-3 text-xl font-bold text-gray-900 line-clamp-1">
          {book.title}
        </h3>

        <p className="mt-1 text-gray-500">{book.author}</p>

        <div className="mt-6">
          <button
  disabled={isDisabled}
  className={`w-full py-3 rounded-xl font-medium transition ${currentStatus.buttonClass}`}
  onClick={() => {
    if (isDisabled) return;
    setOpenDialog(true);
  }}
>
  {currentStatus.button}
</button>
        </div>
      </div>

      <BorrowConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmBorrow}
        isLoading={borrowMutation.isPending}
      />
    </div>
  );
}