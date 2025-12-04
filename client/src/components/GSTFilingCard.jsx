const GSTFilingCard = ({ filing }) => {
  const statusColor =
    filing.status === "Pending"
      ? "bg-yellow-100 text-yellow-800"
      : filing.status === "Submitted"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";

  return (
    <div className="p-4 border rounded-xl shadow-sm bg-white">
      <h3 className="text-lg font-semibold">{filing.clientName}</h3>
      <p className="text-sm text-gray-600">Period: {filing.filingPeriod}</p>
      <p className="text-sm text-gray-600">Due: {filing.dueDate}</p>
      <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${statusColor}`}>
        {filing.status}
      </span>
    </div>
  );
};

export default GSTFilingCard;
