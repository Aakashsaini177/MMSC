import { useEffect, useState } from "react";
import api from "../api";

const ClientTable = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data } = await api.get("/clients");
        setClients(data.slice(0, 5)); // Get top 5 recent clients
      } catch (error) {
        console.error("Failed to fetch clients", error);
      }
    };
    fetchClients();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-brand-light/20">
        <thead className="bg-brand-lightest/50">
          <tr>
            <th className="text-left px-6 py-4 text-xs font-bold text-brand-primary uppercase tracking-wider">
              Client Name
            </th>
            <th className="text-left px-6 py-4 text-xs font-bold text-brand-primary uppercase tracking-wider">
              Email
            </th>
            <th className="text-left px-6 py-4 text-xs font-bold text-brand-primary uppercase tracking-wider">
              GST Number
            </th>
            <th className="text-left px-6 py-4 text-xs font-bold text-brand-primary uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-light/20 bg-transparent">
          {clients.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                className="px-6 py-8 text-center text-brand-primary/60"
              >
                No recent clients found.
              </td>
            </tr>
          ) : (
            clients.map((client) => (
              <tr
                key={client._id}
                className="hover:bg-brand-lightest/30 transition-colors group cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-dark flex items-center justify-center text-white text-sm font-bold mr-4 shadow-md group-hover:scale-110 transition-transform">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-sm font-bold text-brand-dark group-hover:text-brand-primary transition-colors">
                      {client.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-primary/80">
                  {client.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-dark/70 font-mono bg-brand-lightest/50 px-2 rounded-md inline-block mt-2">
                  {client.gstNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full border ${
                      client.status === "Active"
                        ? "bg-blue-50 text-blue-700 border-blue-100"
                        : client.status === "Pending"
                        ? "bg-orange-50 text-orange-700 border-orange-100"
                        : "bg-red-50 text-red-700 border-red-100"
                    }`}
                  >
                    {client.status || "Active"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;
