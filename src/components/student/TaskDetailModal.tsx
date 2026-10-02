import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryBadge } from '../common/CategoryBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { ProfileAvatar } from '../common/ProfileAvatar';
import {
  X,
  Clock,
  Calendar,
  FileText,
  Download,
  Upload,
  Play,
  History,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Save,
  User,
} from 'lucide-react';

interface TaskDetailModalProps {
  taskId: string;
  onClose: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ taskId, onClose }) => {
  const {
    enrichedTasks,
    updateStudentProgress,
    startStudyTimer,
    activeTimerTaskId,
    addToast,
    role,
    allUsers,
  } = useApp();

  const task = enrichedTasks.find((t) => t.id === taskId);
  const teacherUser = allUsers.find((u) => u.id === task?.createdByTeacherId || u.fullName === task?.createdByName);

  if (!task) return null;

  const [progressVal, setProgressVal] = useState<number>(
    task.studentProgress.progressPercentage
  );
  const [remainingHours, setRemainingHours] = useState<number>(
    task.studentProgress.estimatedRemainingHours || 2
  );
  const [submissionNotes, setSubmissionNotes] = useState<string>(
    task.studentProgress.studentSubmissionNotes || ''
  );
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProgress = () => {
    setIsSaving(true);
    let subFileMeta: { name: string; url: string; size: string; type: string } | undefined = undefined;

    if (submissionFile) {
      subFileMeta = {
        name: submissionFile.name,
        url: URL.createObjectURL(submissionFile),
        size: `${(submissionFile.size / (1024 * 1024)).toFixed(1)} MB`,
        type: submissionFile.type || 'application/pdf',
      };
    }

    setTimeout(() => {
      updateStudentProgress(
        task.id,
        progressVal,
        remainingHours,
        submissionNotes,
        subFileMeta
      );
      setIsSaving(false);
      if (progressVal === 100) {
        onClose();
      }
    }, 400);
  };

  const handleDownloadAttachment = (name: string) => {
    addToast(`Downloading official course attachment: ${name}`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <CategoryBadge category={task.category} size="sm" />
              <PriorityBadge
                level={task.calculatedPriority.level}
                score={task.calculatedPriority.score}
                showScore={true}
                size="sm"
              />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
              {task.title}
            </h2>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold truncate">
              {task.subject} • Class: {task.targetClass}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Key Metrics 2x2 Grid for Mobile */}
          <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Deadline
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3 text-blue-500" />
                {task.deadlineDate}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Time Due
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-blue-500" />
                {task.deadlineTime}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Assigned By
              </span>
              <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
                <ProfileAvatar
                  photoUrl={teacherUser?.photoUrl}
                  name={task.createdByName}
                  initials={teacherUser?.initials}
                  role="teacher"
                  size="xs"
                  shape="circle"
                />
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {task.createdByName}
                </span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Est. Duration
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                <Layers className="w-3 h-3 text-emerald-500" />
                {task.estimatedHours} hrs
              </span>
            </div>
          </div>

          {/* Teacher Instructions & Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Academic Guidelines & Task Description
            </h4>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {task.description}
            </div>
          </div>

          {/* Official Attachments */}
          {task.attachments.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Course Material Attachments ({task.attachments.length})
              </h4>
              <div className="space-y-2">
                {task.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white block truncate">
                          {att.name}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {att.size} • {att.type}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownloadAttachment(att.name)}
                      className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      title="Download Attachment"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deadline History (Teacher Modifications Audit) */}
          {task.deadlineHistory && task.deadlineHistory.length > 0 && (
            <div className="bg-amber-50/60 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-800/50">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wide mb-2">
                <History className="w-4 h-4" />
                <span>Official Deadline History & Extensions</span>
              </div>
              <div className="space-y-2.5">
                {task.deadlineHistory.map((item) => (
                  <div key={item.id} className="text-xs text-slate-700 dark:text-slate-300 border-l-2 border-amber-400 pl-3">
                    <div className="font-semibold text-amber-900 dark:text-amber-200">
                      Changed from <span className="line-through">{item.previousDeadline}</span> to{' '}
                      <span className="font-bold underline">{item.newDeadline}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">
                      Reason: "{item.reason}" — authorized by {item.changedBy} on{' '}
                      {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Student Progress Update Panel */}
          <div className="bg-blue-50/50 dark:bg-blue-950/20 p-5 rounded-2xl border border-blue-200 dark:border-blue-900/40 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                  Student Progress & Submission
                </h4>
                <p className="text-[11px] text-blue-700 dark:text-blue-400">
                  Slide to update completion percentage. Live priority recalculates automatically.
                </p>
              </div>
              <span className="text-lg font-extrabold text-blue-700 dark:text-blue-300">
                {progressVal}%
              </span>
            </div>

            {/* Slider */}
            <div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={progressVal}
                onChange={(e) => setProgressVal(Number(e.target.value))}
                className="w-full h-2.5 bg-blue-200 dark:bg-blue-950 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>0% (Not Started)</span>
                <span>25%</span>
                <span>50% (Halfway)</span>
                <span>75%</span>
                <span>100% (Completed)</span>
              </div>
            </div>

            {/* Quick Progress Buttons */}
            <div className="flex flex-wrap gap-2">
              {[0, 25, 50, 75, 100].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setProgressVal(val)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                    progressVal === val
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>

            {/* Remaining hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Est. Remaining Hours of Work
                </label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  step="0.5"
                  value={remainingHours}
                  onChange={(e) => setRemainingHours(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Attach Student PDF / Submission
                </label>
                <label className="flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-500 cursor-pointer text-slate-700 dark:text-slate-300 truncate">
                  <Upload className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="truncate">
                    {submissionFile
                      ? submissionFile.name
                      : task.studentProgress.submissionAttachment
                      ? task.studentProgress.submissionAttachment.name
                      : 'Select PDF to upload'}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.zip,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setSubmissionFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Submission / Study Notes */}
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Student Progress Notes / Questions for Instructor
              </label>
              <textarea
                rows={2}
                value={submissionNotes}
                onChange={(e) => setSubmissionNotes(e.target.value)}
                placeholder="e.g. Implemented rotational balancing, currently debugging unit tests..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveProgress}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving to Database...' : 'Save Progress & Recalculate'}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                startStudyTimer(task.id);
                onClose();
              }}
              className="py-2 px-3 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Play className="w-3 h-3 text-emerald-400" />
              <span>Launch Timer</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-2 px-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-center border border-slate-200 dark:border-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
