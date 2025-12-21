<!-- Copilot instructions for Sri-Nataraja-Kalaniketan repo -->
# Copilot / AI Agent Instructions

This file contains targeted, actionable knowledge to help an AI coding agent be productive in this codebase.

- **Big picture**: single-page React + TypeScript app (Vite) implementing browser-only face-recognition attendance. Models are loaded client-side (`face-api.js` / `@tensorflow/tfjs`) and embeddings are stored in browser storage (no backend currently).

- **Key files to inspect**:
  - `README.md` — high-level design and usage.
  - `package.json` — scripts: `npm run dev`, `npm run build`, `npm run type-check`.
  - `src/App.tsx` — app shell; calls `faceEngine.initialize()` on start and controls top-level pages (`enrollment`, `attendance`, `dashboard`).
  - `src/core/faceEngine.ts` — core face API wrapper: model loading, descriptor extraction, enrollment, verify, export/import. Important constants: `MAX_DISTANCE = 0.6`, `MIN_CONFIDENCE = 0.6`.
  - `src/core/database.ts` — localStorage keys and CRUD helpers. Storage keys: `face_descriptors`, `students`, `sessions`, `attendance`.
  - `src/components/EnrollmentForm.tsx` — example enrollment flow: collects student meta, captures face via `CameraCapture`, calls `faceEngine.extractFaceDescriptor(canvas)`, saves to `AttendanceDB` and `faceEngine.exportData()`.

- **Data flow & conventions**:
  - Face descriptors are stored as numeric arrays when exported (`faceEngine.exportData()` converts Float32Array → number[]), and re-imported via `faceEngine.importData(json)`.
  - Persisted data is strictly in `localStorage` via the keys listed in `database.ts`. When changing persistence format, update both `faceEngine.exportData()` and `AttendanceDB` helpers.
  - UI components pass an HTMLCanvasElement/HTMLVideoElement to `faceEngine` methods. Use `extractFaceDescriptor()` and `verifyFace()` with live media elements.

- **Models & static assets**:
  - Models are loaded from the `/models` URI (`faceapi.nets.*.loadFromUri('/models')`). Ensure a `public/models` folder is served at root in dev/production.

- **Developer workflows**:
  - Dev server: `npm install && npm run dev` (Vite)
  - Build: `npm run build` (runs `tsc` then `vite build`)
  - Type check: `npm run type-check` (uses `tsc --noEmit`)
  - No test runner is present. Add tests under `src/__tests__` if required and update `package.json`.

- **Project-specific patterns**:
  - Prefer storing/reading face data via `AttendanceDB.saveFaceData()` / `getFaceData()` — other code reads these keys directly.
  - Enrollment flow commits both student metadata (`AttendanceDB.saveStudent`) and face descriptors (`faceEngine.enrollFace` + `AttendanceDB.saveFaceData`). Replicate this ordering when adding new enrollment endpoints.
  - The app expects one face per enrollment; multi-face support is not implemented (see README limitations).

- **When editing or extending**:
  - If you change descriptor format or distance thresholds, update `faceEngine.verifyFace()`, `exportData()` / `importData()`, and any code that computes or interprets `confidence`.
  - If you add a backend, adapt `AttendanceDB.*` methods or add a new persistence adapter; keep the localStorage helpers for offline/dev modes.
  - Place large model files in `public/models` and verify `faceapi` loading in `src/core/faceEngine.ts`.

- **Quick examples for agents**:
  - To find where face data is loaded on start: open `src/App.tsx` (search `faceEngine.initialize` and `AttendanceDB.getFaceData`).
  - To add a new UI page, follow `App.tsx`'s `currentPage` pattern and create a component under `src/components`.

If anything here is unclear or you'd like additional examples (API stubs, persistence adapters, or a CI workflow), tell me which area to expand. 
