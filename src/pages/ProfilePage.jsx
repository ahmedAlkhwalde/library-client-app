import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { EditOutlined, PersonOutline } from "@mui/icons-material";
import { useProfileQuery, useUpdateProfileMutation } from "../features/profile/services/profileService";
import { updateUser } from "../features/auth/store/authSlice";

const TABS = [
  { key: "account", label: "Account Settings" },
  { key: "library", label: "Library Settings" },
];

export default function ProfilePage() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("account");

  const { data, isLoading, isError } = useProfileQuery();
  const user = data?.data?.user;

  // Account form state
  const [accountForm, setAccountForm] = useState({ email: "", mobile: "" });
  // Library form state
  const [libraryForm, setLibraryForm] = useState({ name: "" });

  const [successMsg, setSuccessMsg] = useState("");

  //const updateMutation = useUpdateProfileMutation({
  //  onSuccess: (res) => {
  //    if (res?.data?.user) {
  //      dispatch(updateUser(res.data.user));
  //    }
  //    setSuccessMsg("Changes saved successfully.");
  //    setTimeout(() => setSuccessMsg(""), 3000);
  //  },
  //});

  // Populate forms when profile loads
  useEffect(() => {
    if (user) {
      setAccountForm({ email: user.email ?? "", mobile: user.mobile ?? "" });
      setLibraryForm({ name: user.name ?? "" });
    }
  }, [user]);

  //const handleAccountSave = () => {
  //  updateMutation.mutate({ email: accountForm.email, mobile: accountForm.mobile });
  //};

  //const handleLibrarySave = () => {
  //  updateMutation.mutate({ name: libraryForm.name });
  //};

  if (isLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl border border-(--color-border) p-6 animate-pulse h-64" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm">
          Failed to load profile. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      {/* Success toast */}
      {successMsg && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-2.5 text-sm font-medium">
          {successMsg}
        </div>
      )}

      {/* Profile header card */}
      <div className="bg-white rounded-2xl border border-(--color-border) p-5 sm:p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-(--color-accent-soft) border-2 border-(--color-border) flex items-center justify-center">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PersonOutline className="text-(--color-accent) !text-3xl" />
                )}
              </div>
              {/* Verified badge */}
              {user?.is_verified && (
                <span className="absolute bottom-0 right-0 w-5 h-5 bg-(--color-accent) rounded-full flex items-center justify-center border-2 border-white">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>

            {/* Name + email */}
            <div>
              <h2 className="font-bold text-(--color-text) text-base sm:text-lg leading-tight">
                {user?.name ?? "—"}
              </h2>
              <p className="text-sm text-(--color-grey) mt-0.5">{user?.email ?? ""}</p>
            </div>
          </div>

          {/* Edit Profile button */}
          <button
            type="button"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-(--color-accent) text-white text-sm font-medium rounded-lg hover:bg-(--color-accent-secondary) transition-colors"
          >
            <EditOutlined className="!text-base" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Settings card */}
      <div className="bg-white rounded-2xl border border-(--color-border) overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-(--color-border)">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 sm:flex-none px-5 py-3.5 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.key
                  ? "border-(--color-accent) text-(--color-accent)"
                  : "border-transparent text-(--color-grey) hover:text-(--color-text)"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Account Settings */}
        {activeTab === "account" && (
          <div className="p-5 sm:p-6">
            <h3 className="font-semibold text-(--color-text) text-sm mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-(--color-grey) mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={accountForm.email}
                  onChange={(e) =>
                    setAccountForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-(--color-border) bg-(--color-primary) text-(--color-text) focus:outline-none focus:border-(--color-accent) transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-(--color-grey) mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={accountForm.mobile}
                  onChange={(e) =>
                    setAccountForm((f) => ({ ...f, mobile: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-(--color-border) bg-(--color-primary) text-(--color-text) focus:outline-none focus:border-(--color-accent) transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setAccountForm({
                    email: user?.email ?? "",
                    mobile: user?.mobile ?? "",
                  })
                }
                className="px-4 py-2 text-sm font-medium text-(--color-grey) border border-(--color-border) rounded-lg hover:bg-(--color-primary) transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium bg-(--color-accent) text-white rounded-lg hover:bg-(--color-accent-secondary) transition-colors disabled:opacity-60"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Library Settings */}
        {activeTab === "library" && (
          <div className="p-5 sm:p-6">
            <h3 className="font-semibold text-(--color-text) text-sm mb-4">
              Library Information
            </h3>
            <div className="mb-6">
              <label className="block text-xs font-medium text-(--color-grey) mb-1.5">
                Library Name
              </label>
              <input
                type="text"
                value={libraryForm.name}
                onChange={(e) =>
                  setLibraryForm((f) => ({ ...f, name: e.target.value }))
                }
                className="w-full sm:w-72 px-3 py-2.5 text-sm rounded-lg border border-(--color-border) bg-(--color-primary) text-(--color-text) focus:outline-none focus:border-(--color-accent) transition-colors"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setLibraryForm({ name: user?.name ?? "" })}
                className="px-4 py-2 text-sm font-medium text-(--color-grey) border border-(--color-border) rounded-lg hover:bg-(--color-primary) transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium bg-(--color-accent) text-white rounded-lg hover:bg-(--color-accent-secondary) transition-colors disabled:opacity-60"
              >
                "Save Changes"
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
