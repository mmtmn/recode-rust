from pydantic import BaseModel


class Settings(BaseModel):
    database_url: str = "sqlite:///./app.db"
    app_name: str = "SyntaxQuest"


settings = Settings()
