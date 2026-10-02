package com.academiq.app.models;

public class PriorityResult {
    private String level; // CRITICAL, HIGH, MEDIUM, LOW
    private int score; // 0 to 100
    private String reason;
    private double hoursRemaining;
    private boolean isOverdue;

    public PriorityResult(String level, int score, String reason, double hoursRemaining, boolean isOverdue) {
        this.level = level;
        this.score = score;
        this.reason = reason;
        this.hoursRemaining = hoursRemaining;
        this.isOverdue = isOverdue;
    }

    public String getLevel() { return level; }
    public int getScore() { return score; }
    public String getReason() { return reason; }
    public double getHoursRemaining() { return hoursRemaining; }
    public boolean isOverdue() { return isOverdue; }
}
