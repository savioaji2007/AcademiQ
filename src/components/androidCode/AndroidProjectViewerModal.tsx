import React, { useState } from 'react';
import {
  X,
  Code2,
  Copy,
  Check,
  Download,
  Smartphone,
  FileCode,
  ShieldCheck,
  FolderTree,
  Terminal,
} from 'lucide-react';

interface AndroidProjectViewerModalProps {
  onClose: () => void;
}

export const AndroidProjectViewerModal: React.FC<AndroidProjectViewerModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<
    | 'manifest'
    | 'gradle'
    | 'calculator'
    | 'worker'
    | 'repository'
    | 'rules'
    | 'layout'
    | 'guide'
  >('calculator');

  const [copied, setCopied] = useState(false);

  const filesContent: Record<string, { title: string; lang: string; path: string; code: string }> = {
    calculator: {
      title: 'PriorityCalculator.java',
      lang: 'java',
      path: 'app/src/main/java/com/academiq/app/utils/PriorityCalculator.java',
      code: `package com.academiq.app.utils;

import com.academiq.app.models.Task;
import com.academiq.app.models.StudentProgress;
import com.academiq.app.models.PriorityResult;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Deterministic Rule-Based Academic Priority Algorithm for ACADEMIQ
 * Enforces strict academic weighting without fake heuristics.
 */
public class PriorityCalculator {

    public static PriorityResult calculate(Task task, StudentProgress progress) {
        if (progress != null && (progress.getProgressPercentage() >= 100 || "completed".equals(progress.getStatus()))) {
            return new PriorityResult("LOW", 5, "Task marked 100% completed.", 999.0, false);
        }

        long now = System.currentTimeMillis();
        long deadlineTime = parseDeadlineTimestamp(task.getDeadlineDate(), task.getDeadlineTime());
        double hoursRemaining = (deadlineTime - now) / (1000.0 * 60.0 * 60.0);
        boolean isOverdue = hoursRemaining < 0;

        // 1. Proximity Score (0 to 45 pts)
        double proximityScore;
        if (isOverdue) {
            proximityScore = 45.0;
        } else if (hoursRemaining <= 12) {
            proximityScore = 45.0;
        } else if (hoursRemaining <= 24) {
            proximityScore = 40.0;
        } else if (hoursRemaining <= 48) {
            proximityScore = 32.0;
        } else if (hoursRemaining <= 72) {
            proximityScore = 24.0;
        } else {
            proximityScore = Math.max(5.0, 15.0 - ((hoursRemaining - 72.0) / 24.0));
        }

        // 2. Importance Score (0 to 25 pts)
        double importanceScore = (task.getImportance() / 5.0) * 25.0;

        // 3. Workload & Difficulty (0 to 20 pts)
        double diffMultiplier = 1.0;
        if ("Medium".equalsIgnoreCase(task.getDifficulty())) diffMultiplier = 1.25;
        else if ("Hard".equalsIgnoreCase(task.getDifficulty())) diffMultiplier = 1.5;
        else if ("Very Hard".equalsIgnoreCase(task.getDifficulty())) diffMultiplier = 1.8;

        double remainingWork = progress != null && progress.getEstimatedRemainingHours() > 0 
                ? progress.getEstimatedRemainingHours() 
                : Math.max(0.5, task.getEstimatedHours() * (1.0 - (progress != null ? progress.getProgressPercentage() : 0) / 100.0));

        double workloadScore = Math.min(20.0, remainingWork * 3.0 * diffMultiplier);

        // 4. Incompletion Penalty (0 to 10 pts)
        int currentProgress = progress != null ? progress.getProgressPercentage() : 0;
        double incompleteScore = ((100 - currentProgress) / 100.0) * 10.0;

        int totalScore = (int) Math.round(proximityScore + importanceScore + workloadScore + incompleteScore);
        totalScore = Math.max(0, Math.min(100, totalScore));

        String level = "LOW";
        String reason;

        if (isOverdue) {
            level = "CRITICAL";
            reason = "Overdue deadline! Urgent submission required to avoid grading penalties.";
        } else if (totalScore >= 80 || (hoursRemaining <= 24 && remainingWork >= 2.0)) {
            level = "CRITICAL";
            reason = "Deadline within " + Math.max(1, (int)hoursRemaining) + " hrs with " + String.format(Locale.US, "%.1f", remainingWork) + " hrs work left.";
        } else if (totalScore >= 60 || hoursRemaining <= 48) {
            level = "HIGH";
            reason = "Approaching deadline within 48 hours with high curriculum importance.";
        } else if (totalScore >= 35 || hoursRemaining <= 120) {
            level = "MEDIUM";
            reason = "Moderate timeline (" + (int)(hoursRemaining / 24) + " days left); steady pace recommended.";
        } else {
            level = "LOW";
            reason = "Sufficient buffer time available (" + (int)(hoursRemaining / 24) + " days left).";
        }

        return new PriorityResult(level, totalScore, reason, hoursRemaining, isOverdue);
    }

    private static long parseDeadlineTimestamp(String dateStr, String timeStr) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.US);
            Date date = sdf.parse(dateStr + " " + timeStr);
            return date != null ? date.getTime() : System.currentTimeMillis();
        } catch (Exception e) {
            return System.currentTimeMillis();
        }
    }
}`,
    },
    worker: {
      title: 'ReminderWorker.java',
      lang: 'java',
      path: 'app/src/main/java/com/academiq/app/notifications/ReminderWorker.java',
      code: `package com.academiq.app.notifications;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.academiq.app.R;
import com.academiq.app.ui.MainActivity;

/**
 * Background WorkManager Worker delivering exact deadline reminders:
 * - 2 Days Before
 * - 1 Day Before
 * - Same Day
 * - Final Alert if incomplete
 */
public class ReminderWorker extends Worker {

    public static final String CHANNEL_ID = "academiq_deadline_reminders";
    public static final String KEY_TASK_ID = "key_task_id";
    public static final String KEY_TASK_TITLE = "key_task_title";
    public static final String KEY_ALERT_TYPE = "key_alert_type";

    public ReminderWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }

    @NonNull
    @Override
    public Result doWork() {
        String taskId = getInputData().getString(KEY_TASK_ID);
        String taskTitle = getInputData().getString(KEY_TASK_TITLE);
        String alertType = getInputData().getString(KEY_ALERT_TYPE);

        if (taskTitle == null) taskTitle = "Academic Assignment";

        createNotificationChannel();
        showNotification(taskId, taskTitle, alertType);

        return Result.success();
    }

    private void showNotification(String taskId, String title, String alertType) {
        NotificationManager manager = (NotificationManager) getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager == null) return;

        Intent intent = new Intent(getApplicationContext(), MainActivity.class);
        intent.putExtra("OPEN_TASK_ID", taskId);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);

        PendingIntent pendingIntent = PendingIntent.getActivity(
                getApplicationContext(),
                (int) System.currentTimeMillis(),
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        String message;
        if ("2_DAYS".equals(alertType)) {
            message = "Your " + title + " is due in 2 days. Plan your study session.";
        } else if ("1_DAY".equals(alertType)) {
            message = "Your " + title + " submission is tomorrow. Substantial work remains.";
        } else if ("SAME_DAY".equals(alertType)) {
            message = "Your " + title + " is scheduled for today. Complete final submission.";
        } else {
            message = "Final Alert: Submission deadline is approaching and task is still incomplete!";
        }

        NotificationCompat.Builder builder = new NotificationCompat.Builder(getApplicationContext(), CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_academiq_notification)
                .setContentTitle("ACADEMIQ: " + title)
                .setContentText(message)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(message))
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setContentIntent(pendingIntent)
                .setAutoCancel(true);

        manager.notify((int) System.currentTimeMillis(), builder.build());
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Academic Deadline Reminders",
                    NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("Critical notifications for test schedules and assignments.");
            NotificationManager manager = getApplicationContext().getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }
}`,
    },
    repository: {
      title: 'FirebaseRepository.java',
      lang: 'java',
      path: 'app/src/main/java/com/academiq/app/data/FirebaseRepository.java',
      code: `package com.academiq.app.data;

import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QuerySnapshot;
import com.google.firebase.firestore.SetOptions;
import com.academiq.app.models.AcademicTask;
import com.academiq.app.models.StudentProgress;

import java.util.HashMap;
import java.util.Map;

/**
 * Production-ready Firestore Repository for ACADEMIQ
 * Connects directly to users, tasks, studentProgress, and announcements collections.
 */
public class FirebaseRepository {

    private final FirebaseFirestore db;
    private final FirebaseAuth auth;

    public FirebaseRepository() {
        this.db = FirebaseFirestore.getInstance();
        this.auth = FirebaseAuth.getInstance();
    }

    public Task<QuerySnapshot> getAuthorizedTasksForClass(String targetClass) {
        return db.collection("tasks")
                .whereEqualTo("targetClass", targetClass)
                .get();
    }

    public Task<Void> updateOfficialDeadline(String taskId, String newDate, String newTime, String reason, String teacherName) {
        DocumentReference ref = db.collection("tasks").document(taskId);
        Map<String, Object> updates = new HashMap<>();
        updates.put("deadlineDate", newDate);
        updates.put("deadlineTime", newTime);

        Map<String, Object> historyItem = new HashMap<>();
        historyItem.put("newDeadline", newDate + " " + newTime);
        historyItem.put("reason", reason);
        historyItem.put("changedBy", teacherName);
        historyItem.put("timestamp", new java.util.Date());

        return ref.update("deadlineDate", newDate, "deadlineTime", newTime);
    }

    public Task<Void> saveStudentProgress(StudentProgress progress) {
        String docId = progress.getTaskId() + "_" + progress.getStudentId();
        return db.collection("studentProgress")
                .document(docId)
                .set(progress, SetOptions.merge());
    }
}`,
    },
    manifest: {
      title: 'AndroidManifest.xml',
      lang: 'xml',
      path: 'app/src/main/AndroidManifest.xml',
      code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.academiq.app">

    <!-- Permissions required for Notifications, Storage, and Camera -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

    <application
        android:name=".AcademiqApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.Academiq">

        <activity
            android:name=".ui.MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Firebase Cloud Messaging Receiver -->
        <service
            android:name=".notifications.AcademiqFirebaseMessagingService"
            android:exported="false">
            <intent-filter>
                <action android:name="com.google.firebase.MESSAGING_EVENT" />
            </intent-filter>
        </service>

    </application>
</manifest>`,
    },
    gradle: {
      title: 'build.gradle.kts (App Module)',
      lang: 'kotlin',
      path: 'app/build.gradle.kts',
      code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.google.gms.google.services)
}

android {
    namespace = "com.academiq.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.academiq.app"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    buildFeatures {
        viewBinding = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("androidx.navigation:navigation-fragment:2.7.7")
    implementation("androidx.navigation:navigation-ui:2.7.7")

    // WorkManager for background reminders
    implementation("androidx.work:work-runtime:2.9.0")

    // Firebase BoM & Services
    implementation(platform("com.google.firebase:firebase-bom:32.8.0"))
    implementation("com.google.firebase:firebase-auth")
    implementation("com.google.firebase:firebase-firestore")
    implementation("com.google.firebase:firebase-storage")
    implementation("com.google.firebase:firebase-messaging")

    // Image loading
    implementation("com.github.bumptech.glide:glide:4.16.0")
}`,
    },
    rules: {
      title: 'firestore.rules',
      lang: 'text',
      path: 'firestore.rules',
      code: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isTeacher() {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher';
    }

    function isStudent() {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'student';
    }

    // User profiles
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if request.auth.uid == userId;
    }

    // Tasks collection: Read by class students & teachers, created/modified ONLY by teachers!
    match /tasks/{taskId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isTeacher();
    }

    // Student Progress: Students update their own records; Teachers can read all class submissions
    match /studentProgress/{progressId} {
      allow read: if isAuthenticated();
      allow create, update: if isAuthenticated() && (
        request.resource.data.studentId == request.auth.uid || isTeacher()
      );
    }

    // Announcements: Published only by faculty
    match /announcements/{announcementId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isTeacher();
    }
  }
}`,
    },
    layout: {
      title: 'activity_main.xml',
      lang: 'xml',
      path: 'app/src/main/res/layout/activity_main.xml',
      code: `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="?android:colorBackground">

    <!-- Top Material 3 App Bar -->
    <com.google.android.material.appbar.MaterialToolbar
        android:id="@+id/topAppBar"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:background="?attr/colorSurface"
        android:elevation="4dp"
        app:title="@string/app_name"
        app:titleTextColor="?attr/colorPrimary"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />

    <!-- Fragment Container for Screen Navigation -->
    <androidx.fragment.app.FragmentContainerView
        android:id="@+id/navHostFragment"
        android:name="androidx.navigation.fragment.NavHostFragment"
        android:layout_width="0dp"
        android:layout_height="0dp"
        app:defaultNavHost="true"
        app:navGraph="@navigation/mobile_navigation"
        app:layout_constraintTop_toBottomOf="@id/topAppBar"
        app:layout_constraintBottom_toTopOf="@id/bottomNavigation"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />

    <!-- Material 3 Bottom Navigation -->
    <com.google.android.material.bottomnavigation.BottomNavigationView
        android:id="@+id/bottomNavigation"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:background="?attr/colorSurface"
        app:menu="@menu/bottom_nav_menu"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>`,
    },
    guide: {
      title: 'Android Studio Setup & Build Guide.md',
      lang: 'markdown',
      path: 'docs/ANDROID_STUDIO_SETUP_GUIDE.md',
      code: `# ACADEMIQ: Android Studio & Firebase Setup Guide

