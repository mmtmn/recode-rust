# Recode


https://github.com/user-attachments/assets/3f7359e7-4775-4127-b681-fb522eefd26c




Developer-first syntax drills with instant feedback, playlists, and a focused editor experience. Built to emphasize clean architecture, SOLID, DRY, and test coverage across unit, integration, and E2E layers.

## Stack
- Backend: FastAPI + SQLModel + SQLite
- Frontend: React + Vite + Tailwind + Framer Motion
- Mobile: Flutter (Android + iOS)
- Tests: Pytest (unit/integration), Vitest (frontend unit), Playwright (e2e)
- Validation: Executes user code against expected outputs per language (no sandbox)

## Project Layout
- `backend/`: API, domain, services, repositories, seed data
- `frontend/`: React app
- `mobile/`: Flutter app (Android + iOS)
- `e2e/`: Playwright tests

## Prerequisites
- Python 3.11+
- Node.js 18+
- npm 9+
- Language runtimes for validation (install what you want to practice):
  - Python (uses current interpreter)
  - JavaScript (Node.js)
  - TypeScript (`ts-node` or `tsc` + Node.js)
  - Java (`javac` + `java`)
  - C++ (`g++`)
  - C# (`dotnet` SDK or `csc` + runtime)
  - Go (`go`)
  - Rust (`rustc`)
  - SQL (`sqlite3` CLI)

## Setup and Run Locally

### Smart Install (Linux, macOS, Windows)

Use the smart installer to verify prerequisites, auto-install or upgrade missing tooling, set up validation runtimes, sync project dependencies, and then choose what to run.

macOS / Linux:
```bash
./scripts/smart-install.sh
```

Windows (PowerShell):
```powershell
./scripts/smart-install.ps1
```

Direct Python entrypoint (all platforms):
```bash
python scripts/smart_install.py
```

Helpful flags:
- `--yes`: non-interactive mode (no prompts)
- `--run <target>`: launch a command after setup (`backend`, `frontend`, `fullstack`, `backend-test`, `frontend-test`, `e2e-test`, `mobile-test`, `none`)
- `--no-mobile`: skip Flutter/mobile setup
- `--skip-playwright`: skip Playwright browser install step
- `--skip-runtimes`: skip validation runtime checks/install attempts

### Optional: Dev Aliases (`reback`, `refront`)

Install terminal shortcuts that start backend/frontend from anywhere.

macOS / Linux:
```bash
./scripts/setup-aliases.sh
```

To apply aliases in the current Bash session immediately:
```bash
source ./scripts/setup-aliases.sh
```

Windows (PowerShell):
```powershell
./scripts/setup-aliases.ps1
```

Direct Python entrypoint (all platforms):
```bash
python scripts/setup_aliases.py
```

After running, open a new terminal (or source your profile), then use:
- `reback`: start backend (`uvicorn app.main:app --reload`)
- `refront`: start frontend (`npm run dev`)

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will run on `http://localhost:8000`. A local SQLite database is created at `backend/app.db` and seeded on startup.

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The UI will run on `http://localhost:5173` and will call the backend at `http://localhost:8000` by default.

To customize the API URL:
```bash
VITE_API_URL=http://localhost:8000 npm run dev
```

### Mobile (Flutter)
```bash
cd mobile
flutter pub get
```

Start the backend in a separate terminal (see **Backend** above).

If you need to (re)generate the platform folders:
```bash
cd mobile
flutter create --platforms=android,ios .
```

#### Run on an Android emulator
```bash
flutter emulators
flutter emulators --launch <emulator_id>
flutter run --dart-define=API_URL=http://10.0.2.2:8000
```

#### Run on the iOS simulator
```bash
open -a Simulator
flutter run --dart-define=API_URL=http://localhost:8000
```

#### Run on a real device (Android or iOS)
1. Connect the device (USB) and ensure it appears in `flutter devices`.
2. Use your machine's LAN IP for the API URL:
```bash
flutter run --dart-define=API_URL=http://<your-machine-ip>:8000
```

Notes:
- Android emulators cannot reach `localhost` on your host; use `10.0.2.2` instead.
- If you run into cleartext HTTP restrictions, enable HTTP for local dev:
  - Android: set `android:usesCleartextTraffic="true"` in `android/app/src/main/AndroidManifest.xml`.
  - iOS: set `NSAppTransportSecurity -> NSAllowsArbitraryLoads` to `YES` in `ios/Runner/Info.plist`.
- iOS builds require macOS + Xcode.

## Quickstart (Two Terminals)
Terminal 1:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Terminal 2:
```bash
cd frontend
npm install
npm run dev
```

## Tests

### Backend unit + integration
```bash
cd backend
pytest
```

### Frontend unit
```bash
cd frontend
npm run test
```

### End-to-end
Start backend + frontend in separate terminals, then:
```bash
cd e2e
npm install
npm run test
```

### Mobile (Flutter)
```bash
cd mobile
flutter test
flutter test integration_test
```

## Notes
- Data is seeded automatically on backend startup.
- Validation runs code using local runtimes and compares output to lesson expectations.
- To refresh lesson content after seed changes, delete `backend/app.db` and restart the backend.
- To reset timing stats (attempts + best scores):
  ```bash
  sqlite3 backend/app.db "DELETE FROM attempt; DELETE FROM bestscore;"
  ```
