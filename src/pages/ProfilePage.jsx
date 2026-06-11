import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProfile, updateProfile, profileKeys } from "../features/profile/service/profileService";
import ProfileHeader from "../features/profile/components/ProfileHeader";
import AccountSettingsForm from "../features/profile/components/AccountSettingsForm";
import AppSnackbar from "../components/AppSnackbar";
import { useDispatch } from "react-redux";
import { updateUser } from "../features/auth/store/authSlice";
import { CircularProgress } from "@mui/material";

// دوال مساعدة لتحويل رقم الهاتف
const extractDigits = (phone) => {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
};

const convertToLocal = (phone) => {
  const digits = extractDigits(phone);
  if (digits.length === 12 && digits.startsWith("963")) {
    return "0" + digits.slice(3);
  }
  if (digits.length === 10 && digits.startsWith("0")) {
    return digits;
  }
  return phone;
};

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", image: null });
  const [originalData, setOriginalData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", variant: "success" });

  const { data: user, isLoading } = useQuery({ 
    queryKey: profileKeys.details(), 
    queryFn: fetchProfile,
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(profileKeys.details());
      setIsEditing(false);
      setSnackbar({ open: true, message: "Profile updated successfully!", variant: "success" });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Operation failed, please try again.";
      setSnackbar({ open: true, message: msg, variant: "error" });
    }
  });

  useEffect(() => {
    if (user) {
      const d = { name: user.name, email: user.email, phone: user.mobile, image: user.image };
      setFormData(d);
      setOriginalData(d);
    }
    dispatch(updateUser(user));
  }, [user]);

  const handleSave = () => {
    const data = new FormData();
    if (formData.name !== originalData.name) data.append("name", formData.name);
    if (formData.phone !== originalData.phone) {
      const localPhone = convertToLocal(formData.phone);
      data.append("mobile", localPhone);
    }
    if (formData.image instanceof File) {
      console.log("Appending new image file to formData:", formData.image);
      data.append("image", formData.image);

    }
    
    if ([...data.entries()].length === 0) {
      setSnackbar({ open: true, message: "لم تقم بإجراء أي تغييرات لحفظها.", variant: "info" });
      return;
    }
    mutation.mutate({ id: user.id, formData: data });
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <CircularProgress />
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <ProfileHeader 
        user={user} 
        currentImage={formData.image} 
        isEditing={isEditing} 
        onImageClick={() => fileInputRef.current?.click()} 
      />
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={(e) => setFormData({...formData, image: e.target.files[0]})} 
      />
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <AccountSettingsForm 
          formData={formData} 
          setFormData={setFormData}
          isEditing={isEditing} 
          onEdit={() => setIsEditing(true)}
          onCancel={() => { setFormData(originalData); setIsEditing(false); }}
          onSave={handleSave} 
          isLoading={mutation.isPending}
        />
      </div>
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        variant={snackbar.variant}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}