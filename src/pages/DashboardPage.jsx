import BooksSection from "../features/home/components/BooksSection";
import StatisticsSection from "../features/home/components/StatisticsSection";

export default function HomePage() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome Back 👋
        </h1>

        <p className="mt-2 text-gray-500">
          Here's an overview of your library activity.
        </p>
      </div>

      <StatisticsSection />
      
      <BooksSection />
    </div>
  );
}