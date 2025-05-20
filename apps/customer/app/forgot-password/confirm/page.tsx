"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, AlertCircle } from "lucide-react";

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"success" | "error" | "">("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing token.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Reset failed");
      }

      setStatus("success");
      setMessage("Your password has been successfully reset.");
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm border rounded-lg shadow-sm px-6 py-8">
        <h1 className="text-xl font-semibold text-orange-500 text-center mb-4">
          ReTrade
        </h1>

        <h2 className="text-gray-800 font-semibold mb-1 text-center">
          Set a new password
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your new password below.
        </p>

        {message && (
          <div
            className={`p-3 mb-4 text-sm rounded flex items-start gap-2 ${
              status === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {status === "success" ? (
              <CheckCircle className="w-5 h-5 mt-0.5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 mt-0.5 text-red-600" />
            )}
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-900 transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
