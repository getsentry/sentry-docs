import {useCallback, useState} from 'react';

const takeScreenshot = async (): Promise<Blob> => {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: false,
    preferCurrentTab: true,
    surfaceSwitching: 'exclude',
  } as any);
  const videoTrack = stream.getVideoTracks()[0];
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Could not get canvas context');
  }
  const video = document.createElement('video');
  video.srcObject = new MediaStream([videoTrack]);

  await new Promise<void>(resolve => {
    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      stream.getTracks().forEach(track => track.stop());
      resolve();
    };
    video.play();
  });

  return new Promise(resolve => {
    canvas.toBlob(resolve);
  });
};

export const useTakeScreenshot = () => {
  const [isInProgress, setIsInProgress] = useState(false);

  const takeScreenshotCallback = useCallback(async (): Promise<Blob> => {
    setIsInProgress(true);
    let image: Blob | null = null;
    try {
      image = await takeScreenshot();
    } catch (error) {
      setIsInProgress(false);
      throw error;
    }
    setIsInProgress(false);
    return image;
  }, []);

  return {isInProgress, takeScreenshot: takeScreenshotCallback};
};
