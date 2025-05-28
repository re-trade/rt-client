"use client";
// Trang chính của Admin (mặc định)
import { useState } from "react";

export default function AdminPage() {
    const [showLogout, setShowLogout] = useState(false);

    const handleAvatarClick = () => {
        setShowLogout(!showLogout);
    };

    return (
        <div className="p-6 relative">
            {/* Góc trên bên phải */}
            <div className="absolute top-4 right-4 flex items-center space-x-3">
                <div
                    className="w-10 h-10 rounded-full bg-gray-300 cursor-pointer flex items-center justify-center"
                    onClick={handleAvatarClick}
                >
                    <span className="text-sm font-bold text-white">A</span>
                </div>
                <span className="text-gray-800 font-medium">Admin Name</span>
                {showLogout && (
                    <div className="absolute top-12 right-0 bg-white border border-gray-300 rounded shadow-md p-2">
                        <button
                            className="text-red-500 hover:underline"
                            onClick={() => alert("Logged out")}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>

            {/* Nội dung chính */}
            <h1 className="text-3xl font-bold text-[#4A4039]">Welcome to Admin Dashboard</h1>
            <p className="mt-4 text-gray-600">Select an option from the sidebar to get started.</p>
        </div>
    );
}