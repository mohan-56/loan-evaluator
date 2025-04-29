"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [formData, setFormData] = useState({
    income: "",
    creditScore: "",
    loanAmount: "",
  });
  const [result, setResult] = useState<{ status: string; reason?: string } | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.income || !formData.creditScore || !formData.loanAmount) return;
    setIsLoading(true);

    try {
      // Call Eligibility Service
      const eligibilityResponse = await axios.post(
        process.env.NEXT_PUBLIC_ELIGIBILITY_SERVICE_URL!,
        {
          income: parseFloat(formData.income),
          creditScore: parseInt(formData.creditScore),
          loanAmount: parseFloat(formData.loanAmount),
        }
      );
      const { status, reason } = eligibilityResponse.data;
      setResult({ status, reason });

      // Save to History Service
      await axios.post(process.env.NEXT_PUBLIC_HISTORY_SERVICE_URL!, {
        income: formData.income,
        creditScore: formData.creditScore,
        loanAmount: formData.loanAmount,
        status,
        reason,
      });
    } catch (error) {
      console.error("Error:", error);
      setResult({ status: "Error", reason: "Failed to evaluate application" });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_HISTORY_SERVICE_URL!);
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-400">
      <h1 className="text-3xl font-bold mb-4">Loan Eligibility Evaluator</h1>
      <div className="w-full max-w-md bg-blue-200 p-6 rounded-3xl shadow">
        <div className="mb-4">
          <label className="block mb-1 text-black">Annual Income ($)</label>
          <input
            type="number"
            value={formData.income}
            onChange={(e) => setFormData({ ...formData, income: e.target.value })}
            className="w-full p-2 border rounded bg-white  text-neutral-800"
            placeholder="e.g., 60000"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-black">Credit Score</label>
          <input
            type="number"
            value={formData.creditScore}
            onChange={(e) => setFormData({ ...formData, creditScore: e.target.value })}
            className="w-full p-2 border rounded bg-white  text-neutral-800"
            placeholder="e.g., 720"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-black">Loan Amount ($)</label>
          <input
            type="number"
            value={formData.loanAmount}
            onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
            className="w-full p-2 border rounded bg-white text-neutral-800"
            placeholder="e.g., 10000"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          {isLoading ? "Checking..." : "Check Eligibility"}
        </button>
        {result && (
          <div className="mt-4 p-4 border rounded text-black">
            <p className="font-bold text-black">Result: {result.status}</p>
            {result.reason && <p>Reason: {result.reason}</p>}
          </div>
        )}
        <button
          onClick={fetchHistory}
          className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded"
        >
          View Application History
        </button>
        {history.length > 0 && (
          <div className="mt-4 text-black">
            <h2 className="text-xl font-bold">History</h2>
            {history.map((entry, index) => (
              <div key={index} className="p-2 border-b">
                <p>Income: ${entry.income}</p>
                <p>Credit Score: {entry.creditScore}</p>
                <p>Loan Amount: ${entry.loanAmount}</p>
                <p>Status: {entry.status}</p>
                {entry.reason && <p>Reason: {entry.reason}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}