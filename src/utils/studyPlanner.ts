import { EnrichedTask, StudyPlanSlot } from '../types';

export interface StudyPlannerOptions {
  availableHours: number; // e.g. 3.5
  breakMinutes: number; // e.g. 15
  startHour: number; // 24-hr format, e.g. 16 for 4:00 PM
  startMinute: number; // e.g. 0
}

function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const displayMinute = minute < 10 ? `0${minute}` : `${minute}`;
  return `${displayHour}:${displayMinute} ${period}`;
}

export function generateDailyStudyPlan(
  tasks: EnrichedTask[],
  options: StudyPlannerOptions
): StudyPlanSlot[] {
  const unfinishedTasks = tasks
    .filter((t) => t.studentProgress.progressPercentage < 100 && t.studentProgress.status !== 'completed')
    .sort((a, b) => b.calculatedPriority.score - a.calculatedPriority.score);

  if (unfinishedTasks.length === 0) {
    return [
      {
        id: 'slot-free',
        timeSlot: `${formatTime(options.startHour, options.startMinute)} - ${formatTime(options.startHour + 1, options.startMinute)}`,
        title: 'Open Self-Study / Rest Period',
        category: 'break',
        durationMinutes: 60,
        isCompleted: false,
      },
    ];
  }

  const slots: StudyPlanSlot[] = [];
  let currentHour = options.startHour;
  let currentMinute = options.startMinute;
  let remainingBudgetMinutes = Math.round(options.availableHours * 60);

  let taskIndex = 0;

  while (remainingBudgetMinutes > 25 && taskIndex < unfinishedTasks.length) {
    const task = unfinishedTasks[taskIndex];
    // Allocate 45 to 90 min chunk depending on remaining work & priority
    const remainingTaskHours = task.studentProgress.estimatedRemainingHours || 2;
    const taskNeededMinutes = Math.round(remainingTaskHours * 60);

    // Chunks between 45m and 75m
    let chunkMinutes = Math.min(taskNeededMinutes, 75);
    if (task.calculatedPriority.level === 'CRITICAL') {
      chunkMinutes = Math.min(chunkMinutes, 90);
    }
    chunkMinutes = Math.min(chunkMinutes, remainingBudgetMinutes);
    if (chunkMinutes < 25) {
      chunkMinutes = remainingBudgetMinutes;
    }

    const startStr = formatTime(currentHour, currentMinute);
    
    // Add chunkMinutes to time
    let endMinuteTotal = currentMinute + chunkMinutes;
    let endHour = currentHour + Math.floor(endMinuteTotal / 60);
    let endMinute = endMinuteTotal % 60;
    const endStr = formatTime(endHour, endMinute);

    slots.push({
      id: `slot-${task.id}-${slots.length}`,
      timeSlot: `${startStr} - ${endStr}`,
      title: `${task.subject}: ${task.title}`,
      category: 'task',
      taskId: task.id,
      durationMinutes: chunkMinutes,
      isCompleted: false,
    });

    remainingBudgetMinutes -= chunkMinutes;
    currentHour = endHour;
    currentMinute = endMinute;

    // Add break if budget remains
    if (remainingBudgetMinutes >= 30 && options.breakMinutes > 0) {
      const breakStart = formatTime(currentHour, currentMinute);
      let breakEndTotal = currentMinute + options.breakMinutes;
      let breakEndHour = currentHour + Math.floor(breakEndTotal / 60);
      let breakEndMinute = breakEndTotal % 60;
      const breakEndStr = formatTime(breakEndHour, breakEndMinute);

      slots.push({
        id: `break-${slots.length}`,
        timeSlot: `${breakStart} - ${breakEndStr}`,
        title: 'Hydration & Cognitive Break',
        category: 'break',
        durationMinutes: options.breakMinutes,
        isCompleted: false,
      });

      remainingBudgetMinutes -= options.breakMinutes;
      currentHour = breakEndHour;
      currentMinute = breakEndMinute;
    }

    taskIndex = (taskIndex + 1) % unfinishedTasks.length;
    // Prevent infinite loop if only 1 task
    if (unfinishedTasks.length === 1 && remainingBudgetMinutes <= 30) {
      break;
    }
  }

  return slots;
}
