import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { simulateDeadlinePostponement } from '../../utils/whatIfSimulator';
import { PriorityBadge } from '../common/PriorityBadge';
import {
  SlidersHorizontal,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const WhatIfSimulatorScreen: React.FC = () => {
  const { enrichedTasks } = useApp();

  const unfinishedTasks = enrichedTasks.filter(
    (t) => t.studentProgress.status !== 'completed'
  );

  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    unfinishedTasks[0]?.id || ''
  );
  const [daysToPostpone, setDaysToPostpone] = useState<number>(2);

  // Time constrained mode state
  const [constrainedHours, setConstrainedHours] = useState<number>(2);

  const currentTask = unfinishedTasks.find((t) => t.id === selectedTaskId);

  // Run simulation if task selected
  const simulation = currentTask
    ? simulateDeadlinePostponement(currentTask, enrichedTasks, daysToPostpone)
    : null;

  // Constrained hours high-priority items
  const constrainedPlan = [...unfinishedTasks]
    .sort((a, b) => b.calculatedPriority.score - a.calculatedPriority.score)
    .reduce<{ taskTitle: string; hoursAllocated: number; priority: string }[]>(
      (acc, t) => {
        const totalUsed = acc.reduce((sum, item) => sum + item.hoursAllocated, 0);
        const remBudget = constrainedHours - totalUsed;
        if (remBudget <= 0.2) return acc;

        const needed = t.studentProgress.estimatedRemainingHours || 2;
        const alloc = Math.min(needed, remBudget);
        acc.push({
          taskTitle: `${t.subject}: ${t.title}`,
          hoursAllocated: Math.round(alloc * 10) / 10,
          priority: t.calculatedPriority.level,
        });
        return acc;
      },
      []
    );

  return (
    <div className="space-y-6 pb-12 w-full max-w-7xl mx-auto">
      {/* Title & Safety Notice Banner */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              What-If Academic Simulator
            </h1>
            <p className="text-xs text-slate-500">
              Interactive sandbox for deadline postponements and time-budget allocation
            </p>
          </div>
        </div>

        {/* Safety Notice */}
        <div className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center gap-2 text-xs text-blue-900 dark:text-blue-300 shrink-0">
          <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-xs">
            <strong>Sandboxed Mode:</strong> Calculations are local projections. Official course deadlines remain unchanged.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Scenario 1: Postpone Deadlines */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>Postpone Task Deadline</span>
            </h3>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
              Impact
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Select Unfinished Task:
            </label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            >
              {unfinishedTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.subject} - {t.title} (Due: {t.deadlineDate})
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>Postpone By:</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                +{daysToPostpone} {daysToPostpone === 1 ? 'day' : 'days'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="7"
              step="1"
              value={daysToPostpone}
              onChange={(e) => setDaysToPostpone(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
              <span>+1 Day</span>
              <span>+3 Days</span>
              <span>+5 Days</span>
              <span>+7 Days (1 Wk)</span>
            </div>
          </div>

          {/* Simulation Output Card */}
          {simulation && (
            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Simulated Target Date:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {simulation.simulatedDeadline}
                </span>
              </div>

              {/* Priority Comparison */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Current Priority
                  </span>
                  <PriorityBadge level={simulation.originalPriority} score={simulation.originalScore} showScore />
                </div>

                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Simulated Priority
                  </span>
                  <PriorityBadge level={simulation.simulatedPriority} score={simulation.simulatedScore} showScore />
                </div>
              </div>

              {/* Conflict Warnings */}
              {simulation.hasConflictWithOtherDeadlines ? (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Deadlines Conflict Detected!</span>
                  </div>
                  <p className="text-[11px]">
                    Clashes with: {simulation.conflictingTasks.map((c) => c.title).join(', ')}
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No deadline collisions with other courses.</span>
                </div>
              )}

              {/* Algorithmic Advice */}
              <div className="text-xs text-slate-600 dark:text-slate-400 font-sans italic bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                "{simulation.summaryAdvice}"
              </div>
            </div>
          )}
        </div>

        {/* Scenario 2: Constrained Study Time */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Scenario 2: "I Only Have X Hours Today"</span>
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300">
              Budget Optimizer
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>Time Budget for Today:</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">
                {constrainedHours} Hours
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={constrainedHours}
              onChange={(e) => setConstrainedHours(parseFloat(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
              <span>1 Hour</span>
              <span>2 Hours</span>
              <span>3 Hours</span>
              <span>4+ Hours</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Prioritized Allocation Plan:
            </span>

            {constrainedPlan.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No unfinished tasks available for planning.
              </div>
            ) : (
              <div className="space-y-2">
                {constrainedPlan.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {item.taskTitle}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Priority Level: {item.priority}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                      {item.hoursAllocated} hrs
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
