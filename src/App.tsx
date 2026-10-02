import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { StudentDashboard } from './components/student/StudentDashboard';
import { TaskListScreen } from './components/student/TaskListScreen';
import { CalendarScreen } from './components/student/CalendarScreen';
import { AnalyticsScreen } from './components/student/AnalyticsScreen';
import { StudyPlannerScreen } from './components/student/StudyPlannerScreen';
import { WhatIfSimulatorScreen } from './components/student/WhatIfSimulatorScreen';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { TeacherStudentsScreen } from './components/teacher/TeacherStudentsScreen';
import { ProfileScreen } from './components/common/ProfileScreen';
import { TaskDetailModal } from './components/student/TaskDetailModal';
import { ToastContainer } from './components/common/ToastContainer';
import { AndroidProjectViewerModal } from './components/androidCode/AndroidProjectViewerModal';

const MainAppContent: React.FC = () => {
  const {
    role,
    activeScreen,
    selectedTaskId,
    setSelectedTaskId,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAndroidCodeOpen, setIsAndroidCodeOpen] = useState(false);

  const renderScreen = () => {
    if (role === 'teacher') {
      switch (activeScreen) {
        case 'home':
        case 'tasks':
          return <TeacherDashboard />;
        case 'students':
          return <TeacherStudentsScreen />;
        case 'progress':
          return <AnalyticsScreen />;
        case 'profile':
          return <ProfileScreen />;
        default:
          return <TeacherDashboard />;
      }
    } else {
      // Student screens
      switch (activeScreen) {
        case 'home':
          return <StudentDashboard />;
        case 'tasks':
          return <TaskListScreen />;
        case 'calendar':
          return <CalendarScreen />;
        case 'progress':
          return <AnalyticsScreen />;
        case 'planner':
          return <StudyPlannerScreen />;
        case 'simulator':
          return <WhatIfSimulatorScreen />;
        case 'profile':
          return <ProfileScreen />;
        default:
          return <StudentDashboard />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col md:flex-row transition-colors">
      {/* Desktop & Mobile Responsive Web Sidebar */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenAndroidCode={() => setIsAndroidCodeOpen(true)}
      />

      {/* Main Web App Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <Navbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Dynamic Responsive Screen Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
          {renderScreen()}
        </main>

        {/* Compact Bottom Navigation on small mobile viewports only */}
        <div className="md:hidden">
          <BottomNavigation />
        </div>
      </div>

      {/* Global Task Details Modal */}
      {selectedTaskId && (
        <TaskDetailModal
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}

      {/* Android Mobile Code Source Viewer */}
      {isAndroidCodeOpen && (
        <AndroidProjectViewerModal onClose={() => setIsAndroidCodeOpen(false)} />
      )}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
