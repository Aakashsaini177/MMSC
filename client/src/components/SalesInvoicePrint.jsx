import React, { useEffect, useState } from "react";
import api from "../api";

const SalesInvoicePrint = ({ sale }) => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/settings");
        setSettings(data);
      } catch (error) {
        console.error("Failed to fetch settings", error);
      }
    };
    fetchSettings();
  }, []);

  if (!sale) return null;

  const numberToWords = (num) => {
    if (!num) return "Zero Only";
    const a = [
      "",
      "One ",
      "Two ",
      "Three ",
      "Four ",
      "Five ",
      "Six ",
      "Seven ",
      "Eight ",
      "Nine ",
      "Ten ",
      "Eleven ",
      "Twelve ",
      "Thirteen ",
      "Fourteen ",
      "Fifteen ",
      "Sixteen ",
      "Seventeen ",
      "Eighteen ",
      "Nineteen ",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    if ((num = num.toString()).length > 9) return "overflow";
    const n = ("000000000" + num)
      .slice(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    let str = "";
    str +=
      n[1] != 0
        ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "Crore "
        : "";
    str +=
      n[2] != 0
        ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "Lakh "
        : "";
    str +=
      n[3] != 0
        ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "Thousand "
        : "";
    str +=
      n[4] != 0
        ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "Hundred "
        : "";
    str +=
      n[5] != 0
        ? (str != "" ? "and " : "") +
          (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) +
          "Only"
        : "Only";
    return str;
  };

  const safeTotal = sale.totalAmount || 0;
  const safePaid = sale.paidAmount || 0;
  const safePending = sale.pendingAmount || 0;
  const safeId = sale._id || "DRAFT";
  const safeDate = sale.saleDate
    ? new Date(sale.saleDate).toLocaleDateString()
    : new Date().toLocaleDateString();

  return (
    <div
      id="invoice-content"
      className="p-8 bg-white text-sm font-sans text-black"
      style={{ width: "210mm", minHeight: "297mm" }}
    >
      <div className="border border-gray-800">
        {/* Header */}
        <div className="flex justify-between border-b border-gray-800 bg-gray-100 p-4">
          <div className="w-2/3">
            <h1 className="text-2xl font-bold text-gray-900">
              {settings?.companyName || "MMSC ramser"}
            </h1>
            <p className="text-gray-700">
              Address: {settings?.address || "New Delhi, Delhi, 110058, India."}
            </p>
            <p className="text-gray-700">
              {settings?.city} {settings?.state} {settings?.pincode}
            </p>
            <p className="text-gray-700">
              Mobile: {settings?.phone || "+91 9876543210"} | Email:{" "}
              {settings?.email || "contact@mmsc.com"}
            </p>
            <p className="text-gray-700 font-semibold">
              GSTIN: {settings?.gstin || "07AAAAA0000A1Z5"} | PAN:{" "}
              {settings?.pan || "AAAAA0000A"}
            </p>
          </div>
          <div className="w-1/3 flex items-center justify-center border-l border-gray-800">
            <h2 className="text-3xl font-bold text-gray-400">INVOICE</h2>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="flex border-b border-gray-800">
          <div className="w-1/2 p-3 border-r border-gray-800">
            <div className="mb-2">
              <span className="font-bold block text-gray-600 text-xs uppercase">
                Invoice No
              </span>
              <span className="font-bold text-lg">
                {safeId.slice(-6).toUpperCase()}
              </span>
            </div>
            <div>
              <span className="font-bold block text-gray-600 text-xs uppercase">
                Date
              </span>
              <span className="font-semibold">{safeDate}</span>
            </div>
          </div>
          <div className="w-1/2 p-3 bg-blue-50/50">
            <div className="mb-2">
              <span className="font-bold block text-gray-600 text-xs uppercase">
                Billed To
              </span>
              <span className="font-bold text-lg">
                {sale.customerName || "N/A"}
              </span>
            </div>
            <div>
              <span className="font-bold block text-gray-600 text-xs uppercase">
                Place of Supply
              </span>
              <span className="font-semibold">Delhi (07)</span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-800 text-xs uppercase tracking-wider">
                <th className="border-r border-gray-800 p-2 w-12 text-center">
                  Sr.
                </th>
                <th className="border-r border-gray-800 p-2">
                  Item Description
                </th>
                <th className="border-r border-gray-800 p-2 w-20 text-center">
                  HSN
                </th>
                <th className="border-r border-gray-800 p-2 w-16 text-center">
                  Qty
                </th>
                <th className="border-r border-gray-800 p-2 w-24 text-right">
                  Rate
                </th>
                <th className="border-r border-gray-800 p-2 w-16 text-center">
                  Tax
                </th>
                <th className="p-2 w-32 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {(sale.items || []).map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="border-r border-gray-800 p-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border-r border-gray-800 p-2 font-medium">
                    {item.itemName}
                    {item.description && (
                      <div className="text-xs text-gray-500">
                        {item.description}
                      </div>
                    )}
                  </td>
                  <td className="border-r border-gray-800 p-2 text-center text-gray-600">
                    8528
                  </td>
                  <td className="border-r border-gray-800 p-2 text-center">
                    {item.quantity}
                  </td>
                  <td className="border-r border-gray-800 p-2 text-right">
                    {(item.rate || 0).toFixed(2)}
                  </td>
                  <td className="border-r border-gray-800 p-2 text-center">
                    {item.taxPercent || 0}%
                  </td>
                  <td className="p-2 text-right font-bold">
                    {((item.rate || 0) * (item.quantity || 0)).toFixed(2)}
                  </td>
                </tr>
              ))}
              {/* Fill empty space */}
              {[...Array(Math.max(0, 8 - (sale.items || []).length))].map(
                (_, i) => (
                  <tr key={`empty-${i}`} className="border-b border-gray-200">
                    <td className="border-r border-gray-800 p-2">&nbsp;</td>
                    <td className="border-r border-gray-800 p-2"></td>
                    <td className="border-r border-gray-800 p-2"></td>
                    <td className="border-r border-gray-800 p-2"></td>
                    <td className="border-r border-gray-800 p-2"></td>
                    <td className="border-r border-gray-800 p-2"></td>
                    <td className="p-2"></td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex border-t border-gray-800">
          <div className="w-2/3 border-r border-gray-800 p-4">
            <div className="mb-4">
              <span className="font-bold text-xs uppercase text-gray-600">
                Amount in Words
              </span>
              <p className="font-bold italic text-gray-800 mt-1">
                {numberToWords(Math.round(safeTotal))}
              </p>
            </div>

            <div className="mt-6">
              <h4 className="font-bold text-xs uppercase text-gray-600 mb-2">
                Bank Details
              </h4>
              <div className="text-xs grid grid-cols-2 gap-2">
                <div>
                  Bank:{" "}
                  <span className="font-bold">
                    {settings?.bankDetails?.bankName || "HDFC Bank"}
                  </span>
                </div>
                <div>
                  A/c No:{" "}
                  <span className="font-bold">
                    {settings?.bankDetails?.accountNumber || "50100000000000"}
                  </span>
                </div>
                <div>
                  IFSC:{" "}
                  <span className="font-bold">
                    {settings?.bankDetails?.ifsc || "HDFC0001234"}
                  </span>
                </div>
                <div>
                  Branch:{" "}
                  <span className="font-bold">
                    {settings?.bankDetails?.branch || "New Delhi"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-1/3">
            <div className="flex justify-between p-2 border-b border-gray-200">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold">{(safeTotal / 1.18).toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-2 border-b border-gray-200">
              <span className="text-gray-600">CGST (9%)</span>
              <span>{((safeTotal / 1.18) * 0.09).toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-2 border-b border-gray-200">
              <span className="text-gray-600">SGST (9%)</span>
              <span>{((safeTotal / 1.18) * 0.09).toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-100 border-b border-gray-800">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg">₹{safeTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-2 text-xs text-gray-500">
              <span>Paid: {safePaid.toFixed(2)}</span>
              <span>Due: {safePending.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex border-t border-gray-800 p-4 items-end justify-between">
          <div className="text-xs text-gray-500 w-1/2">
            <p className="font-bold mb-1">Terms & Conditions:</p>
            <ol className="list-decimal list-inside space-y-0.5">
              {(
                settings?.termsAndConditions || [
                  "Goods once sold will not be taken back.",
                  "Interest @ 18% p.a. if not paid by due date.",
                  "Subject to Delhi Jurisdiction.",
                ]
              ).map((term, index) => (
                <li key={index}>{term}</li>
              ))}
            </ol>
          </div>
          <div className="text-center">
            <div className="h-16 mb-2"></div>
            <p className="font-bold text-sm">
              For {settings?.companyName || "MMSC ramser"}
            </p>
            <p className="text-[10px] text-gray-500">(Authorized Signatory)</p>
          </div>
        </div>
      </div>
      <div className="text-center text-[10px] text-gray-400 mt-2">
        This is a computer generated invoice.
      </div>
    </div>
  );
};

export default SalesInvoicePrint;
