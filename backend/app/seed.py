from sqlmodel import Session, select

from app.domain.models import Achievement, Challenge, Language, Lesson, UserProfile


LANGUAGES = [
    {
        "name": "Python",
        "slug": "python",
        "description": "Readable, batteries-included, and ideal for quick wins.",
        "color": "#2B6CB0",
        "icon": "snake",
    },
    {
        "name": "JavaScript",
        "slug": "javascript",
        "description": "The language of the web and interactive frontends.",
        "color": "#D69E2E",
        "icon": "bolt",
    },
    {
        "name": "TypeScript",
        "slug": "typescript",
        "description": "JavaScript with types for confident scale.",
        "color": "#2C7A7B",
        "icon": "shield",
    },
    {
        "name": "Java",
        "slug": "java",
        "description": "The classic enterprise workhorse.",
        "color": "#C05621",
        "icon": "cup",
    },
    {
        "name": "C++",
        "slug": "cpp",
        "description": "Performance-first systems programming.",
        "color": "#4A5568",
        "icon": "gear",
    },
    {
        "name": "C#",
        "slug": "csharp",
        "description": "Modern tooling for games and apps.",
        "color": "#6B46C1",
        "icon": "spark",
    },
    {
        "name": "Go",
        "slug": "go",
        "description": "Simple concurrency for cloud services.",
        "color": "#2B6CB0",
        "icon": "wind",
    },
    {
        "name": "Rust",
        "slug": "rust",
        "description": "Memory safety without a garbage collector.",
        "color": "#9C4221",
        "icon": "anchor",
    },
    {
        "name": "SQL",
        "slug": "sql",
        "description": "Query and shape data with precision.",
        "color": "#2C5282",
        "icon": "database",
    },
]


LESSON_TEMPLATE = [
    {
        "title": "Hello World",
        "summary": "Print your first output and explore syntax basics.",
        "difficulty": "Beginner",
        "xp": 40,
    },
    {
        "title": "Variables & Types",
        "summary": "Store values, pick types, and name things clearly.",
        "difficulty": "Beginner",
        "xp": 50,
    },
    {
        "title": "Control Flow",
        "summary": "Branch and loop with confidence.",
        "difficulty": "Beginner",
        "xp": 60,
    },
    {
        "title": "Functions",
        "summary": "Write reusable blocks and pass arguments.",
        "difficulty": "Beginner",
        "xp": 70,
    },
]


ACHIEVEMENTS = [
    {
        "key": "first_lesson",
        "title": "First Steps",
        "description": "Complete your first lesson.",
        "icon": "spark",
        "points": 50,
    },
    {
        "key": "five_lessons",
        "title": "Syntax Explorer",
        "description": "Complete five lessons.",
        "icon": "map",
        "points": 150,
    },
    {
        "key": "streak_3",
        "title": "Streak Starter",
        "description": "Keep a 3-day learning streak.",
        "icon": "flame",
        "points": 200,
    },
    {
        "key": "xp_500",
        "title": "XP Collector",
        "description": "Earn 500 XP across lessons.",
        "icon": "star",
        "points": 250,
    },
]


CHALLENGE_SNIPPETS = {
    "Hello World": "Print a greeting message.",
    "Variables & Types": "Store a number and output it.",
    "Control Flow": "Write a loop that counts to 5.",
    "Functions": "Create a function that adds two numbers.",
}


STARTER_CODE = {
    "python": "# Write your solution here\n",
    "javascript": "// Write your solution here\n",
    "typescript": "// Write your solution here\n",
    "java": "// Write your solution here\n",
    "cpp": "// Write your solution here\n",
    "csharp": "// Write your solution here\n",
    "go": "// Write your solution here\n",
    "rust": "// Write your solution here\n",
    "sql": "-- Write your solution here\n",
}


SOLUTION_CODE = {
    "python": "print('Hello, SyntaxQuest!')",
    "javascript": "console.log('Hello, SyntaxQuest!');",
    "typescript": "console.log('Hello, SyntaxQuest!');",
    "java": "System.out.println(\"Hello, SyntaxQuest!\");",
    "cpp": "std::cout << \"Hello, SyntaxQuest!\";",
    "csharp": "Console.WriteLine(\"Hello, SyntaxQuest!\");",
    "go": "fmt.Println(\"Hello, SyntaxQuest!\");",
    "rust": "println!(\"Hello, SyntaxQuest!\");",
    "sql": "SELECT 'Hello, SyntaxQuest!';",
}


def seed_data(session: Session) -> None:
    existing_language = session.exec(select(Language).limit(1)).first()
    if existing_language:
        return

    languages = []
    for lang_data in LANGUAGES:
        language = Language(**lang_data)
        session.add(language)
        session.flush()
        languages.append(language)

        for index, lesson_data in enumerate(LESSON_TEMPLATE, start=1):
            lesson = Lesson(
                language_id=language.id,
                title=lesson_data["title"],
                summary=lesson_data["summary"],
                difficulty=lesson_data["difficulty"],
                order_index=index,
                xp=lesson_data["xp"],
            )
            session.add(lesson)
            session.flush()

            challenge = Challenge(
                lesson_id=lesson.id,
                title=f"{lesson.title} Challenge",
                prompt=CHALLENGE_SNIPPETS[lesson.title],
                starter_code=STARTER_CODE[language.slug],
                solution_code=SOLUTION_CODE[language.slug],
                tests="Verify output and syntax.",
                xp=lesson.xp,
            )
            session.add(challenge)

    for achievement_data in ACHIEVEMENTS:
        session.add(Achievement(**achievement_data))

    session.add(UserProfile(name="Player One"))

    session.commit()
