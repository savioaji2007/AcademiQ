package com.academiq.app.models;

public class StudentProgress {
    private String taskId;
    private String studentId;
    private int progressPercentage;
    private double estimatedRemainingHours;
    private String status;
    private int workTimeSpentMinutes;
    private String lastWorkedAt;
    private String completedAt;
    private String studentSubmissionNotes;

    public StudentProgress() {}

    public String getTaskId() { return taskId; }
    public void setTaskId(String taskId) { this.taskId = taskId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public int getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(int progressPercentage) { this.progressPercentage = progressPercentage; }

    public double getEstimatedRemainingHours() { return estimatedRemainingHours; }
    public void setEstimatedRemainingHours(double estimatedRemainingHours) { this.estimatedRemainingHours = estimatedRemainingHours; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getWorkTimeSpentMinutes() { return workTimeSpentMinutes; }
    public void setWorkTimeSpentMinutes(int workTimeSpentMinutes) { this.workTimeSpentMinutes = workTimeSpentMinutes; }

    public String getLastWorkedAt() { return lastWorkedAt; }
    public void setLastWorkedAt(String lastWorkedAt) { this.lastWorkedAt = lastWorkedAt; }

    public String getCompletedAt() { return completedAt; }
    public void setCompletedAt(String completedAt) { this.completedAt = completedAt; }

    public String getStudentSubmissionNotes() { return studentSubmissionNotes; }
    public void setStudentSubmissionNotes(String studentSubmissionNotes) { this.studentSubmissionNotes = studentSubmissionNotes; }
}
