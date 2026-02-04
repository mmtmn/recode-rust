# SyntaxQuest

LeetCode-style syntax drills for core languages, built as a gamified learning experience with SQLite, achievements, and animated UI.

## Stack
- Backend: FastAPI + SQLModel + SQLite
- Frontend: React + Vite + Tailwind + Framer Motion
- Tests: Pytest (unit/integration), Vitest (frontend unit), Playwright (e2e)

## Project Layout
- `backend/`: API, domain, services, repositories, seed data
- `frontend/`: React app
- `e2e/`: Playwright tests

## Prerequisites
- Python 3.11+
- Node.js 18+
- npm 9+

## Setup and Run Locally

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

## Notes
- Data is seeded automatically on backend startup.
- The design is intentionally cinematic with gradients, motion, and quest-style UI patterns.
