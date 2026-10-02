import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { getInitials } from '../../types';

interface ProfileAvatarProps {
  photoUrl?: string;
  name?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'rounded';
  role?: 'student' | 'teacher';
  showEditBadge?: boolean;
  onEditClick?: () => void;
  className?: string;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  photoUrl,
  name = '',
  initials,
  size = 'md',
  shape = 'circle',
  role = 'student',
  showEditBadge = false,
  onEditClick,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  // Compute initials if not explicitly provided
  const displayInitials = initials || getInitials(name);

  // Size mappings
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-xs font-bold',
    lg: 'w-13 h-13 text-base font-extrabold',
    xl: 'w-20 h-20 text-2xl font-black',
  }[size];

  const roundedClasses = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';

  const roleGradients =
    role === 'teacher'
      ? 'from-indigo-700 via-indigo-600 to-purple-600 text-white'
      : 'from-blue-700 via-indigo-600 to-sky-500 text-white';

  const hasValidPhoto = Boolean(photoUrl && !imageError);

  return (
    <div
      className={`relative inline-block select-none shrink-0 ${className}`}
      onClick={onEditClick}
    >
      <div
        className={`${sizeClasses} ${roundedClasses} overflow-hidden shadow-xs border border-white/40 dark:border-slate-700 flex items-center justify-center ${
          hasValidPhoto ? 'bg-slate-100 dark:bg-slate-800' : `bg-gradient-to-tr ${roleGradients}`
        }`}
      >
        {hasValidPhoto ? (
          <img
            src={photoUrl}
            alt={name || 'User profile'}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-bold tracking-tight">{displayInitials}</span>
        )}
      </div>

      {showEditBadge && onEditClick && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEditClick();
          }}
          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-800 transition-all cursor-pointer"
          title="Change profile photo"
          aria-label="Change profile photo"
        >
          <Camera className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
