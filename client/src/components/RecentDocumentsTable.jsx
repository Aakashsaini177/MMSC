const RecentDocumentsTable = () => {
  const documents = [
    { fileName: "ITR_2024_Ravi.pdf", uploadedBy: "Admin", date: "2025-07-21" },
    { fileName: "GST_Report_June.xlsx", uploadedBy: "Admin", date: "2025-07-19" },
    { fileName: "PAN_Update.docx", uploadedBy: "Admin", date: "2025-07-18" },
  ];

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">File Name</th>
            <th className="px-4 py-2 text-left">Uploaded By</th>
            <th className="px-4 py-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{doc.fileName}</td>
              <td className="px-4 py-2">{doc.uploadedBy}</td>
              <td className="px-4 py-2">{doc.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentDocumentsTable;
