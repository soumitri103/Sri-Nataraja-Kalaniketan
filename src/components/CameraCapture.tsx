import { useRef, useState, useEffect } from 'react';

interface CameraCaptureProps {
  onCapture: (canvas: HTMLCanvasElement) => void;
  label?: string;
}

function CameraCapture({ onCapture, label = 'Capture Face' }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    if (cameraActive) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [cameraActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Failed to access camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        
        // Create data URL for preview
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        
        // Call parent callback
        onCapture(canvasRef.current);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setCameraActive(true);
  };

  return (
    <div className="camera-capture">
      {!cameraActive && !capturedImage && (
        <button className="btn-primary" onClick={() => setCameraActive(true)}>
          📷 Open Camera
        </button>
      )}

      {cameraActive && !capturedImage && (
        <div className="camera-container">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="camera-feed"
          />
          <div className="camera-overlay">Position your face in the center</div>
          <div className="camera-controls">
            <button className="btn-primary" onClick={captureFrame}>
              📸 Capture
            </button>
            <button className="btn-secondary" onClick={() => setCameraActive(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {capturedImage && (
        <div className="captured-image-container">
          <img src={capturedImage} alt="Captured face" className="captured-image" />
          <div className="capture-controls">
            <button className="btn-primary" onClick={() => onCapture(canvasRef.current!)}>
              ✓ Use This Photo
            </button>
            <button className="btn-secondary" onClick={retakePhoto}>
              Retake Photo
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default CameraCapture;
