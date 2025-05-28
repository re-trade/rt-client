'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons';

interface MenuItem {
  name: string;
  href: string;
  icon: IconType;
}

interface LeftNavbarProps {
  title: string;
  menuItems: MenuItem[];
}

const LeftNavbar: React.FC<LeftNavbarProps> = ({ title, menuItems }) => {
  const pathname = usePathname();

  return (
    <aside className="w-72 min-h-screen bg-white text-gray-900 shadow-md p-6 flex flex-col border-r border-gray-200">
      <h2 className="text-xl font-bold mb-6 text-blue-600">{title}</h2>
      <nav className="flex-1">
        <ul className="space-y-3">
          {menuItems.map(({ name, href, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'flex items-center gap-4 p-3 rounded-lg transition duration-300 font-medium',
                  pathname === href
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100',
                )}
              >
                <Icon className="w-5 h-5 text-blue-500" />
                <span>{name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default LeftNavbar;
