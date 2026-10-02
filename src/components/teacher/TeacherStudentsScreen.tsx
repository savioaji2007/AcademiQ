import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile } from '../../types';
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  ChevronRight,
  ArrowLeft,
  GraduationCap,
  FileText,
  Mail,
  Building,
  BookOpen,
  Filter,
  Check,
  Award,
} from 'lucide-react';
import { ProfileAvatar } from '../common/ProfileAvatar';

export const TeacherStudentsScreen: React.FC = () => {
  const { allUsers, tasks, studentProgressMap } = useApp();

  const students = allUsers.filter((u) => u.role === 'student');

  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(
    students.length > 0 ? students[0] : null
  );
  const [search, setSearch] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('ALL');

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.studentIdNum?.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchesSemester = semesterFilter === 'ALL' || s.semester === semesterFilter;
    return matchesSearch && matchesSemester;
  });

  return (
    <div className="space-y-6 pb-12 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Student Directory & Performance
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review academic submissions, contact details, and department progress
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold">
            {students.length} Enrolled Students
          </span>
        </div>
      </div>

      {/* Main 2-Column Responsive Web Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Student Roster List (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search students by name, ID or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Semester Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {['ALL', 'Semester 5', 'Semester 6', 'Semester 3'].map((sem) => (
                <button
                  key={sem}
                  type="button"
                  onClick={() => setSemesterFilter(sem)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    semesterFilter === sem
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {sem === 'ALL' ? 'All Semesters' : sem}
                </button>
              ))}
            </div>

            {/* Students List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No students matching your search criteria.
                </div>
              ) : (
                filteredStudents.map((st) => {
                  const isSelected = selectedStudent?.id === st.id;

                  // Calculate student completion
                  const total = tasks.length;
                  let completed = 0;
                  tasks.forEach((t) => {
                    const p = studentProgressMap[t.id];
                    if (p && p.progressPercentage >= 100) completed++;
                  });
                  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

                  return (
                    <div
                      key={st.id}
                      onClick={() => setSelectedStudent(st)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-400 dark:border-blue-600 shadow-xs ring-1 ring-blue-500/20'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <ProfileAvatar
                          photoUrl={st.photoUrl}
                          name={st.fullName}
                          initials={st.initials}
                          role="student"
                          size="md"
                          shape="rounded"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {st.fullName}
                          </h4>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block truncate">
                            {st.studentIdNum || 'ID: STU'} • {st.classDept}
                          </span>
                          <span className="text-[10px] text-blue-600 dark:text-blue-400 truncate block">
                            {st.email}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {completionRate}% Done
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 mt-1" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Student Academic Detail Pane (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedStudent ? (
            <div className="space-y-4">
              {/* Selected Student Profile Header Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <ProfileAvatar
                      photoUrl={selectedStudent.photoUrl}
                      name={selectedStudent.fullName}
                      initials={selectedStudent.initials}
                      role="student"
                      size="xl"
                      shape="rounded"
                      className="shadow-sm ring-2 ring-blue-500/20 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                          {selectedStudent.fullName}
                        </h2>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          Student
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {selectedStudent.department}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-mono mt-0.5 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        <span>{selectedStudent.email}</span>
                      </p>
                    </div>
                  </div>

                  <a
                    href={`mailto:${selectedStudent.email}`}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-bold transition-colors border border-blue-200 dark:border-blue-900 self-start sm:self-auto"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Student</span>
                  </a>
                </div>

                {/* Academic Quick Stats Grid */}
                <div className="grid grid-cols-3 gap-3 pt-4">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Student ID
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-0.5 block truncate">
                      {selectedStudent.studentIdNum || 'STU-CS-01'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Class & Section
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 block truncate">
                      {selectedStudent.classDept}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Semester
                    </span>
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-0.5 block truncate">
                      {selectedStudent.semester}
                    </span>
                  </div>
                </div>
              </div>

              {/* Course Progress & Submissions */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Deliverables & Submissions ({tasks.length})
                  </h4>
                  <span className="text-xs text-slate-500">
                    Individual tracking status
                  </span>
                </div>

                <div className="space-y-3">
                  {tasks.map((task) => {
                    const progress = studentProgressMap[task.id];
                    const pct = progress ? progress.progressPercentage : 0;
                    const isDone = pct >= 100;

                    return (
                      <div
                        key={task.id}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            {task.subject} • {task.category}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border self-start sm:self-auto ${
                              isDone
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                                : pct > 0
                                ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {isDone ? 'Completed' : `${pct}% In Progress`}
                          </span>
                        </div>

                        <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                          {task.title}
                        </h5>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              isDone ? 'bg-emerald-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                            Due: {task.deadlineDate}
                          </span>
                          <span className="font-semibold">
                            Score: {isDone ? '10/10' : `${Math.round(pct / 10)}/10`}
                          </span>
                        </div>

                        {progress?.studentSubmissionNotes && (
                          <div className="text-xs text-slate-600 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                            "{progress.studentSubmissionNotes}"
                          </div>
                        )}

                        {progress?.submissionAttachment && (
                          <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-950/40 p-2 rounded-xl">
                            <FileText className="w-4 h-4 shrink-0" />
                            <span className="truncate">{progress.submissionAttachment.name}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 shadow-sm text-center text-slate-400">
              <Users className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm font-semibold">Select a student from the directory roster</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
