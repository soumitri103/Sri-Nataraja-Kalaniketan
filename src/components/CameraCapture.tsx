import { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

interface CameraCaptureProps {
  onCapture: (faceData: { canvas: HTMLCanvasElement; descriptor: Float32Array | null; imageUrl: string }) => void;
  label?: string;
}

function CameraCapture({ onCapture, label = 'Capture Face' }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (cameraActive) {
      startCamera();
    }
  }, [cameraActive]);

  useEffect(() => {
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
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const captureFrame = async () => {
    setIsProcessing(true);
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size to match video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0);

      // Create image preview
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);

      // Extract face descriptor using face-api.js
      console.log('Detecting face in captured image...');
      const detections = await faceapi
        .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length === 0) {
        alert('No face detected. Please make sure your face is clearly visible in the camera.');
        setCapturedImage('');
        setIsProcessing(false);
        return;
      }

      if (detections.length > 1) {
        alert('Multiple faces detected. Please ensure only one person is in the frame.');
        setCapturedImage('');
        setIsProcessing(false);
        return;
      }

      // Get the first (and only) face descriptor
      const faceDescriptor = detections[0].descriptor;
      console.log('✓ Face detected successfully. Descriptor:', faceDescriptor);

      // Pass face data to parent component
      onCapture({
        canvas,
        descriptor: faceDescriptor,
        imageUrl: imageData,
      });
    } catch (error) {
      console.error('Error capturing face:', error);
      alert('Error processing face. Please try again.');
      setCapturedImage('');
    } finally {
      setIsProcessing(false);
            stopCamera();
    }
  };

  const retakePhoto = () => {
    setCapturedImage('');
  };

  return (
    <div className="camera-capture">
      <div className="camera-capture">
        {!cameraActive ? (
          <button
            className="btn-primary"
            onClick={() => setCameraActive(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              marginBottom: '20px',
            }}
          >
            🎥 Open Camera
          </button>
        ) : (
          <div className="camera-container" style={{ marginBottom: '20px' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              width="640"
              height="480"
              style={{
                border: '2px solid #007bff',
                borderRadius: '4px',
                maxWidth: '100%',
                backgroundColor: '#000',
              }}
            />
            {!capturedImage && (
              <button
                onClick={captureFrame}
                disabled={isProcessing}
                style={{
                  padding: '12px 24px',
                  backgroundColor: isProcessing ? '#ccc' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  marginTop: '10px',
                  width: '100%',
                }}
              >
                {isProcessing ? '🔄 Processing...' : '📸 Capture Photo'}
              </button>
            )}
          </div>
        )}

        {capturedImage && (
          <div className="captured-image-container">
            <div style={{ marginBottom: '20px' }}>
              <img
                src={capturedImage}
                alt="Captured face"
                style={{
                  maxWidth: '100%',
                  borderRadius: '4px',
                  border: '2px solid #28a745',
                }}
              />
            </div>
            <div className="capture-controls" style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-primary"
                onClick={() => {
                  setCameraActive(false);
                  setCapturedImage('');
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                ✓ Use This Face
              </button>
              <button
                className="btn-secondary"
                onClick={retakePhoto}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#ffc107',
                  color: 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                🔄 Retake Photo
              </button>
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default CameraCapture;