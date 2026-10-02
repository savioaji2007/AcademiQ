import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryBadge } from '../common/CategoryBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
} from 'lucide-react';

export const CalendarScreen: React.FC = () => {
  const { enrichedTasks, setSelectedTaskId } = useApp();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDayTasksDate, setSelectedDayTasksDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Map tasks by date
  const tasksByDate = useMemo(() => {
    const map: Record<string, typeof enrichedTasks> = {};
    enrichedTasks.forEach((t) => {
      if (categoryFilter !== 'All' && t.category !== categoryFilter) return;
      if (!map[t.deadlineDate]) {
        map[t.deadlineDate] = [];
      }
      map[t.deadlineDate].push(t);
    });
    return map;
  }, [enrichedTasks, categoryFilter]);

  // Generate calendar grid days
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    // Prev month padding
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const mm = String(currentMonth === 0 ? 12 : currentMonth).padStart(2, '0');
      const yr = currentMonth === 0 ? currentYear - 1 : currentYear;
      days.push({
        dateStr: `${yr}-${mm}-${String(d).padStart(2, '0')}`,
        dayNum: d,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const mm = String(currentMonth + 1).padStart(2, '0');
      days.push({
        dateStr: `${currentYear}-${mm}-${String(i).padStart(2, '0')}`,
        dayNum: i,
        isCurrentMonth: true,
      });
    }

    // Next month padding
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const mm = String(currentMonth + 2 > 12 ? 1 : currentMonth + 2).padStart(2, '0');
      const yr = currentMonth + 2 > 12 ? currentYear + 1 : currentYear;
      days.push({
        dateStr: `${yr}-${mm}-${String(i).padStart(2, '0')}`,
        dayNum: i,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  const selectedDayTasks = tasksByDate[selectedDayTasksDate] || [];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDayTasksDate(today.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6 pb-12 w-full max-w-7xl mx-auto">
      {/* Month Navigation Header */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Today
          </button>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Assignment">Assignments</option>
            <option value="Module Test">Module Tests</option>
            <option value="Lab Exam">Lab Exams</option>
            <option value="Lab Record Submission">Lab Records</option>
            <option value="Project">Projects</option>
          </select>
        </div>
      </div>

      {/* Web Responsive Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Month Grid (2 cols on desktop) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          {/* Days of week */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700 text-center py-2 bg-slate-50 dark:bg-slate-900/50">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d, i) => (
              <span key={i} className="text-xs font-bold text-slate-400">
                <span className="hidden sm:inline">{d}</span>
                <span className="sm:hidden">{d.slice(0, 1)}</span>
              </span>
            ))}
          </div>

        {/* Grid Cells */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-700/60">
          {calendarDays.map((cell) => {
            const dayTasks = tasksByDate[cell.dateStr] || [];
            const isSelected = selectedDayTasksDate === cell.dateStr;
            const isToday = cell.dateStr === new Date().toISOString().split('T')[0];

            return (
              <div
                key={cell.dateStr}
                onClick={() => setSelectedDayTasksDate(cell.dateStr)}
                className={`min-h-[52px] p-1 transition-colors cursor-pointer flex flex-col items-center justify-between ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/60 ring-2 ring-blue-500 z-10'
                    : cell.isCurrentMonth
                    ? 'bg-white dark:bg-slate-800 hover:bg-slate-50'
                    : 'bg-slate-50/50 dark:bg-slate-900/40 opacity-30'
                }`}
              >
                <span
                  className={`text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                    isToday
                      ? 'bg-blue-600 text-white font-extrabold'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {cell.dayNum}
                </span>

                {/* Dots indicator for tasks */}
                <div className="flex items-center gap-0.5 h-2">
                  {dayTasks.slice(0, 3).map((t, idx) => (
                    <span
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full ${
                        t.calculatedPriority.level === 'CRITICAL'
                          ? 'bg-rose-500'
                          : t.calculatedPriority.level === 'HIGH'
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                      }`}
                    />
                  ))}
                  {dayTasks.length > 3 && (
                    <span className="text-[8px] font-bold text-slate-400">+</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Agenda Mobile List */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Agenda: {selectedDayTasksDate}
          </h3>
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
            {selectedDayTasks.length} Scheduled
          </span>
        </div>

        {selectedDayTasks.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No academic assignments or tests on this date.
          </div>
        ) : (
          <div className="space-y-2">
            {selectedDayTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTaskId(task.id)}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-colors cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between gap-1">
                  <CategoryBadge category={task.category} size="sm" />
                  <PriorityBadge level={task.calculatedPriority.level} size="sm" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {task.title}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span className="flex items-center gap-1 font-mono font-bold text-slate-700 dark:text-slate-300">
                    <Clock className="w-3 h-3 text-blue-500" />
                    Due: {task.deadlineTime}
                  </span>
                  <span>{task.studentProgress.progressPercentage}% done</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};
