import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryBadge } from '../common/CategoryBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { ProfileAvatar } from '../common/ProfileAvatar';
import { CreateTaskModal } from './CreateTaskModal';
import { ChangeDeadlineModal } from './ChangeDeadlineModal';
import { AnnouncementsModal } from './AnnouncementsModal';
import {
  Users,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  Megaphone,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Layers,
  ArrowRight,
  Search,
  Filter,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const {
    currentUser,
    tasks,
    allUsers,
    studentProgressMap,
    deleteTask,
    setActiveScreen,
    setSelectedTaskId,
    announcements,
  } = useApp();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedChangeDeadlineTaskId, setSelectedChangeDeadlineTaskId] = useState<string | null>(null);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const students = allUsers.filter((u) => u.role === 'student');
  const totalStudents = students.length;
  const activeTasks = tasks.length;

  const upcomingExams = tasks.filter(
    (t) =>
      t.category === 'Module Test' ||
      t.category === 'Lab Exam' ||
      t.category === 'Internal Exam' ||
      t.category === 'University Exam' ||
      t.category === 'Viva'
  ).length;

  let sumPct = 0;
  let totalTracked = 0;
  tasks.forEach((t) => {
    const prog = studentProgressMap[t.id];
    if (prog) {
      sumPct += prog.progressPercentage;
      totalTracked++;
    }
  });
  const avgProgress = totalTracked > 0 ? Math.round(sumPct / totalTracked) : 0;

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12 w-full max-w-7xl mx-auto">
      {/* 1. Web Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-6 sm:p-7 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-5 border border-indigo-900/50">
        <div className="relative z-10 flex items-center gap-4 min-w-0">
          <ProfileAvatar
            photoUrl={currentUser.photoUrl}
            name={currentUser.fullName}
            initials={currentUser.initials}
            role="teacher"
            size="lg"
            shape="rounded"
            onEditClick={() => setActiveScreen('profile')}
            className="cursor-pointer shrink-0 shadow-md ring-2 ring-indigo-400/40"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
                {currentUser.fullName}
              </h2>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200">
                Faculty Portal
              </span>
            </div>
            <p className="text-xs sm:text-sm text-indigo-200 truncate mt-1">
              {currentUser.teacherTitle || 'Associate Professor'} • {currentUser.department}
            </p>
            <p className="text-xs text-indigo-300 font-mono mt-0.5">
              Assigned Class: {currentUser.classDept} • Institutional: {currentUser.email}
            </p>
          </div>
        </div>

        {/* Quick Action Buttons on Desktop / Tablet */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE TASK</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAnnouncementOpen(true)}
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-700/80 hover:bg-indigo-600 text-white text-xs font-bold transition-all border border-indigo-400/30 cursor-pointer"
          >
            <Megaphone className="w-4 h-4" />
            <span>ANNOUNCE</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('students')}
            className="flex items-center gap-2 py-2.5 px-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-indigo-200 text-xs font-semibold transition-all border border-slate-700 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>ROSTER</span>
          </button>
        </div>
      </div>

      {/* 2. Responsive 4-Column Statistics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveScreen('students')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Enrolled Students</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {totalStudents}
            </span>
          </div>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all">
            <span>View Student Roster</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Active Deliverables</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {activeTasks}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Assignments, Labs & Quizzes
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Upcoming Exams</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-purple-600 dark:text-purple-400">
              {upcomingExams}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Tests, Lab Exams & Viva
          </span>
        </div>

        <div
          onClick={() => setActiveScreen('students')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Class Average Progress</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {avgProgress}%
            </span>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all">
            <span>Detailed Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* 3. Main Web Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Managed Course Deliverables */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Curricular Deliverables ({filteredTasks.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage deadlines, extend submission timelines, and review student progress
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Deliverable</span>
              </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search deliverables by title or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                <option value="Assignment">Assignment</option>
                <option value="Lab Record">Lab Record</option>
                <option value="Module Test">Module Test</option>
                <option value="Internal Exam">Internal Exam</option>
                <option value="Project Milestone">Project Milestone</option>
                <option value="Viva">Viva</option>
              </select>
            </div>

            {/* Deliverables List */}
            <div className="space-y-3 pt-1">
              {filteredTasks.map((task) => {
                const hasHistory = task.deadlineHistory && task.deadlineHistory.length > 0;
                const prog = studentProgressMap[task.id];
                const pct = prog ? prog.progressPercentage : 0;

                return (
                  <div
                    key={task.id}
                    className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-700 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CategoryBadge category={task.category} size="sm" />
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          {task.subject} • Class: {task.targetClass}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          Weight: {task.importance}/5
                        </span>
                        {hasHistory && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            EXTENDED
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">
                        {task.description}
                      </p>
                    </div>

                    {/* Progress & Deadline Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span>Deadline: {task.deadlineDate} at {task.deadlineTime}</span>
                      </div>

                      {/* Class Completion Tracker */}
                      <div className="flex items-center gap-2 min-w-36">
                        <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 min-w-8 text-right">
                          {pct}%
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      <button
                        type="button"
                        onClick={() => setSelectedChangeDeadlineTaskId(task.id)}
                        className="py-1.5 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold transition-colors cursor-pointer"
                        title="Extend or reschedule deadline"
                      >
                        Adjust Deadline
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedTaskId(task.id)}
                        className="py-1.5 px-3 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                        title="View details and submissions"
                      >
                        Details
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete "${task.title}"?`)) {
                            deleteTask(task.id);
                          }
                        }}
                        className="py-1.5 px-2.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
                        title="Delete deliverable"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Announcements & Quick Class Stats */}
        <div className="space-y-5">
          {/* Announcements Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-indigo-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Broadcast Announcements ({announcements.length})
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAnnouncementOpen(true)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                + New
              </button>
            </div>

            <div className="space-y-2.5">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 dark:text-white truncate">
                      {ann.title}
                    </span>
                    {ann.isUrgent && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 shrink-0">
                        URGENT
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    {ann.content}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Target: {ann.targetClass}</span>
                    <span>{ann.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Roster Glance */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-500" />
                <span>Class Roster Preview</span>
              </h4>
              <button
                type="button"
                onClick={() => setActiveScreen('students')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Full List →
              </button>
            </div>

            <div className="space-y-2">
              {students.slice(0, 4).map((student) => (
                <div
                  key={student.id}
                  onClick={() => setActiveScreen('students')}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ProfileAvatar
                      photoUrl={student.photoUrl}
                      name={student.fullName}
                      initials={student.initials}
                      role="student"
                      size="xs"
                      shape="circle"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {student.fullName}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {student.studentIdNum} • {student.email}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {student.classDept}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isCreateOpen && <CreateTaskModal onClose={() => setIsCreateOpen(false)} />}
      {selectedChangeDeadlineTaskId && (
        <ChangeDeadlineModal
          taskId={selectedChangeDeadlineTaskId}
          onClose={() => setSelectedChangeDeadlineTaskId(null)}
        />
      )}
      {isAnnouncementOpen && (
        <AnnouncementsModal onClose={() => setIsAnnouncementOpen(false)} />
      )}
    </div>
  );
};
