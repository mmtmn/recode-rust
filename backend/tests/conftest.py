from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, create_engine

from app.core import db
from app.main import create_app
from app.seed import seed_data


@pytest.fixture()
def client(tmp_path: Path):
    test_db_path = tmp_path / "test.db"
    engine = create_engine(
        f"sqlite:///{test_db_path}", connect_args={"check_same_thread": False}
    )
    db.engine = engine
    db.init_db()
    with Session(engine) as session:
        seed_data(session)

    app = create_app()
    return TestClient(app)
