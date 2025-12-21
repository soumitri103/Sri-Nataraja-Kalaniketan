# Sri Nataraja Kalaniketan - Face Recognition Attendance System

## Project Overview

This is a web-first, cross-platform face recognition attendance tracking system designed for Sri Nataraja Kalaniketan institute. The system allows automated attendance marking using real-time face detection and recognition via machine learning.

**Status**: v0.1.0 - MVP Web Prototype (In Development)
**License**: MIT

## Key Features

- **Face Recognition Enrollment**: Register students with facial biometrics
- **Attendance Marking**: Real-time face detection and matching for mark attendance
- **Admin Dashboard**: View enrollment stats, attendance records, and sessions
- **Browser-Based**: No installation required - runs entirely in the web browser
- **Privacy-First**: Face embeddings stored locally, not raw images
- **Cross-Platform Ready**: Architecture supports Android and iOS via React Native

## Tech Stack

### Core Technologies
- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Face Recognition**: face-api.js (TensorFlow.js based)
- **ML Models**: TensorFlow.js with pre-trained face recognition models
- **Data Storage**: Browser LocalStorage & IndexedDB

### Project Structure
```
src/
  ├── core/
  │   ├── faceEngine.ts       # Face detection & recognition logic
  │   └── database.ts         # LocalStorage data management
  ├── components/
  │   ├── CameraCapture.tsx   # Camera stream & capture UI
  │   ├── EnrollmentForm.tsx  # Student registration workflow
  │   ├── AttendanceMarker.tsx # Session & face verification
  │   └── Dashboard.tsx       # Analytics & reporting
  ├── App.tsx                 # Main application shell
  └── App.css                 # Styling
```

## Getting Started

### Prerequisites
- Node.js 22.21.1 (specified in .nvmrc)
- npm or yarn
- Modern browser with WebGL support & camera access

### Installation

```bash
# Use nvm to switch to the correct Node.js version
nvm use

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage Workflow

### 1. Student Enrollment
1. Navigate to **Enrollment** tab
2. Enter student details (ID, Name, Roll No)
3. Capture face photo using webcam
4. Face descriptor is extracted and saved

### 2. Mark Attendance
1. Navigate to **Mark Attendance** tab
2. Create new attendance session (Session ID, Class Name)
3. Students stand before camera
4. Face is automatically detected, recognized, and logged
5. Confidence score shows match quality

### 3. View Analytics
1. Navigate to **Dashboard**
2. View enrolled students count
3. See total sessions and attendance records
4. Monitor average recognition confidence

## Architecture & Design Decisions

### Face Recognition Flow
```
Live Video Stream
    ↓
Detect Face (SSD MobileNet or TinyFaceDetector)
    ↓
Extract Face Landmarks (68-point mesh)
    ↓
Generate Face Descriptor (128-dim vector)
    ↓
Compare with Enrolled Descriptors (Euclidean distance)
    ↓
Return Match (if confidence > 60%)
```

### Data Flow
- **Enrollment**: Face descriptor saved → Student record → LocalStorage
- **Attendance**: Live descriptor → Compare all enrolled → Match → Save attendance record
- **Privacy**: Only normalized embeddings stored, never raw images

## Future Roadmap

### Phase 2: Mobile Support
- [ ] React Native wrapper for Android/iOS
- [ ] Native camera integration
- [ ] Offline capability with sync

### Phase 3: Enhanced Features  
- [ ] Multi-face detection in single frame
- [ ] Liveness detection (anti-spoofing)
- [ ] Emotion & attention tracking
- [ ] Reports generation (CSV, PDF)

### Phase 4: Enterprise
- [ ] Backend API integration
- [ ] Cloud biometric storage
- [ ] Role-based access control
- [ ] Audit logging

## Known Limitations (v0.1)

- Single face per enrollment
- Session data cleared on browser refresh (no persistence backend)
- Face-api.js models ~35MB initial load
- No multi-student simultaneous detection
- Browser-only, no mobile native app yet

## Performance Considerations

- **Model Loading**: ~5-10s on first load (cached after)
- **Face Detection**: ~100-200ms per frame @ 640x480
- **Memory**: ~200-300MB RAM during runtime
- **Browser Support**: Chrome, Firefox, Safari, Edge (WebGL required)

## Security & Privacy

- ✅ Face data stored locally, not transmitted
- ✅ No personal identification beyond face descriptor
- ✅ Student consent required for enrollment
- ✅ Clear data deletion mechanism
- ⚠️ HTTPS recommended for deployment
- ⚠️ Authentication should be added for production

## Contributing

This is an open-source educational project. Contributions welcome:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push branch (`git push origin feature/amazing`)
5. Open Pull Request

## License

MIT License - See LICENSE file for details

## Acknowledgments

- face-api.js by vladmandic
- TensorFlow.js community
- Sri Nataraja Kalaniketan Institute

## Contact & Support

For questions or issues, please open a GitHub issue or contact the development team.

---

**Last Updated**: December 2025
**Version**: 0.1.0-beta
