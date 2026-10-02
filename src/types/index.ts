export type TaskCategory =
  | 'Assignment'
  | 'Module Test'
  | 'Lab Exam'
  | 'Lab Record Submission'
  | 'Notebook Submission'
  | 'Internal Exam'
  | 'University Exam'
  | 'Project'
  | 'Seminar'
  | 'Presentation'
  | 'Viva'
  | 'Other Academic Activity';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Very Hard';

export type UserRole = 'student' | 'teacher';

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
}

export interface DeadlineHistoryItem {
  id: string;
  previousDeadline: string; // ISO date string
  newDeadline: string; // ISO date string
  reason: string;
  changedBy: string;
  timestamp: string; // ISO date string
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  category: TaskCategory;
  description: string;
  targetClass: string;
  targetSemester: string;
  difficulty: DifficultyLevel;
  importance: number; // 1 to 5
  estimatedHours: number;
  deadlineDate: string; // YYYY-MM-DD
  deadlineTime: string; // HH:mm
  createdByTeacherId: string;
  createdByName: string;
  createdAt: string;
  attachments: Attachment[];
  deadlineHistory: DeadlineHistoryItem[];
  reminderSettings: {
    twoDaysBefore: boolean;
    oneDayBefore: boolean;
    sameDay: boolean;
    finalAlert: boolean;
  };
}

export interface StudentProgress {
  taskId: string;
  studentId: string;
  progressPercentage: number; // 0 to 100
  estimatedRemainingHours: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  workTimeSpentMinutes: number;
  lastWorkedAt?: string;
  completedAt?: string;
  studentSubmissionNotes?: string;
  submissionAttachment?: Attachment;
}

export interface CalculatedPriority {
  level: PriorityLevel;
  score: number; // 0 to 100
  reason: string;
  hoursRemaining: number;
  isOverdue: boolean;
}

export interface EnrichedTask extends Task {
  studentProgress: StudentProgress;
  calculatedPriority: CalculatedPriority;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  initials: string;
  photoUrl?: string;
  classDept: string;
  semester: string;
  department: string;
  studentIdNum?: string;
  teacherTitle?: string;
}

export function getInitials(name: string): string {
  if (!name) return 'AQ';
  const parts = name.replace(/^Dr\.\s*/i, '').trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetClass: string;
  targetSemester: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
  isUrgent: boolean;
  relatedTaskId?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'deadline_reminder' | 'deadline_changed' | 'new_assignment' | 'announcement' | 'final_alert';
  timestamp: string;
  isRead: boolean;
  taskId?: string;
}

export interface StudyPlanSlot {
  id: string;
  timeSlot: string; // e.g. "4:00 PM - 5:30 PM"
  title: string;
  category: 'task' | 'break' | 'review';
  taskId?: string;
  durationMinutes: number;
  isCompleted: boolean;
}

export type SyncStatus = 'online' | 'offline' | 'syncing';