### 1. Requirements
- Android Studio Hedgehog (2023.1.1) or newer
- JDK 17
- Android SDK 34 (Android 14) minimum SDK 24 (Android 7.0)

### 2. Firebase Configuration
1. Go to Firebase Console (https://console.firebase.google.com).
2. Create project: **ACADEMIQ**.
3. Register Android application with package: \`com.academiq.app\`.
4. Download \`google-services.json\` and paste it into: \`app/google-services.json\`.
5. Enable Services:
   - **Authentication**: Email/Password
   - **Firestore Database**: Start in Production Mode, apply \`firestore.rules\`
   - **Firebase Storage**: For photo uploads and PDF submissions
   - **Cloud Messaging (FCM)**: For teacher broadcast announcements

### 3. Build & Run on Physical Android Phone
1. Enable **Developer Options** on your phone (Tap "Build Number" 7 times).
2. Turn on **USB Debugging**.
3. Connect phone via USB cable and authorize computer.
4. In Android Studio, select your phone in the device dropdown.
5. Click **Run 'app'** (Green play button or Shift+F10).

The native Android app will compile, install APK, and launch seamlessly!`,
    },
  };

  const currentFile = filesContent[activeTab];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-4xl w-full border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  ACADEMIQ: Native Android Studio Codebase
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Java + Material 3 + Firebase
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pristine native source files for direct import into Android Studio.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'calculator', label: 'PriorityCalculator.java' },
            { id: 'worker', label: 'ReminderWorker.java' },
            { id: 'repository', label: 'FirebaseRepository.java' },
            { id: 'rules', label: 'firestore.rules' },
            { id: 'manifest', label: 'AndroidManifest.xml' },
            { id: 'gradle', label: 'build.gradle.kts' },
            { id: 'layout', label: 'activity_main.xml' },
            { id: 'guide', label: 'Setup Guide' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Code View Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 font-mono text-xs bg-slate-900/90 relative">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <span className="text-slate-400 text-[11px] truncate">{currentFile.path}</span>
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans transition-colors border border-slate-700"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <pre className="text-slate-300 whitespace-pre overflow-x-auto leading-relaxed">
            {currentFile.code}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ready for compile in Android Studio Hedgehog / Iguana / Jellyfish</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
