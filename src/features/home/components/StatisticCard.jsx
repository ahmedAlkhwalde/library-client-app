export default function StatisticCard({
  icon,
  title,
  value,
  description,
  iconBg = "bg-indigo-100",
  textColor = "text-gray-400"
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h3 className="text-2xl font-bold text-gray-900">
            {value}
          </h3>

          {description && (
            <p className={`text-sm font-medium ${textColor}`}>
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}