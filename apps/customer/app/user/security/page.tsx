'use client';

import TwoFactor from '@/components/auth/2FA';
import { ChangePasswordDialog } from '@/components/common/ChangePasswordDialog';
import { useEffect, useRef, useState } from 'react';

export default function SecurityPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const dialog2FARef = useRef<HTMLDialogElement | null>(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOpen2FAModal = () => setIs2FAModalOpen(true);
  const handleClose2FAModal = () => setIs2FAModalOpen(false);

  useEffect(() => {
    if (isModalOpen) {
      dialogRef.current?.showModal();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (is2FAModalOpen) {
      dialog2FARef.current?.showModal();
    }
  }, [is2FAModalOpen]);

  const handleChoseAction = (action: string) => {
    switch (action) {
      case 'Thay đổi':
        handleOpenModal();
        break;
      case 'Cập nhật':
        alert('Cập nhật email hoặc số điện thoại');
        break;
      case 'Đăng ký':
        handleOpen2FAModal();
        break;
      case 'Liên kết':
        alert('Liên kết tài khoản');
        break;
      default:
        break;
    }
  };

  const actions = [
    {
      title: 'Đổi mật khẩu',
      description: 'Thay đổi mật khẩu tài khoản của bạn để bảo mật hơn.',
      action: 'Thay đổi',
    },
    {
      title: 'Đổi email',
      description: 'Cập nhật địa chỉ email chính của bạn.',
      action: 'Cập nhật',
    },
    {
      title: 'Đổi số điện thoại',
      description: 'Cập nhật số điện thoại dùng để xác thực và liên hệ.',
      action: 'Cập nhật',
    },
    {
      title: 'Đăng ký 2FA',
      description: 'Bật xác thực hai yếu tố để bảo vệ tài khoản của bạn.',
      action: 'Đăng ký',
    },
    {
      title: 'Liên kết Facebook',
      description: 'Liên kết tài khoản Facebook để đăng nhập nhanh hơn.',
      action: 'Liên kết',
    },
    {
      title: 'Liên kết Google',
      description: 'Liên kết tài khoản Google để đăng nhập nhanh hơn.',
      action: 'Liên kết',
    },
  ];

  return (
    <div className="w-full h-full bg-white">
      <div className="w-full bg-white rounded-lg shadow-lg">
        <div className="max-w-3xl mx-auto p-6 bg-[#fff2e6] shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Bảo mật tài khoản</h1>

          <div className="space-y-4">
            {actions.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-100 p-4 rounded-md border"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <button
                  className="px-4 py-2 bg-[#ffd2b2] text-black rounded-md text-sm"
                  onClick={() => handleChoseAction(item.action)}
                >
                  {item.action}
                </button>
              </div>
            ))}
          </div>

          <ChangePasswordDialog open={isModalOpen} onClose={handleCloseModal} />

          {/* 2FA Modal */}
          <dialog ref={dialog2FARef} className="rounded-lg w-[90%] max-w-md">
  <div className="p-4">
    <h2 className="text-xl font-semibold mb-2">Kích hoạt Xác thực Hai Yếu Tố</h2>
    {is2FAModalOpen && <TwoFactor />}
    <div className="text-right mt-4">
      <button
        onClick={() => {
          dialog2FARef.current?.close();
          setIs2FAModalOpen(false);
        }}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
      >
        Đóng
      </button>
    </div>
  </div>
</dialog>

        </div>
      </div>
    </div>
  );
}
