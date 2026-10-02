import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Lock,
  Palette,
  RotateCcw,
  LogOut,
  Save,
  CheckCircle2,
  ShieldCheck,
  Building,
  GraduationCap,
  Camera,
  Trash2,
  Sun,
  Moon,
  Sparkles,
  Mail,
  BookOpen,
  Edit3,
  X,
  Check,
  Award,
  ArrowRight,
  Layers,
  Calendar,
  Clock,
  IdCard,
} from 'lucide-react';
import { ProfileAvatar } from './ProfileAvatar';
import { ProfilePhotoEditModal } from './ProfilePhotoEditModal';

export const ProfileScreen: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    theme,
    setTheme,
    resetToDemoData,
    addToast,
    role,
    switchRole,
    enrichedTasks,
    allUsers,
  } = useApp();

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email);
  const [department, setDepartment] = useState(currentUser.department);
  const [classDept, setClassDept] = useState(currentUser.classDept);
  const [semester, setSemester] = useState(currentUser.semester);
  const [studentIdNum, setStudentIdNum] = useState(currentUser.studentIdNum || '');
  const [teacherTitle, setTeacherTitle] = useState(currentUser.teacherTitle || '');

  // Synchronize local edit fields when currentUser changes
  useEffect(() => {
    setFullName(currentUser.fullName);
    setEmail(currentUser.email);
    setDepartment(currentUser.department);
    setClassDept(currentUser.classDept);
    setSemester(currentUser.semester);
    setStudentIdNum(currentUser.studentIdNum || '');
    setTeacherTitle(currentUser.teacherTitle || '');
  }, [currentUser]);

  // Password change form
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Quick stats calculation
  const completedCount = enrichedTasks.filter(
    (t) => t.studentProgress.status === 'completed'
  ).length;
  const pendingCount = enrichedTasks.length - completedCount;

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!fullName.trim()) {
      addToast('Full name cannot be empty.', 'warning');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      addToast('Please enter a valid institutional email address.', 'warning');
      return;
    }
    if (!department.trim()) {
      addToast('Department cannot be empty.', 'warning');
      return;
    }
    if (!semester.trim()) {
      addToast('Semester cannot be empty.', 'warning');
      return;
    }

    updateUserProfile({
      fullName: fullName.trim(),
      email: email.trim(),
      department: department.trim(),
      classDept: classDept.trim() || currentUser.classDept,
      semester: semester.trim(),
      studentIdNum: studentIdNum.trim(),
      teacherTitle: teacherTitle.trim(),
    });

    setIsEditing(false);
    addToast('Profile updated: Institutional email, department, and semester saved successfully.', 'success');
  };

  const handleCancelEdit = () => {
    setFullName(currentUser.fullName);
    setEmail(currentUser.email);
    setDepartment(currentUser.department);
    setClassDept(currentUser.classDept);
    setSemester(currentUser.semester);
    setStudentIdNum(currentUser.studentIdNum || '');
    setTeacherTitle(currentUser.teacherTitle || '');
    setIsEditing(false);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      addToast('Please enter current and new password.', 'warning');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setShowPasswordSection(false);
    addToast('Password updated securely in session credentials.', 'success');
  };

  const handleLogout = () => {
    addToast('Signed out of session. Switched role.', 'info');
    switchRole(role === 'student' ? 'teacher' : 'student');
  };

  const departmentsList = [
    'Computer Science & Engineering',
    'Information Technology',
    'Artificial Intelligence & Data Science',
    'Electronics & Communication Engineering',
    'Electrical & Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Department of Computing & Informatics',
    'Faculty of Computer Applications',
  ];

  const semesterOptions = [
    'Semester 1',
    'Semester 2',
    'Semester 3',
    'Semester 4',
    'Semester 5',
    'Semester 6',
    'Semester 7',
    'Semester 8',
    'All Semesters',
  ];

  return (
    <div className="space-y-6 pb-12 w-full max-w-5xl mx-auto">
      {/* Web App Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Account & Profile Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your institutional identity, academic credentials, department, and semester
          </p>
        </div>

        {/* Quick Mode Indicator / Edit Toggle */}
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile Details</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
              <button
                type="button"
                onClick={() => handleSaveProfile()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main 2-Column Responsive Web Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: User Identity Card & Quick Stats */}
        <div className="lg:col-span-1 space-y-5">
          {/* Identity Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-center flex flex-col items-center">
            {/* Profile Avatar with Edit Trigger */}
            <div className="relative mb-3 flex flex-col items-center">
              <ProfileAvatar
                photoUrl={currentUser.photoUrl}
                name={currentUser.fullName}
                initials={currentUser.initials}
                role={currentUser.role}
                size="xl"
                shape="circle"
                showEditBadge={true}
                onEditClick={() => setIsPhotoModalOpen(true)}
              />

              {/* Photo Actions */}
              <div className="flex items-center gap-1.5 mt-3">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 transition-colors cursor-pointer"
                >
                  <Camera className="w-3 h-3" />
                  <span>{currentUser.photoUrl ? 'Change Photo' : 'Upload Photo'}</span>
                </button>

                {currentUser.photoUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Remove profile photo and restore initials avatar?')) {
                        updateUserProfile({ photoUrl: undefined });
                        addToast('Profile photo removed. Initial avatar restored.', 'info');
                      }
                    }}
                    className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-500 flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
                    title="Remove photo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
              {currentUser.fullName}
            </h2>

            <div className="flex items-center gap-2 mt-1.5">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 capitalize">
                {currentUser.role}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-mono font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {currentUser.classDept}
              </span>
            </div>

            {/* Institutional Email Display */}
            <div className="mt-3 w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-left">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Institutional Email
              </div>
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 font-mono truncate mt-0.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{currentUser.email}</span>
              </div>
            </div>

            {/* Department & Semester Display */}
            <div className="mt-2 w-full grid grid-cols-2 gap-2 text-left">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Semester
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                  {currentUser.semester}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  ID / Code
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                  {currentUser.studentIdNum || 'FAC-CS-01'}
                </div>
              </div>
            </div>

            <div className="mt-2 w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-left">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Department
              </div>
              <div className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-0.5 truncate flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{currentUser.department}</span>
              </div>
            </div>
          </div>

          {/* Academic Activity Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Academic Standing</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
                <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">
                  Completed
                </div>
                <div className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-0.5">
                  {completedCount}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Tasks verified</div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
                <div className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase">
                  Pending
                </div>
                <div className="text-xl font-black text-blue-700 dark:text-blue-300 mt-0.5">
                  {pendingCount}
                </div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400">In progress</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Active Roster Size</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {allUsers.length} Academic Users
              </span>
            </div>
          </div>

          {/* Quick Session Switching */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch to {role === 'student' ? 'Faculty' : 'Student'} Session</span>
            </button>
            <button
              type="button"
              onClick={resetToDemoData}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sample Data</span>
            </button>
          </div>
        </div>

        {/* Right Column: Academic Credentials Edit Form, Theme & Security */}
        <div className="lg:col-span-2 space-y-5">
          {/* 1. Academic Credentials & Profile Information (Edit Option) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Institutional & Academic Information
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Edit and update your institutional email, department, and semester
                  </p>
                </div>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-bold transition-colors cursor-pointer border border-blue-200 dark:border-blue-900"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Options</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Full Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isEditing}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border transition-colors ${
                      isEditing
                        ? 'bg-white dark:bg-slate-950 border-blue-300 dark:border-blue-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 cursor-not-allowed'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {role === 'student' ? 'Student ID Number' : 'Faculty Title'}
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={role === 'student' ? studentIdNum : teacherTitle}
                    onChange={(e) =>
                      role === 'student'
                        ? setStudentIdNum(e.target.value)
                        : setTeacherTitle(e.target.value)
                    }
                    placeholder={role === 'student' ? 'e.g. STU-2024-001' : 'e.g. Associate Professor'}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border transition-colors ${
                      isEditing
                        ? 'bg-white dark:bg-slate-950 border-blue-300 dark:border-blue-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* 1. INSTITUTIONAL EMAIL (EDIT OPTION) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-500" />
                    <span>Institutional Email</span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900">
                      Editable
                    </span>
                  </label>
                  {isEditing && (
                    <span className="text-[10px] text-slate-400">
                      Must contain university domain (@...)
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    disabled={!isEditing}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. yourname@university.edu"
                    className={`w-full pl-10 pr-3.5 py-2.5 text-xs font-mono rounded-xl border transition-colors ${
                      isEditing
                        ? 'bg-white dark:bg-slate-950 border-blue-400 dark:border-blue-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 cursor-not-allowed'
                    }`}
                  />
                </div>
                {isEditing && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[10px] text-slate-400 font-medium">Domain Presets:</span>
                    {['@university.edu', '@tech.ac.in', '@college.edu', '@engineering.edu'].map((domain) => (
                      <button
                        key={domain}
                        type="button"
                        onClick={() => {
                          const prefix = email.split('@')[0] || 'student';
                          setEmail(`${prefix}${domain}`);
                        }}
                        className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        {domain}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. DEPARTMENT (EDIT OPTION) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Academic Department</span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-900">
                      Editable
                    </span>
                  </label>
                  {isEditing && (
                    <span className="text-[10px] text-slate-400">
                      Select or type your department
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    disabled={!isEditing}
                    list="departments-datalist"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Science & Engineering"
                    className={`w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border transition-colors ${
                      isEditing
                        ? 'bg-white dark:bg-slate-950 border-indigo-400 dark:border-indigo-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 cursor-not-allowed'
                    }`}
                  />
                  <datalist id="departments-datalist">
                    {departmentsList.map((dept) => (
                      <option key={dept} value={dept} />
                    ))}
                  </datalist>
                </div>
                {isEditing && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[10px] text-slate-400 font-medium">Quick Select:</span>
                    {[
                      'Computer Science & Engineering',
                      'Information Technology',
                      'AI & Data Science',
                      'Electronics & Comm.',
                    ].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDepartment(d)}
                        className={`text-[10px] px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                          department === d
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. SEMESTER & CLASS / SECTION (EDIT OPTION) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Semester */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                      <span>Semester / Academic Term</span>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-900">
                        Editable
                      </span>
                    </label>
                  </div>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      disabled={!isEditing}
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className={`w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border transition-colors cursor-pointer ${
                        isEditing
                          ? 'bg-white dark:bg-slate-950 border-purple-400 dark:border-purple-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      {semesterOptions.map((sem) => (
                        <option key={sem} value={sem}>
                          {sem}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Class / Section */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Class / Section Group
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={classDept}
                    onChange={(e) => setClassDept(e.target.value)}
                    placeholder="e.g. CS-3A"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border transition-colors ${
                      isEditing
                        ? 'bg-white dark:bg-slate-950 border-blue-300 dark:border-blue-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* Semester Quick Pills when editing */}
              {isEditing && (
                <div className="pt-1">
                  <div className="text-[10px] text-slate-400 font-medium mb-1.5">
                    Click to select semester:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'].map(
                      (sem) => (
                        <button
                          key={sem}
                          type="button"
                          onClick={() => setSemester(sem)}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                            semester === sem
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {sem.replace('Semester ', 'Sem ')}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              {isEditing ? (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Profile Information</span>
                  </button>
                </div>
              ) : (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-200/80 dark:border-slate-700"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                    <span>Click Here to Edit Institutional Email, Department or Semester</span>
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* 2. Theme & Appearance Settings */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Appearance & Display Theme
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select your interface theme preference for the web portal
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 border cursor-pointer ${
                  theme === 'light'
                    ? 'bg-blue-50 text-blue-700 border-blue-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <Sun className={`w-5 h-5 ${theme === 'light' ? 'text-amber-500' : 'text-slate-400'}`} />
                <span>Light</span>
                <span className="text-[10px] text-slate-400 font-normal">Clean White</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 border cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-indigo-950 text-indigo-300 border-indigo-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>Dark</span>
                <span className="text-[10px] text-slate-400 font-normal">High Contrast</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 border cursor-pointer ${
                  theme === 'system'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <Sparkles className={`w-5 h-5 ${theme === 'system' ? 'text-blue-500' : 'text-slate-400'}`} />
                <span>System</span>
                <span className="text-[10px] text-slate-400 font-normal">Auto Sync</span>
              </button>
            </div>
          </div>

          {/* 3. Account Security & Password */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Account Security & Credentials
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Authentication protected institutional profile
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordSection(!showPasswordSection)}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
              >
                {showPasswordSection ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {showPasswordSection && (
              <form onSubmit={handleChangePassword} className="space-y-3 pt-1 max-w-md">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Update Password
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Profile Photo Edit Modal */}
      {isPhotoModalOpen && (
        <ProfilePhotoEditModal onClose={() => setIsPhotoModalOpen(false)} />
      )}
    </div>
  );
};
