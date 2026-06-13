import {
  DashboardOutlined,
  MenuBookOutlined,
  LibraryBooksOutlined, // للأشياء المتعلقة بالكتب/الاستعارة
  PersonOutline,        // تم التعديل: للـ Profile
  LogoutOutlined,
  AssignmentTurnedIn,   // تم التعديل: خيار إضافي للاستعارة (إذا أردت تنويعاً)
} from "@mui/icons-material";

export const sidebarItems = [
  {
    key: "HomePage",
    label: "HomePage",
    icon: <DashboardOutlined />,
    to: "/app/dashboard",
  },
  {
    key: "books",
    label: "Books",
    icon: <MenuBookOutlined />,
    to: "/app/books",
  },
  {
    key: "MyBorrowing",
    label: "My Borrowing",
    icon: <LibraryBooksOutlined />, // مناسبة جداً للاستعارة
    to: "/app/myborrowing",
  },
  {
    key: "Profile",
    label: "Profile",
    icon: <PersonOutline />, // الأيقونة الصحيحة للبروفايل
    to: "/app/profile",
  },
  {
    key: "logout",
    label: "Logout",
    icon: <LogoutOutlined />,
    action: "logout",
  },
];