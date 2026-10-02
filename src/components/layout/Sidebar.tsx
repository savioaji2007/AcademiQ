import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  LayoutDashboard,
  CheckSquare,
  Calendar,
  BarChart3,
  CalendarCheck2,
  SlidersHorizontal,
  Users,
  User,
  ArrowLeftRight,
  Sun,
  Moon,
  Sparkles,
  X,
  Smartphone,
  Timer,
  Play,
  Pause,
  Layers,
} from 'lucide-react';
import { ProfileAvatar } from '../common/ProfileAvatar';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAndroidCode?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onOpenAndroidCode,
}) => {
  const {
    currentUser,
    role,
    switchRole,
    activeScreen,
    setActiveScreen,
    theme,
    setTheme,
    isTimerRunning,
    timerSeconds,
    pauseStudyTimer,
    resumeStudyTimer,
    activeTimerTaskId,
    enrichedTasks,
  } = useApp();

  const activeTask = enrichedTasks.find((t) => t.id === activeTimerTaskId);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const studentNavItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks & Deadlines', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar Schedule', icon: Calendar },
    { id: 'progress', label: 'Progress & Analytics', icon: BarChart3 },
    { id: 'planner', label: 'AI Study Planner', icon: CalendarCheck2 },
    { id: 'simulator', label: 'What-If Simulator', icon: SlidersHorizontal },
    { id: 'profile', label: 'Profile & Settings', icon: User },
  ];

  const teacherNavItems = [
    { id: 'home', label: 'Faculty Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Curricular Tasks', icon: CheckSquare },
    { id: 'students', label: 'Student Directory', icon: Users },
    { id: 'progress', label: 'Class Reports', icon: BarChart3 },
    { id: 'profile', label: 'Profile & Settings', icon: User },
  ];

  const navItems = role === 'teacher' ? teacherNavItems : studentNavItems;

  const handleNavClick = (id: string) => {
    setActiveScreen(id);
    onClose();
  };

  const handleRoleToggle = () => {
    switchRole(role === 'student' ? 'teacher' : 'student');
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-600 text-white flex items-center justify-center shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                ACADEMIQ
              </div>
              <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-none mt-0.5">
                Academic Deadline System
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 md:hidden"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Switcher Banner */}
        <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Session
            </span>
            <button
              type="button"
              onClick={handleRoleToggle}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              title="Switch role"
            >
              <ArrowLeftRight className="w-3 h-3" />
              <span>Switch to {role === 'student' ? 'Faculty' : 'Student'}</span>
            </button>
          </div>

          <div
            onClick={() => handleNavClick('profile')}
            className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs cursor-pointer hover:border-blue-400 transition-colors"
          >
            <ProfileAvatar
              photoUrl={currentUser.photoUrl}
              name={currentUser.fullName}
              initials={currentUser.initials}
              role={currentUser.role}
              size="sm"
              shape="rounded"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {currentUser.fullName}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {role === 'student' ? currentUser.classDept : currentUser.teacherTitle || 'Faculty'}
              </div>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 uppercase">
              {role}
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Live Study Timer widget (if running) */}
        {activeTimerTaskId && (
          <div className="m-3 p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 shrink-0 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-300">
              <span className="flex items-center gap-1.5">
                <Timer className="w-4 h-4 animate-pulse" />
                <span>Focus Session</span>
              </span>
              <span className="font-mono text-sm">{formatTimer(timerSeconds)}</span>
            </div>

            {activeTask && (
              <p className="text-[11px] text-blue-600/90 dark:text-blue-300/80 truncate">
                {activeTask.title}
              </p>
            )}

            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={isTimerRunning ? pauseStudyTimer : resumeStudyTimer}
                className="flex-1 py-1.5 px-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center justify-center gap-1"
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-3 h-3" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    <span>Resume</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('tasks')}
                className="py-1.5 px-2 rounded-lg bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 text-[11px] font-semibold border border-blue-200 dark:border-blue-800"
              >
                View
              </button>
            </div>
          </div>
        )}

        {/* Sidebar Footer: Theme and source view */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-2">
          {/* Theme selector */}
          <div className="flex items-center justify-between p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                theme === 'light'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                theme === 'dark'
                  ? 'bg-white dark:bg-slate-700 text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dark</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                theme === 'system'
                  ? 'bg-white dark:bg-slate-700 text-blue-500 shadow-xs'
                  : 'text-slate-500 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Auto</span>
            </button>
          </div>

          {onOpenAndroidCode && (
            <button
              type="button"
              onClick={onOpenAndroidCode}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
              <span>Mobile Code Package</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
