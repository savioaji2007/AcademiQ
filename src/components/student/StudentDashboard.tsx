import React from 'react';
import { useApp } from '../../context/AppContext';
import { getWhatShouldIDoNowRecommendation } from '../../utils/priorityAlgorithm';
import { PriorityBadge } from '../common/PriorityBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { ProfileAvatar } from '../common/ProfileAvatar';
import {
  Calendar,
  Clock,
  Play,
  Pause,
  Square,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  CalendarCheck2,
  SlidersHorizontal,
  Flame,
  BookOpen,
  Layers,
  Award,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    enrichedTasks,
    setActiveScreen,
    setSelectedTaskId,
    activeTimerTaskId,
    timerSeconds,
    isTimerRunning,
    startStudyTimer,
    pauseStudyTimer,
    stopAndLogStudyTimer,
    announcements,
  } = useApp();

  // Metrics calculation
  const totalTasks = enrichedTasks.length;
  const completedTasks = enrichedTasks.filter((t) => t.studentProgress.status === 'completed').length;
  const overdueTasks = enrichedTasks.filter(
    (t) => t.calculatedPriority.isOverdue && t.studentProgress.status !== 'completed'
  ).length;
  const pendingTasks = totalTasks - completedTasks;
  const urgentTasks = enrichedTasks.filter(
    (t) =>
      (t.calculatedPriority.level === 'CRITICAL' || t.calculatedPriority.level === 'HIGH') &&
      t.studentProgress.status !== 'completed'
  );
  const upcomingTests = enrichedTasks.filter(
    (t) =>
      (t.category === 'Module Test' ||
        t.category === 'Lab Exam' ||
        t.category === 'Internal Exam' ||
        t.category === 'University Exam' ||
        t.category === 'Viva') &&
      t.studentProgress.status !== 'completed'
  ).length;

  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // "WHAT SHOULD I DO NOW?" real calculation
  const recommendation = getWhatShouldIDoNowRecommendation(enrichedTasks);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-6 pb-12 w-full max-w-7xl mx-auto">
      {/* 1. Web Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="relative z-10 flex items-center gap-4 min-w-0">
          <ProfileAvatar
            photoUrl={currentUser.photoUrl}
            name={currentUser.fullName}
            initials={currentUser.initials}
            role="student"
            size="lg"
            shape="rounded"
            onEditClick={() => setActiveScreen('profile')}
            className="cursor-pointer shrink-0 shadow-md"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
                {currentUser.fullName}
              </h2>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-white/20 border border-white/20 shrink-0">
                Student
              </span>
            </div>
            <p className="text-xs sm:text-sm text-blue-100 truncate mt-1">
              {currentUser.classDept} • {currentUser.semester} • {currentUser.department}
            </p>
            <div className="flex items-center gap-2 text-blue-200 text-xs mt-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{currentDateStr}</span>
              <span>•</span>
              <span className="font-mono">ID: {currentUser.studentIdNum}</span>
            </div>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveScreen('planner')}
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-xs font-bold text-white transition-all shadow-xs"
          >
            <CalendarCheck2 className="w-4 h-4 text-sky-300" />
            <span>AI Study Planner</span>
          </button>
          <button
            onClick={() => setActiveScreen('simulator')}
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-xs font-bold text-white transition-all shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-300" />
            <span>What-If Simulator</span>
          </button>
        </div>
      </div>

      {/* 2. Key Academic Metrics (4-Card Grid across web viewport) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">
            <span>Overall Progress</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">{overallProgress}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-500 h-2.5 rounded-full transition-all duration-700"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white block pt-0.5">
            {completedTasks} / {totalTasks} Completed
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase block">
            Completed Submissions
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {completedTasks}
            </span>
            <span className="text-xs text-slate-400">tasks</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block">
            Verified on syllabus
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase block">
            Pending Tasks
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
              {pendingTasks}
            </span>
            <span className="text-xs text-slate-400">active</span>
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium block">
            {overdueTasks > 0 ? `${overdueTasks} past deadline` : 'All on schedule'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase block">
            Upcoming Exams
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
              {upcomingTests}
            </span>
            <span className="text-xs text-slate-400">evaluations</span>
          </div>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium block">
            High priority impact
          </span>
        </div>
      </div>

      {/* 3. Main Multi-Column Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 Cols): Recommendation + Urgent Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* "WHAT SHOULD I DO NOW?" AI Recommendation Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-indigo-900/40 shadow-lg space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                <h3 className="text-xs sm:text-sm font-bold tracking-wider text-amber-400 uppercase">
                  WHAT SHOULD I DO NOW?
                </h3>
              </div>
              {recommendation.task && (
                <PriorityBadge level={recommendation.urgencyLevel} size="sm" />
              )}
            </div>

            {recommendation.task ? (
              <div className="space-y-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <CategoryBadge category={recommendation.task.category} size="sm" />
                    <span className="text-xs font-semibold text-indigo-300">
                      {recommendation.task.subject}
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                    {recommendation.task.title}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/5 rounded-xl p-3.5 border border-white/10">
                  <div>
                    <span className="text-slate-400 text-xs block">Due Date:</span>
                    <span className="font-bold text-slate-100 text-xs sm:text-sm">
                      {recommendation.task.deadlineDate} • {recommendation.task.deadlineTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">Current Progress:</span>
                    <span className="font-bold text-slate-100 text-xs sm:text-sm">
                      {recommendation.task.studentProgress.progressPercentage}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">Est. Work Left:</span>
                    <span className="font-semibold text-emerald-400 text-xs sm:text-sm">
                      ~{recommendation.task.studentProgress.estimatedRemainingHours || 2} hours
                    </span>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-indigo-200/90 bg-indigo-950/60 p-3.5 rounded-xl border border-indigo-800/40">
                  <span className="font-bold text-amber-300 block mb-0.5">Priority Analysis:</span>
                  {recommendation.reason}
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => startStudyTimer(recommendation.task!.id)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Working Now</span>
                  </button>

                  <button
                    onClick={() => setSelectedTaskId(recommendation.task!.id)}
                    className="py-2.5 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/15 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-300 py-3">All assigned academic tasks are completed!</p>
            )}
          </div>

          {/* Curricular Tasks Prioritized List */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  High-Priority Academic Workload
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Algorithmic ranking weighted by deadline, course difficulty, and progress
                </p>
              </div>

              <button
                onClick={() => setActiveScreen('tasks')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>View All ({enrichedTasks.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {enrichedTasks.slice(0, 6).map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-900/40 cursor-pointer transition-all space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block truncate">
                        {task.subject}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug truncate">
                        {task.title}
                      </h4>
                    </div>

                    <PriorityBadge
                      level={task.calculatedPriority.level}
                      score={task.calculatedPriority.score}
                      showScore={true}
                      size="sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Progress</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {task.studentProgress.progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${task.studentProgress.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-amber-500" />
                      Due: {task.deadlineDate}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-[11px]">
                      Inspect →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Focus Session + Notices + Quick Tools */}
        <div className="space-y-6">
          {/* Live Focus Session Widget if active */}
          {activeTimerTaskId && (
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-md border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Clock className="w-4 h-4 animate-spin text-blue-400" />
                  Live Focus Session
                </span>
                <span className="text-xl font-mono font-bold text-emerald-400">
                  {formatTimer(timerSeconds)}
                </span>
              </div>

              <p className="text-xs text-slate-200 truncate">
                {enrichedTasks.find((t) => t.id === activeTimerTaskId)?.title || 'Task'}
              </p>

              <div className="flex items-center gap-2 pt-1">
                {isTimerRunning ? (
                  <button
                    onClick={pauseStudyTimer}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </button>
                ) : (
                  <button
                    onClick={() => startStudyTimer(activeTimerTaskId)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Resume</span>
                  </button>
                )}
                <button
                  onClick={stopAndLogStudyTimer}
                  className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-semibold border border-slate-700"
                >
                  <Square className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Department Notices & Announcements */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Department Notices
              </h4>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase">
                Official
              </span>
            </div>

            <div className="space-y-2.5">
              {announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {ann.title}
                    </span>
                    {ann.isUrgent && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 shrink-0">
                        URGENT
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                    {ann.content}
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-0.5">
                    By {ann.authorName}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Smart Tools Quick Links */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Academic Smart Tools
            </h4>

            <div className="space-y-2">
              <button
                onClick={() => setActiveScreen('planner')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/80 dark:border-slate-700/80 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <CalendarCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">AI Study Planner</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Slot allocation with breaks</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">→</span>
              </button>

              <button
                onClick={() => setActiveScreen('simulator')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/80 dark:border-slate-700/80 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">What-If Simulator</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Extension & constraint projection</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">→</span>
              </button>

              <button
                onClick={() => setActiveScreen('calendar')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200/80 dark:border-slate-700/80 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Academic Calendar</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Timetable & deadlines view</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
