import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  Task,
  StudentProgress,
  UserProfile,
  Announcement,
  AppNotification,
  EnrichedTask,
  SyncStatus,
  UserRole,
  Attachment,
  getInitials,
} from '../types';
import {
  initialTasks,
  initialStudents,
  initialTeacher,
  initialStudentProgress,
  initialAnnouncements,
  initialNotifications,
} from '../data/seedData';
import { calculateTaskPriority, getWhatShouldIDoNowRecommendation } from '../utils/priorityAlgorithm';

interface AppContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  role: UserRole;
  switchRole: (role: UserRole) => void;
  setCurrentUser: (user: UserProfile) => void;
  tasks: Task[];
  enrichedTasks: EnrichedTask[];
  studentProgressMap: Record<string, StudentProgress>;
  announcements: Announcement[];
  notifications: AppNotification[];
  unreadNotifCount: number;
  syncStatus: SyncStatus;
  toggleSyncStatus: () => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  activeScreen: string;
  setActiveScreen: (screen: string) => void;

  // Task Actions
  createTask: (newTask: Omit<Task, 'id' | 'createdAt' | 'deadlineHistory' | 'createdByTeacherId' | 'createdByName'>, attachmentFile?: File | null) => Promise<boolean>;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  changeDeadline: (taskId: string, newDate: string, newTime: string, reason: string) => void;

  // Student Actions
  updateStudentProgress: (
    taskId: string,
    progressPercentage: number,
    remainingHours?: number,
    notes?: string,
    submissionFile?: { name: string; url: string; size: string; type: string }
  ) => void;

  // Active Timer / Study Stopwatch
  activeTimerTaskId: string | null;
  timerSeconds: number;
  isTimerRunning: boolean;
  startStudyTimer: (taskId: string) => void;
  pauseStudyTimer: () => void;
  resumeStudyTimer: () => void;
  stopAndLogStudyTimer: () => void;

  // Announcements & Notifications
  createAnnouncement: (title: string, content: string, targetClass: string, isUrgent: boolean, relatedTaskId?: string) => void;
  markNotificationAsRead: (notifId: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;

  // Profile Management
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // Demo Reset
  resetToDemoData: () => void;

  // Selected task for detail modal
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  CURRENT_USER: 'academiq_current_user',
  ALL_USERS: 'academiq_all_users',
  TASKS: 'academiq_tasks',
  PROGRESS: 'academiq_progress',
  ANNOUNCEMENTS: 'academiq_announcements',
  NOTIFICATIONS: 'academiq_notifications',
  THEME: 'academiq_theme',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
    return (saved as 'light' | 'dark' | 'system') || 'light';
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, theme);
    const root = document.documentElement;

    const applyTheme = () => {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    };

    applyTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  // Sync state (online/offline/syncing)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('online');

  // Active Screen
  const [activeScreen, setActiveScreen] = useState<string>('home');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Users state
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ALL_USERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [...initialStudents, initialTeacher];
  });

  const [currentUser, setCurrentUserState] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return initialStudents[0]; // Alex Rivera by default
  });

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.TASKS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return initialTasks;
  });

  // Student progress state
  const [studentProgressMap, setStudentProgressMap] = useState<Record<string, StudentProgress>>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PROGRESS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return initialStudentProgress;
  });

  // Announcements state
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ANNOUNCEMENTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return initialAnnouncements;
  });

  // Notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return initialNotifications;
  });

  // Study Timer state
  const [activeTimerTaskId, setActiveTimerTaskId] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Live Timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isTimerRunning && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Persist whenever state changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ALL_USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PROGRESS, JSON.stringify(studentProgressMap));
  }, [studentProgressMap]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Toast banner dispatch
  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    // Custom event for Toast notification in UI
    const event = new CustomEvent('academiq-toast', {
      detail: { message, type, id: Date.now() },
    });
    window.dispatchEvent(event);
  };

  // Switch role helper
  const switchRole = (newRole: UserRole) => {
    if (newRole === 'teacher') {
      const teacher = allUsers.find((u) => u.role === 'teacher') || initialTeacher;
      setCurrentUserState(teacher);
      setActiveScreen('home');
      addToast(`Switched to Teacher account (${teacher.fullName})`, 'info');
    } else {
      const student = allUsers.find((u) => u.role === 'student') || initialStudents[0];
      setCurrentUserState(student);
      setActiveScreen('home');
      addToast(`Switched to Student account (${student.fullName})`, 'info');
    }
  };

  const toggleSyncStatus = () => {
    if (syncStatus === 'online') {
      setSyncStatus('offline');
      addToast('Offline mode active. Changes will be saved locally.', 'warning');
    } else if (syncStatus === 'offline') {
      setSyncStatus('syncing');
      setTimeout(() => {
        setSyncStatus('online');
        addToast('Synced successfully with cloud Firestore database.', 'success');
      }, 1200);
    }
  };

  // Compute Enriched Tasks with real priorities for active student
  const enrichedTasks = useMemo<EnrichedTask[]>(() => {
    const studentId = currentUser.role === 'student' ? currentUser.id : 'student-1';

    return tasks.map((task) => {
      // Find progress or build default
      let progress = studentProgressMap[task.id];
      if (!progress || progress.studentId !== studentId) {
        progress = {
          taskId: task.id,
          studentId: studentId,
          progressPercentage: 0,
          estimatedRemainingHours: task.estimatedHours,
          status: 'not_started',
          workTimeSpentMinutes: 0,
        };
      }

      const calculatedPriority = calculateTaskPriority(task, progress);

      return {
        ...task,
        studentProgress: progress,
        calculatedPriority,
      };
    });
  }, [tasks, studentProgressMap, currentUser]);

  // Unread notification count
  const unreadNotifCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead && n.userId === currentUser.id).length;
  }, [notifications, currentUser]);

  // TASK OPERATIONS
  const createTask = async (
    newTaskData: Omit<Task, 'id' | 'createdAt' | 'deadlineHistory' | 'createdByTeacherId' | 'createdByName'>,
    attachmentFile?: File | null
  ): Promise<boolean> => {
    const taskId = `task-${Date.now()}`;
    const newAttachments: Attachment[] = [...newTaskData.attachments];

    if (attachmentFile) {
      newAttachments.push({
        id: `att-${Date.now()}`,
        name: attachmentFile.name,
        url: URL.createObjectURL(attachmentFile),
        size: `${(attachmentFile.size / (1024 * 1024)).toFixed(1)} MB`,
        type: attachmentFile.type || 'application/octet-stream',
      });
    }

    const createdTask: Task = {
      ...newTaskData,
      id: taskId,
      createdByTeacherId: currentUser.id,
      createdByName: currentUser.fullName,
      createdAt: new Date().toISOString(),
      attachments: newAttachments,
      deadlineHistory: [],
    };

    setTasks((prev) => [createdTask, ...prev]);

    // Initialize progress for all students
    setStudentProgressMap((prev) => {
      const next = { ...prev };
      next[taskId] = {
        taskId,
        studentId: 'student-1',
        progressPercentage: 0,
        estimatedRemainingHours: createdTask.estimatedHours,
        status: 'not_started',
        workTimeSpentMinutes: 0,
      };
      return next;
    });

    // Generate assignment notification for students
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: 'student-1',
      title: 'NEW ACADEMIC TASK ASSIGNED',
      message: `${currentUser.fullName} assigned "${createdTask.title}" (${createdTask.subject}). Due on ${createdTask.deadlineDate}.`,
      type: 'new_assignment',
      timestamp: new Date().toISOString(),
      isRead: false,
      taskId: taskId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast(`Task "${createdTask.title}" created & assigned to class ${createdTask.targetClass}!`, 'success');
    return true;
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return { ...t, ...updates };
        }
        return t;
      })
    );
    addToast('Task details updated successfully.', 'success');
  };

  const deleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setStudentProgressMap((prev) => {
      const copy = { ...prev };
      delete copy[taskId];
      return copy;
    });
    addToast(`Task "${taskToDelete?.title || ''}" deleted.`, 'info');
  };

  // CHANGE DEADLINE OPERATION (Teacher Controlled)
  const changeDeadline = (taskId: string, newDate: string, newTime: string, reason: string) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    const previousDeadline = `${targetTask.deadlineDate} ${targetTask.deadlineTime}`;
    const newDeadline = `${newDate} ${newTime}`;

    const historyItem = {
      id: `dh-${Date.now()}`,
      previousDeadline,
      newDeadline,
      reason: reason.trim() || 'Official schedule adjustment.',
      changedBy: currentUser.fullName,
      timestamp: new Date().toISOString(),
    };

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            deadlineDate: newDate,
            deadlineTime: newTime,
            deadlineHistory: [historyItem, ...(t.deadlineHistory || [])],
          };
        }
        return t;
      })
    );

    // Send high-priority deadline change notification to students
    const deadlineNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: 'student-1',
      title: 'DEADLINE UPDATED',
      message: `${targetTask.title} deadline moved from ${previousDeadline} to ${newDeadline}. Reason: ${historyItem.reason}`,
      type: 'deadline_changed',
      timestamp: new Date().toISOString(),
      isRead: false,
      taskId: taskId,
    };

    setNotifications((prev) => [deadlineNotif, ...prev]);
    addToast(`Deadline updated for "${targetTask.title}". Students notified.`, 'success');
  };

  // STUDENT PROGRESS UPDATE
  const updateStudentProgress = (
    taskId: string,
    percentage: number,
    remainingHours?: number,
    notes?: string,
    submissionFile?: { name: string; url: string; size: string; type: string }
  ) => {
    const studentId = currentUser.role === 'student' ? currentUser.id : 'student-1';
    const targetTask = tasks.find((t) => t.id === taskId);

    const isNowCompleted = percentage >= 100;
    const computedRemaining = remainingHours !== undefined 
      ? remainingHours 
      : isNowCompleted 
        ? 0 
        : Math.max(0.5, ((targetTask?.estimatedHours || 3) * (100 - percentage)) / 100);

    setStudentProgressMap((prev) => {
      const existing = prev[taskId] || {
        taskId,
        studentId,
        progressPercentage: 0,
        estimatedRemainingHours: targetTask?.estimatedHours || 3,
        status: 'not_started',
        workTimeSpentMinutes: 0,
      };

      const updated: StudentProgress = {
        ...existing,
        progressPercentage: percentage,
        estimatedRemainingHours: computedRemaining,
        status: isNowCompleted ? 'completed' : percentage > 0 ? 'in_progress' : 'not_started',
        lastWorkedAt: new Date().toISOString(),
        completedAt: isNowCompleted ? new Date().toISOString() : existing.completedAt,
        studentSubmissionNotes: notes !== undefined ? notes : existing.studentSubmissionNotes,
      };

      if (submissionFile) {
        updated.submissionAttachment = {
          id: `sub-${Date.now()}`,
          name: submissionFile.name,
          url: submissionFile.url,
          size: submissionFile.size,
          type: submissionFile.type,
        };
      }

      return {
        ...prev,
        [taskId]: updated,
      };
    });

    if (isNowCompleted) {
      // Trigger confetti celebration as requested in Section 15!
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3B82F6', '#10B981', '#6366F1', '#F59E0B'],
        });
      } catch {
        // ignore if canvas unavailable
      }
      addToast(`🎉 Milestone reached! Task marked 100% completed.`, 'success');
    } else {
      addToast(`Progress updated to ${percentage}%. Priority recalculated.`, 'info');
    }
  };

  // Study Timer
  const startStudyTimer = (taskId: string) => {
    setActiveTimerTaskId(taskId);
    setIsTimerRunning(true);
    const targetTask = tasks.find((t) => t.id === taskId);
    addToast(`Focus session started for: ${targetTask?.title || 'Task'}`, 'info');
  };

  const pauseStudyTimer = () => {
    setIsTimerRunning(false);
    addToast('Study timer paused.', 'info');
  };

  const resumeStudyTimer = () => {
    setIsTimerRunning(true);
    addToast('Study timer resumed.', 'info');
  };

  const stopAndLogStudyTimer = () => {
    if (!activeTimerTaskId) return;
    const minutesStudied = Math.max(1, Math.round(timerSeconds / 60));

    setStudentProgressMap((prev) => {
      const existing = prev[activeTimerTaskId];
      if (!existing) return prev;
      return {
        ...prev,
        [activeTimerTaskId]: {
          ...existing,
          workTimeSpentMinutes: (existing.workTimeSpentMinutes || 0) + minutesStudied,
          lastWorkedAt: new Date().toISOString(),
        },
      };
    });

    setIsTimerRunning(false);
    setActiveTimerTaskId(null);
    setTimerSeconds(0);
    addToast(`Great focus! Logged ${minutesStudied} minutes of study time.`, 'success');
  };

  // Announcements
  const createAnnouncement = (
    title: string,
    content: string,
    targetClass: string,
    isUrgent: boolean,
    relatedTaskId?: string
  ) => {
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      targetClass,
      targetSemester: 'Semester 5',
      authorName: currentUser.fullName,
      authorRole: currentUser.role === 'teacher' ? (currentUser.teacherTitle || 'Professor') : 'Student Representative',
      createdAt: new Date().toISOString(),
      isUrgent,
      relatedTaskId,
    };

    setAnnouncements((prev) => [newAnn, ...prev]);

    // Send notification
    const annNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: 'student-1',
      title: isUrgent ? 'URGENT ANNOUNCEMENT' : 'NEW CLASS ANNOUNCEMENT',
      message: `${newAnn.title}: ${newAnn.content.slice(0, 100)}...`,
      type: 'announcement',
      timestamp: new Date().toISOString(),
      isRead: false,
      taskId: relatedTaskId,
    };

    setNotifications((prev) => [annNotif, ...prev]);
    addToast(`Announcement broadcast to class ${targetClass}.`, 'success');
  };

  // Notification management
  const markNotificationAsRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToast('All notifications marked as read.', 'info');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    addToast('Notification history cleared.', 'info');
  };

  // Profile management (Clean Initials-based identity with real photo support)
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setCurrentUserState((prev) => {
      const nextFullName = updates.fullName !== undefined ? updates.fullName : prev.fullName;
      const computedInitials = getInitials(nextFullName);
      const updatedUser: UserProfile = {
        ...prev,
        ...updates,
        fullName: nextFullName,
        initials: computedInitials,
      };

      setAllUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === prev.id ? updatedUser : u))
      );

      return updatedUser;
    });
    addToast('Profile information saved.', 'success');
  };

  // Demo reset
  const resetToDemoData = () => {
    setTasks(initialTasks);
    setStudentProgressMap(initialStudentProgress);
    setAnnouncements(initialAnnouncements);
    setNotifications(initialNotifications);
    setAllUsers([...initialStudents, initialTeacher]);
    setCurrentUserState(initialStudents[0]);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ALL_USERS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    addToast('Application reset to initial demo dataset.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        role: currentUser.role,
        switchRole,
        setCurrentUser: setCurrentUserState,
        tasks,
        enrichedTasks,
        studentProgressMap,
        announcements,
        notifications,
        unreadNotifCount,
        syncStatus,
        toggleSyncStatus,
        theme,
        setTheme: setThemeState,
        activeScreen,
        setActiveScreen,
        createTask,
        updateTask,
        deleteTask,
        changeDeadline,
        updateStudentProgress,
        activeTimerTaskId,
        timerSeconds,
        isTimerRunning,
        startStudyTimer,
        pauseStudyTimer,
        resumeStudyTimer,
        stopAndLogStudyTimer,
        createAnnouncement,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        addToast,
        updateUserProfile,
        resetToDemoData,
        selectedTaskId,
        setSelectedTaskId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
