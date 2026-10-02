import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskCategory, DifficultyLevel } from '../../types';
import {
  X,
  Plus,
  Upload,
  Calendar,
  Clock,
  BookOpen,
  Layers,
  AlertCircle,
  Bell,
  Save,
} from 'lucide-react';

interface CreateTaskModalProps {
  onClose: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ onClose }) => {
  const { createTask } = useApp();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Data Structures & Algorithms');
  const [category, setCategory] = useState<TaskCategory>('Assignment');
  const [description, setDescription] = useState('');
  const [targetClass, setTargetClass] = useState('CS-3A');
  const [targetSemester, setTargetSemester] = useState('Semester 5');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  const [importance, setImportance] = useState<number>(4);
  const [estimatedHours, setEstimatedHours] = useState<number>(3.5);
  
  // Default deadline tomorrow 17:00
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [deadlineDate, setDeadlineDate] = useState(tomorrowStr);
  const [deadlineTime, setDeadlineTime] = useState('17:00');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  const [reminder2Days, setReminder2Days] = useState(true);
  const [reminder1Day, setReminder1Day] = useState(true);
  const [reminderSameDay, setReminderSameDay] = useState(true);
  const [reminderFinalAlert, setReminderFinalAlert] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please enter an official academic task title.');
      return;
    }
    if (!subject.trim()) {
      setErrorMessage('Please specify the academic subject.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please provide instructions/description for students.');
      return;
    }
    if (!deadlineDate) {
      setErrorMessage('Please choose a valid deadline date.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await createTask(
        {
          title: title.trim(),
          subject: subject.trim(),
          category,
          description: description.trim(),
          targetClass,
          targetSemester,
          difficulty,
          importance,
          estimatedHours,
          deadlineDate,
          deadlineTime,
          attachments: [],
          reminderSettings: {
            twoDaysBefore: reminder2Days,
            oneDayBefore: reminder1Day,
            sameDay: reminderSameDay,
            finalAlert: reminderFinalAlert,
          },
        },
        attachmentFile
      );
      setIsSubmitting(false);
      onClose();
    } catch {
      setErrorMessage('Failed to create task. Please check parameters.');
      setIsSubmitting(false);
    }
  };

  const categories: TaskCategory[] = [
    'Assignment',
    'Module Test',
    'Lab Exam',
    'Lab Record Submission',
    'Notebook Submission',
    'Internal Exam',
    'University Exam',
    'Project',
    'Seminar',
    'Presentation',
    'Viva',
    'Other Academic Activity',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Create & Assign Task
              </h2>
              <p className="text-[10px] text-slate-500">
                Official curriculum deliverable publication
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
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto flex-1 text-xs">
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-[11px] text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Task Title */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Red-Black Trees Benchmarking & Report"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Subject & Category */}
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Subject *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                <option value="Object-Oriented Programming">Object-Oriented Programming</option>
                <option value="Database Management Systems">Database Management Systems</option>
                <option value="Computer Networks">Computer Networks</option>
                <option value="Operating Systems">Operating Systems</option>
                <option value="Discrete Mathematics">Discrete Mathematics</option>
                <option value="Software Engineering">Software Engineering</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Class & Est Hours */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Target Class
              </label>
              <input
                type="text"
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Est. Hours
              </label>
              <input
                type="number"
                min="0.5"
                max="50"
                step="0.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Difficulty & Importance */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Very Hard">Very Hard</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Importance: {importance}/5
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={importance}
                onChange={(e) => setImportance(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer mt-1"
              />
            </div>
          </div>

          {/* Deadline Date & Time */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Deadline Date *
              </label>
              <input
                type="date"
                required
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Due Time *
              </label>
              <input
                type="time"
                required
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Guidelines Description */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Guidelines & Description *
            </label>
            <textarea
              required
              rows={3}
              placeholder="State problem statement, rubrics, submission requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Attachment upload */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Course Guide Attachment (PDF / Document)
            </label>
            <label className="flex items-center justify-center gap-2 p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 cursor-pointer text-slate-600 dark:text-slate-300 truncate">
              <Upload className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="truncate">{attachmentFile ? attachmentFile.name : 'Select PDF or Document'}</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setAttachmentFile(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>

          {/* Reminder settings */}
          <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-1.5">
            <span className="text-[11px] font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 text-blue-600" />
              <span>Automated Reminders</span>
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={reminder2Days}
                  onChange={(e) => setReminder2Days(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>2 Days Before</span>
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={reminder1Day}
                  onChange={(e) => setReminder1Day(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>1 Day Before</span>
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={reminderSameDay}
                  onChange={(e) => setReminderSameDay(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Same Day</span>
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={reminderFinalAlert}
                  onChange={(e) => setReminderFinalAlert(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Final Alert</span>
              </label>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Publishing...' : 'Save & Publish Task'}</span>
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
