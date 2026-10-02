import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  Layers,
  PieChart,
} from 'lucide-react';

export const AnalyticsScreen: React.FC = () => {
  const { enrichedTasks } = useApp();

  const totalTasks = enrichedTasks.length;
  const completedTasks = enrichedTasks.filter(
    (t) => t.studentProgress.status === 'completed'
  );
  const pendingTasks = enrichedTasks.filter(
    (t) => t.studentProgress.status !== 'completed'
  );
  const overdueTasks = enrichedTasks.filter(
    (t) => t.calculatedPriority.isOverdue && t.studentProgress.status !== 'completed'
  );

  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  const totalStudyHoursLogged = useMemo(() => {
    const totalMinutes = enrichedTasks.reduce(
      (sum, t) => sum + (t.studentProgress.workTimeSpentMinutes || 0),
      0
    );
    return Math.round((totalMinutes / 60) * 10) / 10;
  }, [enrichedTasks]);

  const subjectBreakdown = useMemo(() => {
    const map: Record<string, { total: number; completed: number }> = {};
    enrichedTasks.forEach((t) => {
      if (!map[t.subject]) {
        map[t.subject] = { total: 0, completed: 0 };
      }
      map[t.subject].total += 1;
      if (t.studentProgress.status === 'completed') {
        map[t.subject].completed += 1;
      }
    });

    return Object.entries(map).map(([subject, data]) => ({
      subject,
      total: data.total,
      completed: data.completed,
      percentage: Math.round((data.completed / data.total) * 100),
    }));
  }, [enrichedTasks]);

  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    enrichedTasks.forEach((t) => {
      map[t.category] = (map[t.category] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [enrichedTasks]);

  const priorityDistribution = useMemo(() => {
    const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    pendingTasks.forEach((t) => {
      counts[t.calculatedPriority.level] += 1;
    });
    return counts;
  }, [pendingTasks]);

  return (
    <div className="space-y-6 pb-12 w-full max-w-7xl mx-auto">
      {/* 4 KPI Metrics Grid (Section 12 & 13) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase block">
            Completion Rate
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white block mt-1">
            {completionRate}%
          </span>
          <span className="text-xs text-slate-400 mt-1 block">
            {completedTasks.length} of {totalTasks} finished
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase block">
            Focus Time Logged
          </span>
          <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 block mt-1">
            {totalStudyHoursLogged}h
          </span>
          <span className="text-xs text-slate-400 mt-1 block">
            Timer recorded sessions
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase block">
            Pending Tasks
          </span>
          <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 block mt-1">
            {pendingTasks.length}
          </span>
          <span className="text-xs text-slate-400 mt-1 block">
            Active deliverables
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase block">
            Overdue Deadlines
          </span>
          <span
            className={`text-2xl sm:text-3xl font-black block mt-1 ${
              overdueTasks.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {overdueTasks.length}
          </span>
          <span className="text-xs text-slate-400 mt-1 block">
            {overdueTasks.length === 0 ? 'Zero overdue' : 'Action needed'}
          </span>
        </div>
      </div>

      {/* Responsive Analytics Two-Column Web Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Subject-Wise Progress (Mobile Vertically Stacked) */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-blue-500" />
            <span>Subject Completion</span>
          </h3>
          <span className="text-[10px] text-slate-400">Live Progress</span>
        </div>

        <div className="space-y-3 pt-1">
          {subjectBreakdown.map((subj) => (
            <div key={subj.subject} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">
                  {subj.subject}
                </span>
                <span className="font-mono text-[11px] text-slate-500 shrink-0">
                  {subj.completed}/{subj.total} ({subj.percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${subj.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Priority Distribution (Mobile Stacked) */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-rose-500" />
            <span>Pending Priority Breakdown</span>
          </h3>
          <span className="text-[10px] text-slate-400">Algorithm</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
            <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 block">
              CRITICAL
            </span>
            <span className="text-lg font-bold text-rose-800 dark:text-rose-200">
              {priorityDistribution.CRITICAL}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 block">
              HIGH
            </span>
            <span className="text-lg font-bold text-amber-800 dark:text-amber-200">
              {priorityDistribution.HIGH}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 block">
              MEDIUM
            </span>
            <span className="text-lg font-bold text-blue-800 dark:text-blue-200">
              {priorityDistribution.MEDIUM}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 block">
              LOW
            </span>
            <span className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
              {priorityDistribution.LOW}
            </span>
          </div>
        </div>
      </div>

      {/* Category Breakdown (Mobile List) */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-indigo-500" />
            <span>Deliverables by Category</span>
          </h3>
        </div>

        <div className="space-y-1.5 pt-1">
          {categoryBreakdown.map(([cat, count]) => (
            <div key={cat} className="flex items-center justify-between text-xs py-1">
              <span className="text-slate-600 dark:text-slate-400 font-medium truncate">
                {cat}
              </span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};
