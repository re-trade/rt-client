"use client";
import { useRef, useState, useEffect } from "react";
import { ChangePasswordDialog } from "@/components/common/ChangePasswordDialog";

export default function SecurityPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  useEffect(() => {
    if (isModalOpen) {
      dialogRef.current?.showModal();
    }
  }, [isModalOpen]);

  return (
    <div className="w-full h-full bg-white p-10">
      <div className="w-full h-full bg-[#FFF8F3] rounded-lg shadow-lg p-6">
        <div className="rounded-lg p-4 mb-6">
          <div>
            <h1 className="text-black text-2xl">Mật khẩu và bảo mật</h1>
            <h1 className="text-black">
              Quản lý mật khẩu, tùy chọn đăng nhập và phương thức khôi phục.
            </h1>
          </div>
          <div>
            <button className="btn w-100 bg-[#FFD2B2] text-black" onClick={handleOpenModal}>
              change password
            </button>
            <ChangePasswordDialog
              open={isModalOpen}
              onClose={handleCloseModal}
            />
          </div>
        </div>
        <div>
          <div className="mb-4">
            <h2 className="text-black text-lg font-semibold">Đăng nhập bằng email</h2>
            <p className="text-gray-600">
              Bạn có thể đăng nhập bằng email đã đăng ký.
            </p>
          </div>
          <div className="mb-4">
            <h2 className="text-black text-lg font-semibold">Đăng nhập bằng số điện thoại</h2>
            <p className="text-gray-600">
              Bạn có thể đăng nhập bằng số điện thoại đã đăng ký.
            </p>
          </div>
          <div className="mb-4">
            <h2 className="text-black text-lg font-semibold">Khôi phục tài khoản</h2>
            <p className="text-gray-600">
              Nếu bạn quên mật khẩu, hãy sử dụng chức năng khôi phục tài khoản.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
