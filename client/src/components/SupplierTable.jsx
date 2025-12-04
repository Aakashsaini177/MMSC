import React from "react";

const SupplierTable = ({ suppliers, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white shadow rounded">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">GST Number</th>
            <th className="p-2 border">Address</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s._id}>
              <td className="p-2 border">{s.name}</td>
              <td className="p-2 border">{s.email}</td>
              <td className="p-2 border">{s.phone}</td>
              <td className="p-2 border">{s.gstNumber}</td>
              <td className="p-2 border">{s.address}</td>
              <td className="p-2 border flex space-x-2">
                <button
                  onClick={() => onEdit(s)}
                  className="text-blue-600 hover:underline "
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(s._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {suppliers.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center p-4">
                No suppliers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierTable;
