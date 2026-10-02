import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PriorityBadge } from '../common/PriorityBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import {
  Search,
  Filter,
  Clock,
  Calendar,
  CheckCircle2,
  Play,
  ArrowUpDown,
  BookOpen,
} from 'lucide-react';

export const TaskListScreen: React.FC = () => {
  const {
    enrichedTasks,
    setSelectedTaskId,
    startStudyTimer,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'pending' | 'completed' | 'urgent'>('All');
  const [sortBy, setSortBy] = useState<'priority' | 'deadline' | 'progress'>('priority');

  const categories = [
    'All',
    'Assignment',
    'Module Test',
    'Lab Exam',
    'Lab Record Submission',
    'Notebook Submission',
    'Project',
  ];

  // Filtering and Sorting
  const filteredTasks = useMemo(() => {
    return enrichedTasks
      .filter((task) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchSubject = task.subject.toLowerCase().includes(q);
          if (!matchTitle && !matchSubject) return false;
        }

        if (selectedCategory !== 'All' && task.category !== selectedCategory) {
          return false;
        }

        if (selectedStatus === 'pending' && task.studentProgress.status === 'completed') {
          return false;
        }
        if (selectedStatus === 'completed' && task.studentProgress.status !== 'completed') {
          return false;
        }
        if (
          selectedStatus === 'urgent' &&
          task.calculatedPriority.level !== 'CRITICAL' &&
          task.calculatedPriority.level !== 'HIGH'
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          return b.calculatedPriority.score - a.calculatedPriority.score;
        }
        if (sortBy === 'deadline') {
          const dateA = new Date(`${a.deadlineDate}T${a.deadlineTime}`).getTime();
          const dateB = new Date(`${b.deadlineDate}T${b.deadlineTime}`).getTime();
          return dateA - dateB;
        }
        if (sortBy === 'progress') {
          return b.studentProgress.progressPercentage - a.studentProgress.progressPercentage;
        }
        return 0;
      });
  }, [enrichedTasks, searchQuery, selectedCategory, selectedStatus, sortBy]);

  return (
    <div className="space-y-5 pb-12 w-full max-w-7xl mx-auto">
      {/* 1. Web Search & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-800/90 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks, subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Strip: Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Pills & Sort */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-700/50 text-xs">
          <div className="flex items-center gap-1">
            {(['All', 'pending', 'urgent', 'completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium capitalize transition-colors ${
                  selectedStatus === st
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="priority">Priority</option>
            <option value="deadline">Due Date</option>
            <option value="progress">Progress %</option>
          </select>
        </div>
      </div>

      {/* 2. Mobile Task Cards (Section 9) */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-700">
          <CheckCircle2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No matching tasks found
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search or category filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => {
            const isCompleted = task.studentProgress.status === 'completed';
            const { level, score, isOverdue } = task.calculatedPriority;

            return (
              <div
                key={task.id}
                className={`bg-white dark:bg-slate-800/90 rounded-2xl p-4 border shadow-sm transition-all space-y-3 ${
                  isCompleted
                    ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/15'
                    : isOverdue
                    ? 'border-rose-300 dark:border-rose-900/60'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                {/* Header: Category Badge + Priority Pill */}
                <div className="flex items-center justify-between gap-2">
                  <CategoryBadge category={task.category} size="sm" />
                  <PriorityBadge level={level} score={score} showScore size="sm" />
                </div>

                {/* Title & Subject */}
                <div>
                  <h3
                    onClick={() => setSelectedTaskId(task.id)}
                    className={`text-sm sm:text-base font-bold cursor-pointer transition-colors leading-snug ${
                      isCompleted
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-white hover:text-blue-600'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                    {task.subject}
                  </p>
                </div>

                {/* Deadline indicator */}
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    Due: {task.deadlineDate} • {task.deadlineTime}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Est: {task.studentProgress.estimatedRemainingHours || 2}h
                  </span>
                </div>

                {/* Progress Bar (Section 9) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {task.studentProgress.progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald-500'
                          : task.studentProgress.progressPercentage > 50
                          ? 'bg-blue-600'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${task.studentProgress.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Mobile Action Buttons (Section 9: [ VIEW TASK ] + [ Timer ]) */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => setSelectedTaskId(task.id)}
                    className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors text-center shadow-xs"
                  >
                    VIEW TASK
                  </button>

                  {!isCompleted ? (
                    <button
                      type="button"
                      onClick={() => startStudyTimer(task.id)}
                      className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Play className="w-3 h-3 text-emerald-500" />
                      <span>Timer</span>
                    </button>
                  ) : (
                    <div className="py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Completed</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
