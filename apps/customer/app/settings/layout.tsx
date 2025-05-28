'use client';
import LeftNavbar from '@components/navbar/LeftNavBar';
import { FaBell, FaCog, FaCreditCard, FaLock, FaUser } from 'react-icons/fa';

const generalPath: string = '/settings';
const settingsMenu = [
  { name: 'General', href: `${generalPath}`, icon: FaCog },
  { name: 'Profile', href: `${generalPath}/profile`, icon: FaUser },
  { name: 'Security', href: `${generalPath}/security`, icon: FaLock },
  { name: 'Notifications', href: `${generalPath}/notification`, icon: FaBell },
  { name: 'Billing', href: `${generalPath}/billing`, icon: FaCreditCard },
];

const SettingsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <LeftNavbar title="Settings" menuItems={settingsMenu} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default SettingsLayout;
