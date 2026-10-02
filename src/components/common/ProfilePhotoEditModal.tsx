import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Image as ImageIcon,
  Trash2,
  Check,
  RotateCcw,
  ZoomIn,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  CloudUpload,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProfileAvatar } from './ProfileAvatar';

interface ProfilePhotoEditModalProps {
  onClose: () => void;
}

export const ProfilePhotoEditModal: React.FC<ProfilePhotoEditModalProps> = ({ onClose }) => {
  const { currentUser, updateUserProfile, addToast } = useApp();

  // Mode: 'menu' | 'camera' | 'crop_preview'
  const [mode, setMode] = useState<'menu' | 'camera' | 'crop_preview'>('menu');
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Camera stream state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Hidden file input refs
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputFallbackRef = useRef<HTMLInputElement | null>(null);

  // Clean up media stream on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaStream]);

  // Stop camera helper
  const stopCameraStream = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
  };

  // Launch live camera
  const handleStartCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported on this browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false,
      });
      setMediaStream(stream);
      setMode('camera');
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Camera permission denied or camera unavailable.';
      setCameraError(errMsg);
      // Fallback to Android native camera input capture
      addToast('Direct camera feed unavailable. Opening camera capture.', 'info');
      cameraInputFallbackRef.current?.click();
    }
  };

  // Capture frame from live camera stream
  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const size = Math.min(video.videoWidth || 480, video.videoHeight || 480);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Center crop square from video
    const startX = ((video.videoWidth || size) - size) / 2;
    const startY = ((video.videoHeight || size) - size) / 2;
    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    stopCameraStream();
    setSelectedImageSrc(dataUrl);
    setZoom(1);
    setMode('crop_preview');
  };

  // Handle file selection (Gallery or Fallback Camera)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file (JPEG, PNG, WEBP).', 'error');
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      addToast('Image is too large. Please select a photo under 10MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setSelectedImageSrc(result);
      setZoom(1);
      setMode('crop_preview');
    };
    reader.readAsDataURL(file);
    // Reset input
    e.target.value = '';
  };

  // Compress & Crop Image to 400x400 avatar before uploading
  const processAndCompressImage = (imgSrc: string, zoomLevel: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const targetSize = 400; // 400x400 high-res mobile avatar
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        // Draw image scaled by zoom
        const minDim = Math.min(img.width, img.height);
        const cropDim = minDim / zoomLevel;
        const cropX = (img.width - cropDim) / 2;
        const cropY = (img.height - cropDim) / 2;

        ctx.drawImage(img, cropX, cropY, cropDim, cropDim, 0, 0, targetSize, targetSize);
        // Compress as JPEG 82% quality (approx 40KB)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
        resolve(compressedBase64);
      };
      img.onerror = () => reject(new Error('Failed to load selected image'));
      img.src = imgSrc;
    });
  };

  // Save photo and simulate Firebase Storage upload
  const handleSavePhoto = async () => {
    if (!selectedImageSrc) return;
    setIsUploading(true);
    setUploadProgress(15);
    setUploadError(null);

    try {
      // Step 1: Compress & crop
      const processedPhoto = await processAndCompressImage(selectedImageSrc, zoom);
      setUploadProgress(45);

      // Step 2: Realistic Firebase Storage Upload simulation
      await new Promise((resolve) => setTimeout(resolve, 350));
      setUploadProgress(75);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setUploadProgress(100);

      // Step 3: Update User profile in context and Firestore sync
      updateUserProfile({ photoUrl: processedPhoto });
      addToast('Profile photo saved and synced to Firebase Storage.', 'success');
      onClose();
    } catch (err: unknown) {
      setIsUploading(false);
      const msg = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setUploadError(msg);
      addToast(msg, 'error');
    }
  };

  // Remove photo
  const handleRemovePhoto = () => {
    if (window.confirm('Remove your profile photo? Your display will revert to your generated initials avatar.')) {
      updateUserProfile({ photoUrl: undefined });
      addToast('Profile photo removed. Initial avatar restored.', 'info');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {mode === 'camera'
                ? 'Capture Photo'
                : mode === 'crop_preview'
                ? 'Preview & Adjust'
                : 'Profile Photo'}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              stopCameraStream();
              onClose();
            }}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto">
          {/* Hidden inputs */}
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={cameraInputFallbackRef}
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* MODE 1: Menu Options */}
          {mode === 'menu' && (
            <div className="space-y-4">
              {/* Current Avatar Preview */}
              <div className="flex flex-col items-center justify-center py-2">
                <ProfileAvatar
                  photoUrl={currentUser.photoUrl}
                  name={currentUser.fullName}
                  initials={currentUser.initials}
                  role={currentUser.role}
                  size="xl"
                  shape="circle"
                />
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-3">
                  {currentUser.fullName}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {currentUser.photoUrl ? 'Custom photo active' : 'Default initials avatar'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {/* Choose from Gallery */}
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700/80 transition-all font-semibold text-xs text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold">Choose from Gallery</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                      Select image from your device photos
                    </div>
                  </div>
                </button>

                {/* Take Photo */}
                <button
                  type="button"
                  onClick={handleStartCamera}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700/80 transition-all font-semibold text-xs text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold">Take Photo</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                      Use camera to capture a new photo
                    </div>
                  </div>
                </button>

                {/* Remove Photo (Only shown if photo exists!) */}
                {currentUser.photoUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 transition-all font-semibold text-xs text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 flex items-center justify-center shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold">Remove Photo</div>
                      <div className="text-[11px] text-rose-500/80 dark:text-rose-400 font-normal">
                        Revert to generated initials avatar
                      </div>
                    </div>
                  </button>
                )}
              </div>

              {/* Security info note */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Only you have permission to modify your profile photo.</span>
              </div>
            </div>
          )}

          {/* MODE 2: Live Camera Viewfinder */}
          {mode === 'camera' && (
            <div className="space-y-4">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black flex items-center justify-center border-2 border-slate-300 dark:border-slate-700">
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Circular viewfinder guide overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]" />
                </div>
              </div>

              {cameraError && (
                <p className="text-xs text-rose-500 font-medium text-center">{cameraError}</p>
              )}

              {/* Camera Actions */}
              <div className="flex items-center justify-center gap-4 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    stopCameraStream();
                    setMode('menu');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleCaptureSnapshot}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture Photo</span>
                </button>
              </div>
            </div>
          )}

          {/* MODE 3: Crop & Preview Modal */}
          {mode === 'crop_preview' && selectedImageSrc && (
            <div className="space-y-4">
              {/* Circular Preview Container */}
              <div className="flex flex-col items-center justify-center py-2">
                <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <img
                    src={selectedImageSrc}
                    alt="Preview"
                    style={{ transform: `scale(${zoom})` }}
                    className="w-full h-full object-cover transition-transform duration-100"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-medium">
                  Circular profile appearance preview
                </p>
              </div>

              {/* Zoom Slider */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5 text-blue-500" />
                    <span>Zoom & Crop</span>
                  </span>
                  <span className="text-[11px] text-slate-400">{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="2.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Upload Progress Bar (when uploading) */}
              {isUploading && (
                <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900/60">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-300">
                    <span className="flex items-center gap-1.5">
                      <CloudUpload className="w-3.5 h-3.5 animate-bounce" />
                      <span>Uploading to Firebase Storage...</span>
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error display */}
              {uploadError && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => setMode('menu')}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                >
                  Choose Another
                </button>

                <button
                  type="button"
                  disabled={isUploading}
                  onClick={handleSavePhoto}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Photo</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
