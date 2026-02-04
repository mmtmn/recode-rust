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
        "summary": "Print a single line to confirm the program runs.",
        "difficulty": "Beginner",
        "xp": 40,
    },
    {
        "title": "Variables & Types",
        "summary": "Store a value in a variable and print it.",
        "difficulty": "Beginner",
        "xp": 50,
    },
    {
        "title": "Control Flow",
        "summary": "Use a loop to print a few numbers in order.",
        "difficulty": "Beginner",
        "xp": 60,
    },
    {
        "title": "Functions",
        "summary": "Write a function that returns a string and print it.",
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
    "Hello World": "Print the message 'Hello, Recode!'.",
    "Variables & Types": "Create a variable called name with value 'Ada' and print it.",
    "Control Flow": "Print the numbers 1, 2, 3 using a loop.",
    "Functions": "Create a function that returns 'done' and print the result.",
}


TEST_HINTS = {
    "Hello World": "Expected output: Hello, Recode!",
    "Variables & Types": "Expected output: Ada",
    "Control Flow": "Expected output: 1 2 3 (any spacing or newlines).",
    "Functions": "Expected output: done",
}


STARTER_CODE = {
    "python": "",
    "javascript": "",
    "typescript": "",
    "java": "",
    "cpp": "",
    "csharp": "",
    "go": "",
    "rust": "",
    "sql": "",
}


SOLUTION_SNIPPETS = {
    "Hello World": {
        "python": "print(\"Hello, Recode!\")",
        "javascript": "console.log(\"Hello, Recode!\");",
        "typescript": "console.log(\"Hello, Recode!\");",
        "java": "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, Recode!\");\n  }\n}",
        "cpp": "#include <iostream>\n\nint main() {\n  std::cout << \"Hello, Recode!\";\n  return 0;\n}",
        "csharp": "using System;\n\nclass Program {\n  static void Main() {\n    Console.WriteLine(\"Hello, Recode!\");\n  }\n}",
        "go": "package main\n\nimport \"fmt\"\n\nfunc main() {\n  fmt.Println(\"Hello, Recode!\")\n}",
        "rust": "fn main() {\n    println!(\"Hello, Recode!\");\n}",
        "sql": "SELECT 'Hello, Recode!' AS message;",
    },
    "Variables & Types": {
        "python": "name = \"Ada\"\nprint(name)",
        "javascript": "const name = \"Ada\";\nconsole.log(name);",
        "typescript": "const name: string = \"Ada\";\nconsole.log(name);",
        "java": "public class Main {\n  public static void main(String[] args) {\n    String name = \"Ada\";\n    System.out.println(name);\n  }\n}",
        "cpp": "#include <iostream>\n#include <string>\n\nint main() {\n  std::string name = \"Ada\";\n  std::cout << name;\n  return 0;\n}",
        "csharp": "using System;\n\nclass Program {\n  static void Main() {\n    string name = \"Ada\";\n    Console.WriteLine(name);\n  }\n}",
        "go": "package main\n\nimport \"fmt\"\n\nfunc main() {\n  name := \"Ada\"\n  fmt.Println(name)\n}",
        "rust": "fn main() {\n    let name = \"Ada\";\n    println!(\"{}\", name);\n}",
        "sql": "SELECT 'Ada' AS name;",
    },
    "Control Flow": {
        "python": "for i in range(1, 4):\n    print(i)",
        "javascript": "for (let i = 1; i <= 3; i++) {\n  console.log(i);\n}",
        "typescript": "for (let i = 1; i <= 3; i++) {\n  console.log(i);\n}",
        "java": "public class Main {\n  public static void main(String[] args) {\n    for (int i = 1; i <= 3; i++) {\n      System.out.println(i);\n    }\n  }\n}",
        "cpp": "#include <iostream>\n\nint main() {\n  for (int i = 1; i <= 3; i++) {\n    std::cout << i << \"\\n\";\n  }\n  return 0;\n}",
        "csharp": "using System;\n\nclass Program {\n  static void Main() {\n    for (int i = 1; i <= 3; i++) {\n      Console.WriteLine(i);\n    }\n  }\n}",
        "go": "package main\n\nimport \"fmt\"\n\nfunc main() {\n  for i := 1; i <= 3; i++ {\n    fmt.Println(i)\n  }\n}",
        "rust": "fn main() {\n    for i in 1..=3 {\n        println!(\"{}\", i);\n    }\n}",
        "sql": "SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3;",
    },
    "Functions": {
        "python": "def message():\n    return \"done\"\n\nprint(message())",
        "javascript": "function message() {\n  return \"done\";\n}\nconsole.log(message());",
        "typescript": "function message(): string {\n  return \"done\";\n}\nconsole.log(message());",
        "java": "public class Main {\n  static String message() {\n    return \"done\";\n  }\n  public static void main(String[] args) {\n    System.out.println(message());\n  }\n}",
        "cpp": "#include <iostream>\n#include <string>\n\nstd::string message() {\n  return \"done\";\n}\n\nint main() {\n  std::cout << message();\n  return 0;\n}",
        "csharp": "using System;\n\nclass Program {\n  static string Message() {\n    return \"done\";\n  }\n  static void Main() {\n    Console.WriteLine(Message());\n  }\n}",
        "go": "package main\n\nimport \"fmt\"\n\nfunc message() string {\n  return \"done\"\n}\n\nfunc main() {\n  fmt.Println(message())\n}\n",
        "rust": "fn message() -> String {\n    \"done\".to_string()\n}\n\nfn main() {\n    println!(\"{}\", message());\n}\n",
        "sql": "SELECT 'done' AS result;",
    },
}


def seed_data(session: Session) -> None:
    existing_language = session.exec(select(Language).limit(1)).first()
    if existing_language:
        return

    for lang_data in LANGUAGES:
        language = Language(**lang_data)
        session.add(language)
        session.flush()

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

            solution = SOLUTION_SNIPPETS[lesson.title][language.slug]

            challenge = Challenge(
                lesson_id=lesson.id,
                title=f"{lesson.title} Challenge",
                prompt=CHALLENGE_SNIPPETS[lesson.title],
                starter_code=STARTER_CODE[language.slug],
                solution_code=solution,
                tests=TEST_HINTS[lesson.title],
                xp=lesson.xp,
            )
            session.add(challenge)

    for achievement_data in ACHIEVEMENTS:
        session.add(Achievement(**achievement_data))

    session.add(UserProfile(name="Player One"))

    session.commit()
