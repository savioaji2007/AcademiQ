import { EnrichedTask, PriorityLevel } from '../types';
import { calculateTaskPriority } from './priorityAlgorithm';

export interface PostponeSimulationResult {
  taskId: string;
  taskTitle: string;
  originalDeadline: string;
  simulatedDeadline: string;
  daysPostponed: number;
  originalPriority: PriorityLevel;
  simulatedPriority: PriorityLevel;
  originalScore: number;
  simulatedScore: number;
  hasConflictWithOtherDeadlines: boolean;
  conflictingTasks: { title: string; deadlineDate: string }[];
  projectedStressLevel: 'Low' | 'Moderate' | 'Severe' | 'Critical';
  summaryAdvice: string;
}

export function simulateDeadlinePostponement(
  task: EnrichedTask,
  allTasks: EnrichedTask[],
  daysToAdd: number
): PostponeSimulationResult {
  const originalDate = new Date(`${task.deadlineDate}T${task.deadlineTime}:00`);
  const simulatedDate = new Date(originalDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

  const yyyy = simulatedDate.getFullYear();
  const mm = String(simulatedDate.getMonth() + 1).padStart(2, '0');
  const dd = String(simulatedDate.getDate()).padStart(2, '0');
  const simulatedDeadlineDate = `${yyyy}-${mm}-${dd}`;

  // Clone task with simulated deadline
  const simulatedTask = {
    ...task,
    deadlineDate: simulatedDeadlineDate,
  };

  const simulatedPriorityResult = calculateTaskPriority(simulatedTask, task.studentProgress);

  // Check conflicts: any other tasks due on simulated deadline day or +/- 1 day
  const conflicting = allTasks.filter((t) => {
    if (t.id === task.id) return false;
    const tDate = new Date(`${t.deadlineDate}T${t.deadlineTime}:00`).getTime();
    const simTime = simulatedDate.getTime();
    const diffHours = Math.abs(tDate - simTime) / (1000 * 60 * 60);
    return diffHours <= 24;
  });

  let stressLevel: 'Low' | 'Moderate' | 'Severe' | 'Critical' = 'Moderate';
  let advice = '';

  if (conflicting.length >= 2) {
    stressLevel = 'Critical';
    advice = `Warning: Postponing to this date causes a collision with ${conflicting.length} other academic deadlines. Extreme workload cluster predicted.`;
  } else if (conflicting.length === 1) {
    stressLevel = 'Severe';
    advice = `Caution: Clashes directly with "${conflicting[0].title}". You will have two concurrent submissions.`;
  } else if (daysToAdd > 0) {
    stressLevel = 'Low';
    advice = `Postponing by ${daysToAdd} day(s) reduces urgency, lowering priority score from ${task.calculatedPriority.score} to ${simulatedPriorityResult.score}.`;
  } else {
    stressLevel = 'Moderate';
    advice = `Advancing the target date requires immediate prioritization.`;
  }

  return {
    taskId: task.id,
    taskTitle: task.title,
    originalDeadline: `${task.deadlineDate} ${task.deadlineTime}`,
    simulatedDeadline: `${simulatedDeadlineDate} ${task.deadlineTime}`,
    daysPostponed: daysToAdd,
    originalPriority: task.calculatedPriority.level,
    simulatedPriority: simulatedPriorityResult.level,
    originalScore: task.calculatedPriority.score,
    simulatedScore: simulatedPriorityResult.score,
    hasConflictWithOtherDeadlines: conflicting.length > 0,
    conflictingTasks: conflicting.map((c) => ({ title: c.title, deadlineDate: c.deadlineDate })),
    projectedStressLevel: stressLevel,
    summaryAdvice: advice,
  };
}
