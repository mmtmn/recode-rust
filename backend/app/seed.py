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
        "summary": "Print a greeting so you know the language is running correctly.",
        "difficulty": "Beginner",
        "xp": 40,
    },
    {
        "title": "Variables & Types",
        "summary": "Declare a string, number, and boolean to learn how types are expressed.",
        "difficulty": "Beginner",
        "xp": 50,
    },
    {
        "title": "Control Flow",
        "summary": "Use a loop and an if-check to control which values are printed.",
        "difficulty": "Beginner",
        "xp": 60,
    },
    {
        "title": "Functions",
        "summary": "Write a small function that adds two numbers and prints the result.",
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
    "Variables & Types": "Create a string, number, and boolean variable, then print them.",
    "Control Flow": "Loop from 1 to 5 and print only the even numbers.",
    "Functions": "Create a function add(a, b) and print add(2, 3).",
}


TEST_HINTS = {
    "Hello World": "Expected output: Hello, Recode!",
    "Variables & Types": "Expected output should include a name, a number, and a boolean.",
    "Control Flow": "Expected output: 2 and 4 (on separate lines or separated by spaces).",
    "Functions": "Expected output: 5",
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
        "python": "name = \"Ada\"\nage = 28\nis_active = True\nprint(name, age, is_active)",
        "javascript": "const name = \"Ada\";\nconst age = 28;\nconst isActive = true;\nconsole.log(name, age, isActive);",
        "typescript": "const name: string = \"Ada\";\nconst age: number = 28;\nconst isActive: boolean = true;\nconsole.log(name, age, isActive);",
        "java": "public class Main {\n  public static void main(String[] args) {\n    String name = \"Ada\";\n    int age = 28;\n    boolean isActive = true;\n    System.out.println(name + \" \" + age + \" \" + isActive);\n  }\n}",
        "cpp": "#include <iostream>\n#include <string>\n\nint main() {\n  std::string name = \"Ada\";\n  int age = 28;\n  bool isActive = true;\n  std::cout << name << \" \" << age << \" \" << isActive;\n  return 0;\n}",
        "csharp": "using System;\n\nclass Program {\n  static void Main() {\n    string name = \"Ada\";\n    int age = 28;\n    bool isActive = true;\n    Console.WriteLine($\"{name} {age} {isActive}\");\n  }\n}",
        "go": "package main\n\nimport \"fmt\"\n\nfunc main() {\n  name := \"Ada\"\n  age := 28\n  isActive := true\n  fmt.Println(name, age, isActive)\n}",
        "rust": "fn main() {\n    let name = \"Ada\";\n    let age: i32 = 28;\n    let is_active: bool = true;\n    println!(\"{} {} {}\", name, age, is_active);\n}",
        "sql": "SELECT 'Ada' AS name, 28 AS age, TRUE AS is_active;",
    },
    "Control Flow": {
        "python": "for i in range(1, 6):\n    if i % 2 == 0:\n        print(i)",
        "javascript": "for (let i = 1; i <= 5; i++) {\n  if (i % 2 === 0) {\n    console.log(i);\n  }\n}",
        "typescript": "for (let i = 1; i <= 5; i++) {\n  if (i % 2 === 0) {\n    console.log(i);\n  }\n}",
        "java": "public class Main {\n  public static void main(String[] args) {\n    for (int i = 1; i <= 5; i++) {\n      if (i % 2 == 0) {\n        System.out.println(i);\n      }\n    }\n  }\n}",
        "cpp": "#include <iostream>\n\nint main() {\n  for (int i = 1; i <= 5; i++) {\n    if (i % 2 == 0) {\n      std::cout << i << "\n";\n    }\n  }\n  return 0;\n}",
        "csharp": "using System;\n\nclass Program {\n  static void Main() {\n    for (int i = 1; i <= 5; i++) {\n      if (i % 2 == 0) {\n        Console.WriteLine(i);\n      }\n    }\n  }\n}",
        "go": "package main\n\nimport \"fmt\"\n\nfunc main() {\n  for i := 1; i <= 5; i++ {\n    if i%2 == 0 {\n      fmt.Println(i)\n    }\n  }\n}",
        "rust": "fn main() {\n    for i in 1..=5 {\n        if i % 2 == 0 {\n            println!(\"{}\", i);\n        }\n    }\n}",
        "sql": "SELECT CASE WHEN 4 % 2 = 0 THEN 'even' ELSE 'odd' END AS label;",
    },
    "Functions": {
        "python": "def add(a, b):\n    return a + b\n\nprint(add(2, 3))",
        "javascript": "function add(a, b) {\n  return a + b;\n}\nconsole.log(add(2, 3));",
        "typescript": "function add(a: number, b: number): number {\n  return a + b;\n}\nconsole.log(add(2, 3));",
        "java": "public class Main {\n  static int add(int a, int b) {\n    return a + b;\n  }\n  public static void main(String[] args) {\n    System.out.println(add(2, 3));\n  }\n}",
        "cpp": "#include <iostream>\n\nint add(int a, int b) {\n  return a + b;\n}\n\nint main() {\n  std::cout << add(2, 3);\n  return 0;\n}",
        "csharp": "using System;\n\nclass Program {\n  static int Add(int a, int b) {\n    return a + b;\n  }\n  static void Main() {\n    Console.WriteLine(Add(2, 3));\n  }\n}",
        "go": "package main\n\nimport \"fmt\"\n\nfunc add(a int, b int) int {\n  return a + b\n}\n\nfunc main() {\n  fmt.Println(add(2, 3))\n}",
        "rust": "fn add(a: i32, b: i32) -> i32 {\n    a + b\n}\n\nfn main() {\n    println!(\"{}\", add(2, 3));\n}",
        "sql": "SELECT 2 + 3 AS result;",
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
