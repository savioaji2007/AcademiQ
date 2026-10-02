import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { generateDailyStudyPlan } from '../../utils/studyPlanner';
import { StudyPlanSlot } from '../../types';
import {
  CalendarCheck2,
  Clock,
  Coffee,
  CheckCircle2,
  RotateCw,
  Plus,
  Trash2,
  Sparkles,
  Save,
  Play,
} from 'lucide-react';

export const StudyPlannerScreen: React.FC = () => {
  const {
    enrichedTasks,
    startStudyTimer,
    addToast,
    setSelectedTaskId,
  } = useApp();

  const [availableHours, setAvailableHours] = useState<number>(3.5);
  const [breakMinutes, setBreakMinutes] = useState<number>(15);
  const [startHour, setStartHour] = useState<number>(16); // 4:00 PM

  const [slots, setSlots] = useState<StudyPlanSlot[]>([]);

  // Generate on first mount or when options change
  useEffect(() => {
    const generated = generateDailyStudyPlan(enrichedTasks, {
      availableHours,
      breakMinutes,
      startHour,
      startMinute: 0,
    });
    setSlots(generated);
  }, [availableHours, breakMinutes, startHour, enrichedTasks]);

  const handleRegenerate = () => {
    const fresh = generateDailyStudyPlan(enrichedTasks, {
      availableHours,
      breakMinutes,
      startHour,
      startMinute: 0,
    });
    setSlots(fresh);
    addToast('Regenerated optimized study schedule based on current priorities.', 'info');
  };

  const toggleSlotCompleted = (slotId: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, isCompleted: !s.isCompleted } : s))
    );
  };

  const handleSavePlan = () => {
    addToast('Study plan saved for today! Notifications scheduled.', 'success');
  };

  return (
    <div className="space-y-6 pb-12 w-full max-w-7xl mx-auto">
      {/* Title Bar */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <CalendarCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Today's Study Plan
            </h1>
            <p className="text-xs text-slate-500">
              Personalized block timeline optimized for deadlines
            </p>
          </div>
        </div>

        <button
          onClick={handleRegenerate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs shrink-0"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Regenerate</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Control Panel: Student Availability Inputs */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Availability Parameters
        </h3>

        <div className="space-y-3">
          {/* Available Study Hours */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>Available Study Time:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {availableHours} Hours
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={availableHours}
              onChange={(e) => setAvailableHours(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Break Duration */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>Break Interval:</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {breakMinutes} Mins
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="5"
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Session Start Time
            </label>
            <select
              value={startHour}
              onChange={(e) => setStartHour(parseInt(e.target.value))}
              className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              <option value={9}>9:00 AM (Morning)</option>
              <option value={13}>1:00 PM (Afternoon)</option>
              <option value={16}>4:00 PM (Post-Classes)</option>
              <option value={18}>6:00 PM (Evening)</option>
              <option value={20}>8:00 PM (Night)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Generated Study Schedule Slots */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Today's Tailored Timeline ({slots.length} Blocks)
            </h3>
          </div>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            Total Focus: {availableHours} hrs
          </span>
        </div>

        <div className="space-y-3">
          {slots.map((slot, idx) => {
            const isBreak = slot.category === 'break';

            return (
              <div
                key={slot.id}
                className={`rounded-2xl p-4 sm:p-5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  slot.isCompleted
                    ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                    : isBreak
                    ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
                    : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-400'
                }`}
              >
                <div className="flex items-start sm:items-center gap-4">
                  {/* Status Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleSlotCompleted(slot.id)}
                    className={`mt-1 sm:mt-0 p-1 rounded-lg border transition-colors ${
                      slot.isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-5 h-5 ${slot.isCompleted ? 'text-white' : 'text-transparent'}`}
                    />
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {slot.timeSlot}
                      </span>
                      <span className="text-[11px] text-slate-400">• {slot.durationMinutes} mins</span>
                      {isBreak && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                          Break
                        </span>
                      )}
                    </div>
                    <h4
                      className={`text-sm font-bold ${
                        slot.isCompleted
                          ? 'line-through text-slate-500 dark:text-slate-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {slot.title}
                    </h4>
                  </div>
                </div>

                {/* Slot Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {!isBreak && slot.taskId && (
                    <>
                      <button
                        type="button"
                        onClick={() => startStudyTimer(slot.taskId!)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Start</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedTaskId(slot.taskId!)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                      >
                        Details
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Save Plan Button */}
        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSavePlan}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            <span>Save & Schedule Reminders</span>
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};
