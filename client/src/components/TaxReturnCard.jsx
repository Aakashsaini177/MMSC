const TaxReturnCard = ({ tax }) => {
  const statusColor =
    tax.status === "Filed"
      ? "bg-green-100 text-green-800"
      : tax.status === "Pending"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";

  return (
    <div className="p-4 border rounded-xl shadow-sm bg-white">
      <h3 className="text-lg font-semibold">{tax.clientName}</h3>
      <p className="text-sm text-gray-600">AY: {tax.assessmentYear}</p>
      <p className="text-sm text-gray-600">Ack: {tax.acknowledgement}</p>
      <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${statusColor}`}>
        {tax.status}
      </span>
    </div>
  );
};

export default TaxReturnCard;
