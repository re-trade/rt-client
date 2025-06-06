import { useEffect, useRef, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
interface Props {
  open: boolean;
  onClose?: () => void;
}

export function ChangePasswordDialog({ open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') setShowPassword(!showPassword);
    else setShowConfirmPassword(!showConfirmPassword);
  };
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [open]);

  // Đóng dialog khi click nút Đóng
  const handleClose = () => {
    onClose?.();
  };

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box bg-white text-black">
        <h3 className="font-bold text-lg">Thay đổi mật khẩu</h3>
        <p className="py-4">Nhập mật khẩu hiện tại và mật khẩu mới của bạn để thay đổi mật khẩu.</p>
        <form method="dialog" className="space-y-4 justify-items-center w-full">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              placeholder="Mật khẩu"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('password')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible className="w-5 h-5 text-gray-500" />
              ) : (
                <AiOutlineEye className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              placeholder="Mật khẩu mới"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('password')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible className="w-5 h-5 text-gray-500" />
              ) : (
                <AiOutlineEye className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
          <div className="modal-action">
            <button className="btn" type="submit">
              Lưu
            </button>
            <button className="btn" type="button" onClick={handleClose}>
              Đóng
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
