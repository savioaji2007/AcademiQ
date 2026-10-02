import { Task, StudentProgress, CalculatedPriority, PriorityLevel, EnrichedTask } from '../types';

/**
 * Deterministic Rule-Based Academic Priority Algorithm for ACADEMIQ
 * Factors in:
 * 1. Proximity to deadline (hours remaining)
 * 2. Teacher assigned importance (1-5)
 * 3. Difficulty multiplier (Easy: 1.0, Medium: 1.25, Hard: 1.5, Very Hard: 1.8)
 * 4. Remaining work duration (hours)
 * 5. Completion percentage (0-100%)
 */
export function calculateTaskPriority(task: Task, progress: StudentProgress): CalculatedPriority {
  // If task is completed
  if (progress.progressPercentage >= 100 || progress.status === 'completed') {
    return {
      level: 'LOW',
      score: 5,
      reason: 'Task is marked as completed.',
      hoursRemaining: 999,
      isOverdue: false,
    };
  }

  const deadlineTimestamp = new Date(`${task.deadlineDate}T${task.deadlineTime}:00`).getTime();
  const now = Date.now();
  const diffMs = deadlineTimestamp - now;
  const hoursRemaining = diffMs / (1000 * 60 * 60);

  const isOverdue = hoursRemaining < 0;

  // 1. Proximity score (0 to 45 pts)
  let proximityScore = 0;
  if (isOverdue) {
    proximityScore = 45; // Overdue tasks get highest proximity urgency
  } else if (hoursRemaining <= 12) {
    proximityScore = 45;
  } else if (hoursRemaining <= 24) {
    proximityScore = 40;
  } else if (hoursRemaining <= 48) {
    proximityScore = 32;
  } else if (hoursRemaining <= 72) {
    proximityScore = 24;
  } else if (hoursRemaining <= 120) {
    proximityScore = 15;
  } else {
    proximityScore = Math.max(5, Math.round(15 - (hoursRemaining - 120) / 24));
  }

  // 2. Importance score (0 to 25 pts)
  // task.importance is 1-5
  const importanceScore = (task.importance / 5) * 25;

  // 3. Difficulty & Workload score (0 to 20 pts)
  const difficultyMultiplier: Record<string, number> = {
    Easy: 1.0,
    Medium: 1.2,
    Hard: 1.5,
    'Very Hard': 1.8,
  };
  const diffMult = difficultyMultiplier[task.difficulty] || 1.2;
  const remainingWork = progress.estimatedRemainingHours > 0 
    ? progress.estimatedRemainingHours 
    : Math.max(0.5, task.estimatedHours * (1 - progress.progressPercentage / 100));

  // If remaining work is large relative to time left, elevate score
  const workloadRatio = hoursRemaining > 0 ? (remainingWork / Math.max(1, hoursRemaining)) : 1.0;
  const workloadScore = Math.min(20, (remainingWork * 3 * diffMult) + (workloadRatio > 0.5 ? 6 : 0));

  // 4. Incompletion penalty (0 to 10 pts)
  const incompleteScore = ((100 - progress.progressPercentage) / 100) * 10;

  // Total raw score
  let totalScore = Math.round(proximityScore + importanceScore + workloadScore + incompleteScore);
  totalScore = Math.min(100, Math.max(0, totalScore));

  // Determine Level and Reason
  let level: PriorityLevel = 'LOW';
  let reason = '';

  if (isOverdue) {
    level = 'CRITICAL';
    reason = `Overdue by ${Math.abs(Math.round(hoursRemaining))} hours. Urgent submission needed!`;
  } else if (totalScore >= 80 || (hoursRemaining <= 24 && remainingWork >= 2)) {
    level = 'CRITICAL';
    if (hoursRemaining <= 24) {
      reason = `Deadline is within ${Math.max(1, Math.round(hoursRemaining))} hours with ${remainingWork.toFixed(1)} hrs of work remaining.`;
    } else {
      reason = `High teacher importance (rating ${task.importance}/5) and heavy remaining workload.`;
    }
  } else if (totalScore >= 60 || hoursRemaining <= 48) {
    level = 'HIGH';
    if (hoursRemaining <= 48) {
      reason = `Deadline approaching in ${Math.round(hoursRemaining / 24)} day(s) (${Math.round(hoursRemaining)} hrs remaining).`;
    } else {
      reason = `Substantial effort required (${remainingWork.toFixed(1)} hrs) with high academic weight.`;
    }
  } else if (totalScore >= 35 || hoursRemaining <= 120) {
    level = 'MEDIUM';
    reason = `Moderate timeline (${Math.round(hoursRemaining / 24)} days left) with steady progress recommended.`;
  } else {
    level = 'LOW';
    reason = `Sufficient time remaining (${Math.round(hoursRemaining / 24)} days) with manageable workload.`;
  }

  return {
    level,
    score: totalScore,
    reason,
    hoursRemaining: Math.round(hoursRemaining * 10) / 10,
    isOverdue,
  };
}

/**
 * Calculates "WHAT SHOULD I DO NOW?" recommendation
 * Picks the single most urgent, actionable uncompleted task
 */
export function getWhatShouldIDoNowRecommendation(tasks: EnrichedTask[]): {
  task: EnrichedTask | null;
  headline: string;
  reason: string;
  actionRecommendation: string;
  urgencyLevel: PriorityLevel;
} {
  const unfinishedTasks = tasks.filter(
    (t) => t.studentProgress.progressPercentage < 100 && t.studentProgress.status !== 'completed'
  );

  if (unfinishedTasks.length === 0) {
    return {
      task: null,
      headline: 'All Caught Up! 🎉',
      reason: 'You have no pending deadlines or uncompleted assignments right now.',
      actionRecommendation: 'Review upcoming topics or take a well-deserved study break.',
      urgencyLevel: 'LOW',
    };
  }

  // Sort by priority score descending, then by hours remaining ascending
  const sorted = [...unfinishedTasks].sort((a, b) => {
    if (b.calculatedPriority.score !== a.calculatedPriority.score) {
      return b.calculatedPriority.score - a.calculatedPriority.score;
    }
    return a.calculatedPriority.hoursRemaining - b.calculatedPriority.hoursRemaining;
  });

  const topTask = sorted[0];
  const { hoursRemaining, isOverdue } = topTask.calculatedPriority;
  const remWork = topTask.studentProgress.estimatedRemainingHours || 
    Math.max(1, topTask.estimatedHours * (1 - topTask.studentProgress.progressPercentage / 100));

  let headline = `Priority Focus: ${topTask.title}`;
  let reason = topTask.calculatedPriority.reason;
  let actionRecommendation = `Dedicate a 60-90 min session to bring progress to ${Math.min(100, topTask.studentProgress.progressPercentage + 40)}%.`;

  if (isOverdue) {
    headline = `Immediate Action Required: ${topTask.title}`;
    actionRecommendation = `Task is overdue. Complete final submission immediately to avoid grading penalties.`;
  } else if (hoursRemaining <= 24) {
    headline = `Due Tomorrow: ${topTask.title}`;
    actionRecommendation = `Estimated ${remWork.toFixed(1)} hours needed. Start right now to finish before deadline.`;
  }

  return {
    task: topTask,
    headline,
    reason,
    actionRecommendation,
    urgencyLevel: topTask.calculatedPriority.level,
  };
}
