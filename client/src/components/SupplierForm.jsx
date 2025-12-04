import { useEffect, useState } from "react";

const SupplierForm = ({ onSubmit, initialData }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gstNumber: "",
    address: ""
  });

  // Populate form on edit
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
        gstNumber: "",
        address: ""
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Supplier name is required");
      return;
    }
    onSubmit(form);
    // Reset form only if adding new
    if (!form._id) {
      setForm({
        name: "",
        email: "",
        phone: "",
        gstNumber: "",
        address: ""
      });
    }
  };

  const handleClear = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      gstNumber: "",
      address: ""
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white shadow rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="text"
        name="name"
        placeholder="Supplier Name"
        value={form.name}
        onChange={handleChange}
        required
        className="border p-2 rounded"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        type="text"
        name="gstNumber"
        placeholder="GST Number"
        value={form.gstNumber}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <textarea
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
        className="border p-2 rounded col-span-full"
      ></textarea>

      <div className="flex gap-4 col-span-full justify-end">
        <button
          type="submit"
          disabled={!form.name.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {form._id ? "Update Supplier" : "Add Supplier"}
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default SupplierForm;
