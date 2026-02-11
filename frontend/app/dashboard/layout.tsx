import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-muted/40">
            <Sidebar />
            <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300">
                <Header />
                <main className="flex-1 p-4 md:p-6 space-y-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
