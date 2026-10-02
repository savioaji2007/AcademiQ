package com.academiq.app.models;

import java.util.List;

public class Task {
    private String id;
    private String title;
    private String subject;
    private String category;
    private String description;
    private String targetClass;
    private String targetSemester;
    private String difficulty;
    private int importance;
    private double estimatedHours;
    private String deadlineDate;
    private String deadlineTime;
    private String createdByTeacherId;
    private String createdByName;
    private String createdAt;

    public Task() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTargetClass() { return targetClass; }
    public void setTargetClass(String targetClass) { this.targetClass = targetClass; }

    public String getTargetSemester() { return targetSemester; }
    public void setTargetSemester(String targetSemester) { this.targetSemester = targetSemester; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public int getImportance() { return importance; }
    public void setImportance(int importance) { this.importance = importance; }

    public double getEstimatedHours() { return estimatedHours; }
    public void setEstimatedHours(double estimatedHours) { this.estimatedHours = estimatedHours; }

    public String getDeadlineDate() { return deadlineDate; }
    public void setDeadlineDate(String deadlineDate) { this.deadlineDate = deadlineDate; }

    public String getDeadlineTime() { return deadlineTime; }
    public void setDeadlineTime(String deadlineTime) { this.deadlineTime = deadlineTime; }

    public String getCreatedByTeacherId() { return createdByTeacherId; }
    public void setCreatedByTeacherId(String createdByTeacherId) { this.createdByTeacherId = createdByTeacherId; }

    public String getCreatedByName() { return createdByName; }
    public void setCreatedByName(String createdByName) { this.createdByName = createdByName; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
