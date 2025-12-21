# Testing Guide - Face Recognition Attendance System

## Quick Start (5 minutes)

### Prerequisites
- Node.js 16+ installed
- npm or yarn
- Modern browser (Chrome, Firefox, Safari, Edge)
- Webcam/camera device

### Setup & Run

```bash
# 1. Clone repository
git clone https://github.com/clk7ai/Sri-Nataraja-Kalaniketan.git
cd Sri-Nataraja-Kalaniketan

# 2. Install dependencies
npm install
# This will download ~500MB (includes TensorFlow.js & face-api models)

# 3. Start development server
npm run dev
# Server will start at http://localhost:3000

# 4. Open browser
# Navigate to http://localhost:3000
# Allow camera permissions when prompted
```

## Test Scenarios

### Scenario 1: Student Enrollment (2 mins)

**Objective**: Register a student with face biometrics

**Steps**:
1. Click **📝 Enrollment** tab
2. Fill form:
   - Student ID: `STU001`
   - Full Name: `Test Student`
   - Roll No: `A-01`
   - Email: `student@test.com` (optional)
3. Click **Proceed to Face Capture**
4. Click **📷 Open Camera**
5. Position face in center of frame (well-lit)
6. Click **📸 Capture**
7. Review captured image
8. Click **✓ Use This Photo**
9. Wait for processing (2-3 seconds)
10. See **✓ Enrollment Successful!** message
11. Face descriptor is now stored in browser

**Expected Result**:
- Student record created
- Face embedding saved
- Success confirmation shown
- Data persists in LocalStorage

---

### Scenario 2: Mark Attendance (3 mins)

**Objective**: Test face recognition and attendance marking

**Steps**:
1. Click **✓ Mark Attendance** tab
2. Fill session form:
   - Session ID: `SESSION-001`
   - Class Name: `Class X-A`
3. Click **Start Session**
4. You'll see: "Attendance Capture - Class X-A"
5. Click **📷 Open Camera**
6. Position your face in frame (same person from enrollment)
7. Click **📸 Capture**
8. System processes face and searches for matches
9. Should see: **✓ Test Student marked present (Confidence: XX%)**
10. Confidence score shows recognition quality (higher = better)
11. Click **End Session** to finish
12. See Session Summary with attendance count

**Expected Result**:
- Face recognized from enrollment
- Attendance record created
- Confidence score displayed (aim for >70%)
- Session summary shows count

**Troubleshooting**:
- If "Face not recognized":
  - Ensure good lighting
  - Face should be clear and frontal
  - Try capturing again
  - Adjust camera distance (45-60cm)

---

### Scenario 3: Dashboard Analytics (1 min)

**Objective**: View statistics and records

**Steps**:
1. Click **📊 Dashboard** tab
2. Observe stat cards:
   - Enrolled Students: should show 1
   - Sessions: should show 1
   - Total Marked: should show 1
   - Avg Confidence: recognition accuracy percentage
3. View **Enrolled Students** section
4. View **Recent Sessions** section

**Expected Result**:
- All statistics updated
- Student visible in enrollment list
- Session visible in history

---

### Scenario 4: Multiple Enrollments

**Steps**:
1. Go to **Enrollment** tab
2. Enroll second student:
   - Student ID: `STU002`
   - Name: `Another Student`
   - Roll No: `A-02`
   - Capture face (different person)
3. Go to Dashboard
4. Verify **Enrolled Students: 2**

---

## Advanced Testing

### Test Case: Face Matching Accuracy

**Objective**: Verify face recognition works consistently

**Steps**:
1. Enroll Student A
2. In attendance session, capture Student A's face multiple times
3. Note confidence scores
4. Expected: >60% confidence (threshold for match)

**Acceptance Criteria**:
- Consistent matches for same person
- Different lighting conditions still work
- Slight angle changes handled

### Test Case: Rejection of Unknown Face

**Objective**: Ensure system rejects unknown faces

**Steps**:
1. Enroll Student A
2. Have different person (Student B) capture in attendance
3. System should show: "Face not recognized. Please try again."

