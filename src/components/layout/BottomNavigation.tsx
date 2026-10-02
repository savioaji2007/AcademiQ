import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  CheckSquare,
  Calendar,
  BarChart3,
  User,
  Users,
  LayoutDashboard,
  FileCheck2,
} from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { role, activeScreen, setActiveScreen } = useApp();

  const studentNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const teacherNavItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: FileCheck2 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'progress', label: 'Reports', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const navItems = role === 'teacher' ? teacherNavItems : studentNavItems;

  return (
    <nav className="w-full shrink-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 transition-colors select-none">
      <div className="w-full px-2">
        <div className="flex items-center justify-around h-14 py-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveScreen(item.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full py-0.5 transition-all duration-150 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <div
                  className={`px-3 py-0.5 rounded-full transition-all ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 scale-105'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium tracking-tight mt-0.5 leading-none">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
