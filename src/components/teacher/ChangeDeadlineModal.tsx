import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Calendar,
  Clock,
  History,
  AlertTriangle,
  ArrowRight,
  Save,
} from 'lucide-react';

interface ChangeDeadlineModalProps {
  taskId: string;
  onClose: () => void;
}

export const ChangeDeadlineModal: React.FC<ChangeDeadlineModalProps> = ({ taskId, onClose }) => {
  const { tasks, changeDeadline } = useApp();
  const task = tasks.find((t) => t.id === taskId);

  if (!task) return null;

  const [newDate, setNewDate] = useState(task.deadlineDate);
  const [newTime, setNewTime] = useState(task.deadlineTime);
  const [reason, setReason] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) {
      setErrorMessage('Please provide a valid new deadline date.');
      return;
    }
    if (newDate === task.deadlineDate && newTime === task.deadlineTime) {
      setErrorMessage('Please select a different date or time to modify the deadline.');
      return;
    }
    if (!reason.trim()) {
      setErrorMessage('Official reason for extension/change is required for student audit log.');
      return;
    }

    changeDeadline(task.id, newDate, newTime, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-amber-50/50 dark:bg-amber-950/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Modify Official Deadline
              </h2>
              <p className="text-[10px] text-slate-500">
                Official faculty schedule extension
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300">
              {errorMessage}
            </div>
          )}

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Target Task</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              {task.title}
            </h3>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              {task.subject} • Class: {task.targetClass}
            </p>
          </div>

          {/* Current vs New Deadline Display */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Current Deadline
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 line-through">
                {task.deadlineDate} • {task.deadlineTime}
              </span>
            </div>

            <ArrowRight className="w-4 h-4 text-blue-500" />

            <div>
              <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block">
                New Deadline
              </span>
              <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                {newDate} • {newTime}
              </span>
            </div>
          </div>

          {/* New Date & Time Pickers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                New Date *
              </label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                New Time *
              </label>
              <input
                type="time"
                required
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Reason for Change */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Official Extension / Change Reason *
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Granted 48h extension due to technical laboratory maintenance..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          {/* Notice */}
          <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-200/60 dark:border-amber-800/40">
            <strong>System Impact:</strong> Saving will update all student records, recalculate priority scores, reschedule WorkManager reminders, and broadcast a deadline-change notification.
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Confirm & Broadcast Change</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 px-4 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-center"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
