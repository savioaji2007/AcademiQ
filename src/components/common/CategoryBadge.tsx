import React from 'react';
import { TaskCategory } from '../../types';
import {
  FileText,
  FileCheck,
  FlaskConical,
  BookOpen,
  ClipboardList,
  GraduationCap,
  FolderGit2,
  Users,
  Presentation as PresentationIcon,
  Mic,
  Award,
  Layers,
} from 'lucide-react';

interface CategoryBadgeProps {
  category: TaskCategory;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'md' }) => {
  let color = 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  let Icon = Layers;

  switch (category) {
    case 'Assignment':
      color = 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      Icon = FileText;
      break;
    case 'Module Test':
      color = 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      Icon = ClipboardList;
      break;
    case 'Lab Exam':
      color = 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      Icon = FlaskConical;
      break;
    case 'Lab Record Submission':
      color = 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200 dark:border-teal-800';
      Icon = FileCheck;
      break;
    case 'Notebook Submission':
      color = 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      Icon = BookOpen;
      break;
    case 'Internal Exam':
      color = 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      Icon = Award;
      break;
    case 'University Exam':
      color = 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-800';
      Icon = GraduationCap;
      break;
    case 'Project':
      color = 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      Icon = FolderGit2;
      break;
    case 'Seminar':
      color = 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
      Icon = Users;
      break;
    case 'Presentation':
      color = 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 border-violet-200 dark:border-violet-800';
      Icon = PresentationIcon;
      break;
    case 'Viva':
      color = 'bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950/50 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-800';
      Icon = Mic;
      break;
    case 'Other Academic Activity':
    default:
      color = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
      Icon = Layers;
      break;
  }

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${sizeClass} ${color}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{category}</span>
    </span>
  );
};
