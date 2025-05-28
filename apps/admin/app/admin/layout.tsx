// Layout cho trang Admin, bao gồm Navbar bên trái và nội dung bên phải
import AdminNavbar from "@/app/components/AdminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Navbar bên trái */}
            <AdminNavbar />
            {/* Nội dung chính bên phải */}
            <main className="flex-1 p-6 overflow-auto">
                {children}
            </main>
        </div>
    );
}