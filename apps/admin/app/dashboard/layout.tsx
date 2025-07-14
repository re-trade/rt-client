import AuthWrapper from '@/components/auth/AuthWrapper';
import DashboardLayoutComponent from '@/components/layout/DashboardLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthWrapper>
      <DashboardLayoutComponent>
        {children}
      </DashboardLayoutComponent>
    </AuthWrapper>
  );
}