**Acceptance Criteria**:
- Unknown faces rejected
- No false matches

### Test Case: Session Persistence

**Objective**: Verify data survives browser refresh

**Steps**:
1. Enroll student
2. Create attendance session
3. Mark attendance for 1 student
4. Refresh browser (F5)
5. Go to Dashboard
6. Verify:
   - Students still enrolled
   - Sessions visible (if you check LocalStorage)
   - Attendance records exist

**Note**: Session data will be cleared on page refresh since we're using memory state. In production, this would sync to backend.

---

## Browser Developer Tools Testing

### Check LocalStorage Data

1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Local Storage** > `http://localhost:3000`
4. See stored keys:
   - `face_descriptors` - Face embedding data
   - `students` - Student records
   - `sessions` - Session info
   - `attendance` - Attendance records

### Monitor Performance

1. Open DevTools > **Performance** tab
2. Start recording
3. Perform enrollment
4. Check metrics:
   - Model loading: 5-10 seconds
   - Face detection: 100-200ms per capture
   - Face matching: <50ms

### Check Network

1. Open DevTools > **Network** tab
2. Initially load models (~35MB total):
   - `tiny_face_detector_model-weights_manifest.json`
   - `face_landmarks_model-weights_manifest.json`
   - `face_recognition_model-weights_manifest.json`
3. All traffic is local (no external API calls)

---

## Known Issues & Workarounds

| Issue | Cause | Workaround |
|-------|-------|----------|
| "No face detected" | Poor lighting | Use well-lit area, face 30-45cm from camera |
| Low confidence score | Angle/distance | Position face directly facing camera |
| Models not loading | WebGL not supported | Use modern browser or check WebGL support |
| Camera permission denied | Browser settings | Allow camera in browser permissions |
| Data cleared on refresh | No backend persistence | Keep browser tab open during session |

---

## Performance Benchmarks

### On First Load
- Model download: 35MB (cached after)
- Initial load time: 5-10 seconds
- Memory usage: 200-300MB

### Runtime
- Face detection: 100-200ms
- Face descriptor extraction: 50-100ms
- Matching 1-10 enrolled faces: <50ms
- Memory per face: ~3KB (descriptor only)

### Recommended Hardware
- CPU: Modern processor (2GHz+)
- RAM: 2GB+ available
- Disk: 500MB free
- Network: Broadband (for first load)

---

## Reporting Bugs

When reporting issues, please include:

1. **Environment**
   - Browser & version
   - OS (Windows/Mac/Linux)
   - Camera device info

2. **Steps to Reproduce**
   - Exact steps taken
   - Data used
   - Expected vs actual result

3. **Logs**
   - Browser console errors (F12 > Console)
   - Network errors
   - Screenshots

4. **Example Issue Format**
   ```
   Title: Face not detected in enrollment
   
   Browser: Chrome 120 on Windows 11
   Camera: Built-in webcam
   
   Steps:
   1. Go to Enrollment
   2. Click Open Camera
   3. Position face
   4. Click Capture
   
   Expected: Face detected, preview shown
   Actual: "No face detected" error
   
   Console error: [screenshot]
   ```

---

## Success Criteria Checklist

- [ ] Page loads without errors
- [ ] Camera permission request appears
- [ ] Can enroll student with face capture
- [ ] Face descriptor saves to browser storage
- [ ] Can start attendance session
- [ ] Face recognition matches enrolled student
- [ ] Confidence score displayed (>60%)
- [ ] Dashboard shows correct statistics
- [ ] Multiple enrollments supported
- [ ] Data persists in localStorage

---

## Next Phase Testing (Future)

- [ ] Backend API integration
- [ ] Cloud storage testing
- [ ] Mobile app testing (Android/iOS)
- [ ] Multi-face detection
- [ ] Liveness detection
- [ ] Performance at scale (100+ enrollments)
- [ ] Security & privacy audit

---

**Last Updated**: December 2025
**Version**: 0.1.0-beta Testing Guide
