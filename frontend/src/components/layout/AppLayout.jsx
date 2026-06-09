import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { TopNavbar } from './TopNavbar';

/**
 * Root application layout: sidebar + top navbar + page outlet.
 */
export function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-screen flex flex-col">
        <TopNavbar />
        <main className="flex-1 p-6 bg-muted/20">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
