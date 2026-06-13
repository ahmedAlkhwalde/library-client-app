import { CircularProgress } from "@mui/material";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Inventory2Icon from "@mui/icons-material/Inventory2";

import StatisticCard from "./StatisticCard";
//import { useStatisticsQuery } from "../services/statisticsService";

export default function StatisticsSection() {
  //const { data, isLoading, isError } = useStatisticsQuery();

//   if (isLoading) {
//     return (
//       <div className="flex justify-center py-10">
//         <CircularProgress />
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
//         Failed to load statistics
//       </div>
//     );
//   }

  const cards = [
    {
      title: "Active Borrows",
      value: 15,
      description: "Currently borrowed books",
      icon: <MenuBookIcon />,
      iconBg: "bg-blue-100 text-blue-600",
      textColor: "text-blue-600",
    },
    {
      title: "Available Books",
      value: 1200,
      description: "Available in library",
      icon: <LibraryBooksIcon />,
      iconBg: "bg-green-100 text-green-600",
      textColor: "text-green-600",
    },
    {
      title: "Total Books",
      value: 3245,
      description: "Books in collection",
      icon: <Inventory2Icon />,
      iconBg: "bg-purple-100 text-purple-600",
      textColor: "text-purple-600",
    },
    {
      title: "Overdue Borrows",
      value: 1,
      description: "Need attention",
      icon: <WarningAmberIcon />,
      iconBg: "bg-red-100 text-red-600",
        textColor: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((card) => (
        <StatisticCard
          key={card.title}
          {...card}
        />
      ))}
    </div>
  );
}