# ACADEMIQ — Android Studio Project
**Intelligent Academic Deadline Tracking and Priority Management System**  
*Tagline: Know What Matters. Do It on Time.*

---

## 1. Architecture Overview
This native Android Studio project is built using:
- **Language**: Java 17
- **UI System**: Material Design 3, XML Layouts, ViewBinding
- **Data & Auth**: Firebase Authentication, Cloud Firestore, Firebase Storage
- **Reminders**: WorkManager (`ReminderWorker.java`) and Firebase Cloud Messaging
- **Priority Engine**: Deterministic Rule-Based Algorithm (`PriorityCalculator.java`)

---

## 2. Prerequisites
1. **Android Studio**: Android Studio Hedgehog (2023.1.1) or newer.
2. **Java Development Kit**: JDK 17.
3. **Android SDK**: Compile SDK 34, Min SDK 24 (compatible with Android 7.0 through Android 14+).

---

## 3. Firebase Configuration
1. Open the [Firebase Console](https://console.firebase.google.com).
2. Create project named **ACADEMIQ**.
3. Register an Android app with package name:
   \`com.academiq.app\`
4. Download \`google-services.json\` and place it into:
   \`app/google-services.json\`
5. Enable services in Firebase console:
   - **Authentication**: Email/Password
   - **Cloud Firestore**: Apply rules from \`firestore.rules\`
   - **Firebase Storage**: For photo uploads and PDF submissions
   - **Cloud Messaging (FCM)**: For teacher broadcast announcements

---

## 4. Run on a Physical Android Phone
1. On your Android phone:
   - Go to **Settings > About Phone**
   - Tap **Build Number** 7 times to enable **Developer Options**
   - Go to **Settings > Developer Options** and enable **USB Debugging**
2. Connect your phone via USB to your computer and tap "Allow USB debugging".
3. Open this folder in Android Studio:
   - Click **File > Open...** and select the \`android_project\` folder.
   - Wait for Gradle sync to complete.
4. Select your connected phone from the device dropdown.
5. Click **Run 'app'** (Green play icon or \`Shift + F10\`).
