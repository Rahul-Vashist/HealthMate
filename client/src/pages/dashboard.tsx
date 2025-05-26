import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import QuickStats from "@/components/dashboard/quick-stats";
import WeightChart from "@/components/dashboard/weight-chart";
import QuickActions from "@/components/dashboard/quick-actions";
import GoalsProgress from "@/components/dashboard/goals-progress";
import RecentActivities from "@/components/dashboard/recent-activities";
import DataEntryModal from "@/components/modals/data-entry-modal";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'weight' | 'activity' | 'vitals' | 'water'>('weight');

  const openModal = (type: 'weight' | 'activity' | 'vitals' | 'water') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-background">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className="flex-1 overflow-hidden">
        <Header onToggleSidebar={() => setIsSidebarOpen(true)} />
        
        <div className="p-4 lg:p-8 space-y-8 overflow-y-auto h-[calc(100vh-80px)]">
          <QuickStats />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <WeightChart />
            </div>
            <QuickActions onOpenModal={openModal} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GoalsProgress />
            <RecentActivities />
          </div>
        </div>
      </main>

      <DataEntryModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        type={modalType}
      />
    </div>
  );
}
