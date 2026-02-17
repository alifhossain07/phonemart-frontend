import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] py-10">
      {/* 1. Changed 'flex' to 'flex-col' (vertical) by default.
          2. Added 'lg:flex-row' to switch back to side-by-side on larger screens.
      */}
      <div className="w-11/12 mx-auto px-4 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Container */}
        <aside className="w-full lg:w-[320px] shrink-0">
          <Sidebar />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}