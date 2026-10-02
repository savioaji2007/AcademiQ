import React from 'react';
import { PriorityLevel } from '../../types';
import { Flame, AlertTriangle, Clock, ShieldCheck } from 'lucide-react';

interface PriorityBadgeProps {
  level: PriorityLevel;
  score?: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  level,
  score,
  showScore = false,
  size = 'md',
}) => {
  let bgClasses = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300';
  let icon = <Clock className="w-3.5 h-3.5" />;
  let label = 'Low Priority';

  switch (level) {
    case 'CRITICAL':
      bgClasses = 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800 animate-pulse';
      icon = <Flame className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
      label = 'Critical';
      break;
    case 'HIGH':
      bgClasses = 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
      icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      label = 'High Priority';
      break;
    case 'MEDIUM':
      bgClasses = 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
      icon = <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      label = 'Medium Priority';
      break;
    case 'LOW':
      bgClasses = 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
      icon = <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      label = 'Low Priority';
      break;
  }

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs'
      : size === 'lg'
      ? 'px-3 py-1.5 text-sm font-semibold'
      : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClasses} ${bgClasses}`}
    >
      {icon}
      <span>{label}</span>
      {showScore && score !== undefined && (
        <span className="opacity-75 text-[11px] font-mono">({score})</span>
      )}
    </span>
  );
};
