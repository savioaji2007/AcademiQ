import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Bell,
  Clock,
  CheckCheck,
  Trash2,
  AlertTriangle,
  History,
  Megaphone,
  Layers,
} from 'lucide-react';

interface NotificationsModalProps {
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ onClose }) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    setSelectedTaskId,
  } = useApp();

  const handleNotificationClick = (taskId?: string, notifId?: string) => {
    if (notifId) {
      markNotificationAsRead(notifId);
    }
    if (taskId) {
      setSelectedTaskId(taskId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Notifications
              </h2>
              <p className="text-[10px] text-slate-500">
                Reminders, extensions & alerts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            {notifications.filter((n) => !n.isRead).length} unread alerts
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsAsRead}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <span>•</span>
            <button
              onClick={clearAllNotifications}
              className="text-slate-500 hover:text-rose-500 font-medium flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="p-4 sm:p-5 space-y-3 overflow-y-auto flex-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              <Bell className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="font-semibold text-slate-600 dark:text-slate-300">
                You're all caught up!
              </p>
              <p className="text-[11px] mt-0.5">No notifications in history.</p>
            </div>
          ) : (
            notifications.map((notif) => {
              let Icon = Bell;
              let iconBg = 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400';

              if (notif.type === 'deadline_changed') {
                Icon = History;
                iconBg = 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400';
              } else if (notif.type === 'announcement') {
                Icon = Megaphone;
                iconBg = 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400';
              } else if (notif.type === 'final_alert') {
                Icon = AlertTriangle;
                iconBg = 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400';
              }

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.taskId, notif.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    notif.isRead
                      ? 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-75'
                      : 'bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-900/60 shadow-xs'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(notif.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                      {notif.message}
                    </p>

                    {notif.taskId && (
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold inline-block pt-0.5">
                        Tap to inspect task →
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
