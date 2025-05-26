// Dữ liệu mẫu cho Users
const users = [
    { name: "John Doe", email: "john.doe@example.com", date: "2025-01-15", phone: "+1234567890" },
    { name: "Jane Smith", email: "jane.smith@example.com", date: "2025-02-20", phone: "+0987654321" },
    { name: "Alex Brown", email: "alex.brown@example.com", date: "2025-03-10", phone: "+1122334455" },
    { name: "Maria Garcia", email: "maria.garcia@example.com", date: "2025-04-05", phone: "+5566778899" },
];

// Component hiển thị bảng Users
export default function UserTable() {
    return (
        <div className="w-full">
            {/* Tiêu đề bảng */}
            <h2 className="text-2xl font-bold mb-6 text-[#4A4039]">Users</h2>
            {/* Bảng responsive */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-md">
                    {/* Tiêu đề cột */}
                    <thead>
                    <tr className="bg-[#F5E8C7] text-[#4A4039]">
                        <th className="p-4 text-left">Name</th>
                        <th className="p-4 text-left">Email</th>
                        <th className="p-4 text-left">Date</th>
                        <th className="p-4 text-left">Phone</th>
                    </tr>
                    </thead>
                    {/* Dữ liệu mẫu */}
                    <tbody>
                    {users.map((user, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-4">{user.name}</td>
                            <td className="p-4">{user.email}</td>
                            <td className="p-4">{user.date}</td>
                            <td className="p-4">{user.phone}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}