import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

export default function BorrowConfirmationDialog({
  open,
  onClose,
  onConfirm,
  isLoading,
}) {
  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      PaperProps={{
    sx: {
      borderRadius: 4,
      maxWidth: 580,
      width: "100%",
    },
  }}
    >
      <DialogContent className="text-center py-10 px-8">
        <div className="flex justify-center mb-5">
          <div className="w-30 h-30 rounded-full bg-indigo-100 flex items-center justify-center">
            <LibraryBooksIcon
              sx={{
                fontSize: 50,
                color: "#4f46e5",
              }}
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          Confirm Reservation
        </h2>

        <p className="mt-4 text-gray-500 leading-7">
          Are you sure you want to borrow this book?
          You must pick it up from the library within
          12 hours, or the reservation will be
          automatically canceled.
        </p>
      </DialogContent>

     <DialogActions
  sx={{
    justifyContent: "center",
    gap: 2,
    px: 4,
    pb: 4,
  }}
>
        <Button
        onClick={onClose}
         disabled={isLoading}
         sx={{
          textTransform: "none",
         borderRadius: "12px",
         minWidth: 140,
          py: 1.2,
          borderColor: "#d1d5db",
          
          }}
>
  Cancel
</Button>

<Button
  variant="contained"
  onClick={onConfirm}
  disabled={isLoading}
  sx={{
    textTransform: "none",
    borderRadius: "12px",
    minWidth: 180,
    py: 1.2,
    backgroundColor: "#4f46e5",
  }}
>
  Confirm Reservation
</Button>
      </DialogActions>
    </Dialog>
  );
}