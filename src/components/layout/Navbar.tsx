import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Sun,
  Moon,
  Sparkles,
  Menu,
  GraduationCap,
  ArrowLeftRight,
  Timer,
  Play,
  Pause,
  Smartphone,
} from 'lucide-react';
import { NotificationsModal } from '../common/NotificationsModal';
import { AndroidProjectViewerModal } from '../androidCode/AndroidProjectViewerModal';
import { ProfileAvatar } from '../common/ProfileAvatar';

interface NavbarProps {
  onOpenMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const {
    currentUser,
    role,
    switchRole,
    theme,
    setTheme,
    unreadNotifCount,
    activeScreen,
    setActiveScreen,
    isTimerRunning,
    timerSeconds,
    pauseStudyTimer,
    resumeStudyTimer,
    activeTimerTaskId,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAndroidCodeOpen, setIsAndroidCodeOpen] = useState(false);

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const getScreenDetails = () => {
    switch (activeScreen) {
      case 'tasks':
        return {
          title: role === 'teacher' ? 'Course Tasks' : 'Tasks & Deadlines',
          subtitle: 'Prioritize submissions and academic records',
        };
      case 'calendar':
        return {
          title: 'Academic Calendar',
          subtitle: 'Monthly and weekly timetable overview',
        };
      case 'progress':
        return {
          title: role === 'teacher' ? 'Class Performance' : 'Academic Analytics',
          subtitle: 'Workload distribution and subject mastery',
        };
      case 'students':
        return {
          title: 'Student Directory',
          subtitle: 'Class CS-3A roster and submission records',
        };
      case 'planner':
        return {
          title: 'AI Study Planner',
          subtitle: 'Optimized daily schedule based on priority scores',
        };
      case 'simulator':
        return {
          title: 'What-If Simulator',
          subtitle: 'Dynamic priority cascade & workload projection',
        };
      case 'profile':
        return {
          title: 'Profile & Settings',
          subtitle: 'Manage institutional credentials and preferences',
        };
      default:
        return {
          title: role === 'teacher' ? 'Faculty Command Center' : 'Student Workspace',
          subtitle: `Welcome back, ${currentUser.fullName}`,
        };
    }
  };

  const screenInfo = getScreenDetails();

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Left: Mobile Menu Trigger + Breadcrumb Title */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={onOpenMobileMenu}
                className="p-2 -ml-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Brand on mobile only */}
              <div
                onClick={() => setActiveScreen('home')}
                className="flex items-center gap-2 md:hidden cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  ACADEMIQ
                </span>
              </div>

              {/* Desktop Title & Subtitle */}
              <div className="hidden md:block min-w-0">
                <h1 className="text-base font-bold text-slate-900 dark:text-white truncate leading-tight">
                  {screenInfo.title}
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {screenInfo.subtitle}
                </p>
              </div>
            </div>

            {/* Right: Actions, Live Timer, Role Switcher, Notifs, Profile */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Live Study Timer Pill (visible on desktop and tablet if running) */}
              {activeTimerTaskId && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300">
                  <Timer className="w-3.5 h-3.5 animate-pulse text-blue-600 dark:text-blue-400" />
                  <span className="font-mono text-xs font-bold">{formatTimer(timerSeconds)}</span>
                  <button
                    type="button"
                    onClick={isTimerRunning ? pauseStudyTimer : resumeStudyTimer}
                    className="p-0.5 hover:text-blue-900 dark:hover:text-blue-100"
                    title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
                  >
                    {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </button>
                </div>
              )}

              {/* Quick Role Switcher Button */}
              <button
                type="button"
                onClick={() => switchRole(role === 'student' ? 'teacher' : 'student')}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                title="Switch between student and faculty experience"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Switch to {role === 'student' ? 'Faculty' : 'Student'}</span>
              </button>

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={`Theme: ${theme}`}
              >
                {theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-indigo-400" />
                ) : theme === 'light' ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Sparkles className="w-4 h-4 text-blue-500" />
                )}
              </button>

              {/* Notifications Bell */}
              <button
                type="button"
                onClick={() => setIsNotifOpen(true)}
                aria-label="View notifications"
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {/* Mobile Code Modal trigger */}
              <button
                type="button"
                onClick={() => setIsAndroidCodeOpen(true)}
                aria-label="View Mobile Project Code"
                title="Android Source Project"
                className="hidden sm:flex p-2 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
              >
                <Smartphone className="w-4 h-4" />
              </button>

              {/* User Avatar & Name */}
              <div
                onClick={() => setActiveScreen('profile')}
                className="flex items-center gap-2 pl-1 cursor-pointer select-none"
              >
                <ProfileAvatar
                  photoUrl={currentUser.photoUrl}
                  name={currentUser.fullName}
                  initials={currentUser.initials}
                  role={currentUser.role}
                  size="sm"
                  shape="circle"
                />
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {currentUser.fullName}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                    {currentUser.role}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Dialog */}
      {isNotifOpen && <NotificationsModal onClose={() => setIsNotifOpen(false)} />}

      {/* Android Native Studio Code Viewer */}
      {isAndroidCodeOpen && (
        <AndroidProjectViewerModal onClose={() => setIsAndroidCodeOpen(false)} />
      )}
    </>
  );
};
