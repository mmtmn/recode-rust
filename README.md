# Recode

Developer-first syntax drills with instant feedback, playlists, and a focused editor experience. Built to emphasize clean architecture, SOLID, DRY, and test coverage across unit, integration, and E2E layers.

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
- Syntax validation is lightweight by default (Python compilation + bracket checks); swap in real parsers as needed.
- To refresh lesson content after seed changes, delete `backend/app.db` and restart the backend.
