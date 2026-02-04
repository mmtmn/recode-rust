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


PHASES = [
    {
        "title": "Phase 1: Absolute Basics",
        "summary": "Print output and confirm the interpreter obeys you.",
        "exercise_ids": ["p1a", "p1b"],
    },
    {
        "title": "Phase 2: Strings for Real Usage",
        "summary": "Index and slice strings to extract precise data.",
        "exercise_ids": ["p2a", "p2b"],
    },
    {
        "title": "Phase 3: Control Flow",
        "summary": "Make decisions with if/else logic.",
        "exercise_ids": ["p3a", "p3b"],
    },
    {
        "title": "Phase 4: Loops",
        "summary": "Automate repetition with for and while loops.",
        "exercise_ids": ["p4a", "p4b"],
    },
    {
        "title": "Phase 5: Lists",
        "summary": "Create lists, append values, and measure size.",
        "exercise_ids": ["p5a", "p5b"],
    },
    {
        "title": "Phase 6: Tuples and Sets",
        "summary": "Lock in ordered tuples and deduplicate with sets.",
        "exercise_ids": ["p6a", "p6b"],
    },
    {
        "title": "Phase 7: Dictionaries",
        "summary": "Store key/value data and read it back quickly.",
        "exercise_ids": ["p7a", "p7b"],
    },
    {
        "title": "Phase 8: Functions",
        "summary": "Package logic into reusable functions.",
        "exercise_ids": ["p8a", "p8b"],
    },
    {
        "title": "Phase 9: Errors and Safety",
        "summary": "Handle runtime failures without crashing.",
        "exercise_ids": ["p9a", "p9b"],
    },
    {
        "title": "Phase 10: Files",
        "summary": "Write data to storage and read it back.",
        "exercise_ids": ["p10a", "p10b"],
    },
    {
        "title": "Phase 11: Modules and Packages",
        "summary": "Lean on standard libraries for power moves.",
        "exercise_ids": ["p11a", "p11b"],
    },
    {
        "title": "Phase 12: Practical Patterns",
        "summary": "Use map/filter/comprehensions to transform data.",
        "exercise_ids": ["p12a", "p12b"],
    },
    {
        "title": "Phase 13: Object-Oriented Basics",
        "summary": "Model data with classes and methods.",
        "exercise_ids": ["p13a", "p13b"],
    },
    {
        "title": "Phase 14: Small Real Projects",
        "summary": "Ship tiny utilities with real output.",
        "exercise_ids": ["p14a", "p14b"],
    },
]


EXERCISE_PROMPTS = {
    "p1a": "Print the message 'Hello, Recode!'.",
    "p1b": "Create a variable called name with value 'Ada' and print it.",
    "p2a": "Print the first character of 'recode'.",
    "p2b": "Print the last character of 'syntax'.",
    "p3a": "If 5 is greater than 3, print 'yes'.",
    "p3b": "If 3 is greater than 5 print 'yes', otherwise print 'ok'.",
    "p4a": "Use a for loop to print 1, 2, 3 on separate lines.",
    "p4b": "Use a while loop to print 1, 2, 3 on separate lines.",
    "p5a": "Create a list [1, 2], append 3, and print the last value.",
    "p5b": "Create a list of three letters and print its length.",
    "p6a": "Create a tuple (1, 2, 3) and print the first value.",
    "p6b": "Create a set with 1, 2, 2 and print its size.",
    "p7a": "Create a dictionary with name -> 'Ada' and print the value.",
    "p7b": "Add key 'lang' with value 'Python' and print it.",
    "p8a": "Write a function that returns 'done' and print it.",
    "p8b": "Write a function add(a, b) and print add(2, 3).",
    "p9a": "Handle a division by zero and print 'error'.",
    "p9b": "Handle a conversion error and print 'handled'.",
    "p10a": "Write 'recode' to a file and print it.",
    "p10b": "Append '!' to the file and print the result.",
    "p11a": "Use a math utility to print 4 (sqrt of 16).",
    "p11b": "Use a math utility to print 8 (2 to the power of 3).",
    "p12a": "Sum the even numbers in [1, 2, 3, 4] using a comprehension or map/filter.",
    "p12b": "Count pairs in [1, 2] and [3, 4] using enumerate or zip and print 2.",
    "p13a": "Create a class with a method that returns 'ready' and print it.",
    "p13b": "Create a class with a name field set to 'Ada' and print it.",
    "p14a": "Build a tiny calculator that prints 7 + 5.",
    "p14b": "Count words in 'hello world' and print 2.",
}


EXERCISE_TESTS = {
    "p1a": "Expected output: Hello, Recode!",
    "p1b": "Expected output: Ada",
    "p2a": "Expected output: r",
    "p2b": "Expected output: x",
    "p3a": "Expected output: yes",
    "p3b": "Expected output: ok",
    "p4a": "Expected output: 1\n2\n3",
    "p4b": "Expected output: 1\n2\n3",
    "p5a": "Expected output: 3",
    "p5b": "Expected output: 3",
    "p6a": "Expected output: 1",
    "p6b": "Expected output: 2",
    "p7a": "Expected output: Ada",
    "p7b": "Expected output: Python",
    "p8a": "Expected output: done",
    "p8b": "Expected output: 5",
    "p9a": "Expected output: error",
    "p9b": "Expected output: handled",
    "p10a": "Expected output: recode",
    "p10b": "Expected output: recode!",
    "p11a": "Expected output: 4",
    "p11b": "Expected output: 8",
    "p12a": "Expected output: 6",
    "p12b": "Expected output: 2",
    "p13a": "Expected output: ready",
    "p13b": "Expected output: Ada",
    "p14a": "Expected output: 12",
    "p14b": "Expected output: 2",
}


def _print_literal(language_slug: str, text: str) -> str:
    if language_slug == "python":
        return f'print("{text}")'
    if language_slug in {"javascript", "typescript"}:
        return f'console.log("{text}");'
    if language_slug == "java":
        return (
            "public class Main {\n"
            "  public static void main(String[] args) {\n"
            f"    System.out.println(\"{text}\");\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n\n"
            "int main() {\n"
            f"  std::cout << \"{text}\";\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            f"    Console.WriteLine(\"{text}\");\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import \"fmt\"\n\n"
            "func main() {\n"
            f"  fmt.Println(\"{text}\")\n"
            "}"
        )
    if language_slug == "rust":
        return f'fn main() {{\n    println!("{text}");\n}}'
    if language_slug == "sql":
        return f"SELECT '{text}' AS message;"
    raise ValueError("Unsupported language")


def _variable_print(language_slug: str, value: str) -> str:
    if language_slug == "python":
        return f'name = "{value}"\nprint(name)'
    if language_slug in {"javascript", "typescript"}:
        return f'const name = "{value}";\nconsole.log(name);'
    if language_slug == "java":
        return (
            "public class Main {\n"
            "  public static void main(String[] args) {\n"
            f"    String name = \"{value}\";\n"
            "    System.out.println(name);\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n"
            "#include <string>\n\n"
            "int main() {\n"
            f"  std::string name = \"{value}\";\n"
            "  std::cout << name;\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            f"    string name = \"{value}\";\n"
            "    Console.WriteLine(name);\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import \"fmt\"\n\n"
            "func main() {\n"
            f"  name := \"{value}\"\n"
            "  fmt.Println(name)\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "fn main() {\n"
            f"    let name = \"{value}\";\n"
            "    println!(\"{}\", name);\n"
            "}"
        )
    if language_slug == "sql":
        return f"SELECT '{value}' AS name;"
    raise ValueError("Unsupported language")


def _string_first_char(language_slug: str, text: str) -> str:
    if language_slug == "python":
        return f'text = "{text}"\nprint(text[0])'
    if language_slug in {"javascript", "typescript"}:
        return f'const text = "{text}";\nconsole.log(text[0]);'
    if language_slug == "java":
        return (
            "public class Main {\n"
            "  public static void main(String[] args) {\n"
            f"    String text = \"{text}\";\n"
            "    System.out.println(text.charAt(0));\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n"
            "#include <string>\n\n"
            "int main() {\n"
            f"  std::string text = \"{text}\";\n"
            "  std::cout << text[0];\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            f"    string text = \"{text}\";\n"
            "    Console.WriteLine(text[0]);\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import \"fmt\"\n\n"
            "func main() {\n"
            f"  text := \"{text}\"\n"
            "  fmt.Println(string(text[0]))\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "fn main() {\n"
            f"    let text = \"{text}\";\n"
            "    let ch = text.chars().next().unwrap();\n"
            "    println!(\"{}\", ch);\n"
            "}"
        )
    if language_slug == "sql":
        return f"SELECT substr('{text}', 1, 1) AS first_char;"
    raise ValueError("Unsupported language")


def _string_last_char(language_slug: str, text: str) -> str:
    if language_slug == "python":
        return f'text = "{text}"\nprint(text[-1])'
    if language_slug in {"javascript", "typescript"}:
        return (
            f'const text = "{text}";\n'
            "console.log(text[text.length - 1]);"
        )
    if language_slug == "java":
        return (
            "public class Main {\n"
            "  public static void main(String[] args) {\n"
            f"    String text = \"{text}\";\n"
            "    System.out.println(text.charAt(text.length() - 1));\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n"
            "#include <string>\n\n"
            "int main() {\n"
            f"  std::string text = \"{text}\";\n"
            "  std::cout << text[text.size() - 1];\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            f"    string text = \"{text}\";\n"
            "    Console.WriteLine(text[text.Length - 1]);\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import \"fmt\"\n\n"
            "func main() {\n"
            f"  text := \"{text}\"\n"
            "  fmt.Println(string(text[len(text)-1]))\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "fn main() {\n"
            f"    let text = \"{text}\";\n"
            "    let ch = text.chars().last().unwrap();\n"
            "    println!(\"{}\", ch);\n"
            "}"
        )
    if language_slug == "sql":
        return f"SELECT substr('{text}', -1, 1) AS last_char;"
    raise ValueError("Unsupported language")


def _string_length(language_slug: str, text: str) -> str:
    if language_slug == "python":
        return f'print(len("{text}"))'
    if language_slug in {"javascript", "typescript"}:
        return f'console.log("{text}".length);'
    if language_slug == "java":
        return (
            "public class Main {\n"
            "  public static void main(String[] args) {\n"
            f"    System.out.println(\"{text}\".length());\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n"
            "#include <string>\n\n"
            "int main() {\n"
            f"  std::string text = \"{text}\";\n"
            "  std::cout << text.length();\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            f"    Console.WriteLine(\"{text}\".Length);\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import \"fmt\"\n\n"
            "func main() {\n"
            f"  fmt.Println(len(\"{text}\"))\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "fn main() {\n"
            f"    println!(\"{{}}\", \"{text}\".len());\n"
            "}"
        )
    if language_slug == "sql":
        return f"SELECT length('{text}') AS length;"
    raise ValueError("Unsupported language")


def _if_else_yes(language_slug: str) -> str:
    if language_slug == "python":
        return "if 5 > 3:\n    print(\"yes\")"
    if language_slug in {"javascript", "typescript"}:
        return "if (5 > 3) {\n  console.log(\"yes\");\n}"
    if language_slug == "java":
        return (
            "public class Main {\n"
            "  public static void main(String[] args) {\n"
            "    if (5 > 3) {\n"
            "      System.out.println(\"yes\");\n"
            "    }\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n\n"
            "int main() {\n"
            "  if (5 > 3) {\n"
            "    std::cout << \"yes\";\n"
            "  }\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            "    if (5 > 3) {\n"
            "      Console.WriteLine(\"yes\");\n"
            "    }\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import \"fmt\"\n\n"
            "func main() {\n"
            "  if 5 > 3 {\n"
            "    fmt.Println(\"yes\")\n"
            "  }\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "fn main() {\n"
            "    if 5 > 3 {\n"
            "        println!(\"yes\");\n"
            "    }\n"
            "}"
        )
    if language_slug == "sql":
        return "SELECT 'yes' AS result;"
    raise ValueError("Unsupported language")


def _if_else_ok(language_slug: str) -> str:
    if language_slug == "python":
        return "if 3 > 5:\n    print(\"yes\")\nelse:\n    print(\"ok\")"
    if language_slug in {"javascript", "typescript"}:
        return "if (3 > 5) {\n  console.log(\"yes\");\n} else {\n  console.log(\"ok\");\n}"
    if language_slug == "java":
        return (
            "public class Main {\n"
            "  public static void main(String[] args) {\n"
            "    if (3 > 5) {\n"
            "      System.out.println(\"yes\");\n"
            "    } else {\n"
            "      System.out.println(\"ok\");\n"
            "    }\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n\n"
            "int main() {\n"
            "  if (3 > 5) {\n"
            "    std::cout << \"yes\";\n"
            "  } else {\n"
            "    std::cout << \"ok\";\n"
            "  }\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            "    if (3 > 5) {\n"
            "      Console.WriteLine(\"yes\");\n"
            "    } else {\n"
            "      Console.WriteLine(\"ok\");\n"
            "    }\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import \"fmt\"\n\n"
            "func main() {\n"
            "  if 3 > 5 {\n"
            "    fmt.Println(\"yes\")\n"
            "  } else {\n"
            "    fmt.Println(\"ok\")\n"
            "  }\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "fn main() {\n"
            "    if 3 > 5 {\n"
            "        println!(\"yes\");\n"
            "    } else {\n"
            "        println!(\"ok\");\n"
            "    }\n"
            "}"
        )
    if language_slug == "sql":
        return "SELECT 'ok' AS result;"
    raise ValueError("Unsupported language")


def _for_loop_1_3(language_slug: str) -> str:
    if language_slug == "python":
        return "for i in range(1, 4):\n    print(i)"
    if language_slug in {"javascript", "typescript"}:
        return "for (let i = 1; i <= 3; i++) {\n  console.log(i);\n}"
    if language_slug == "java":
        return (
            "public class Main {\n"
            "  public static void main(String[] args) {\n"
            "    for (int i = 1; i <= 3; i++) {\n"
            "      System.out.println(i);\n"
            "    }\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n\n"
            "int main() {\n"
            "  for (int i = 1; i <= 3; i++) {\n"
            "    std::cout << i << \"\\n\";\n"
            "  }\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            "    for (int i = 1; i <= 3; i++) {\n"
            "      Console.WriteLine(i);\n"
            "    }\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import \"fmt\"\n\n"
            "func main() {\n"
            "  for i := 1; i <= 3; i++ {\n"
            "    fmt.Println(i)\n"
            "  }\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "fn main() {\n"
            "    for i in 1..=3 {\n"
            "        println!(\"{}\", i);\n"
            "    }\n"
            "}"
        )
    if language_slug == "sql":
        return "SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3;"
    raise ValueError("Unsupported language")


def _while_loop_1_3(language_slug: str) -> str:
    if language_slug == "python":
        return "i = 1\nwhile i <= 3:\n    print(i)\n    i += 1"
    if language_slug in {"javascript", "typescript"}:
        return "let i = 1;\nwhile (i <= 3) {\n  console.log(i);\n  i += 1;\n}"
    if language_slug == "java":
        return (
            "public class Main {\n"
            "  public static void main(String[] args) {\n"
            "    int i = 1;\n"
            "    while (i <= 3) {\n"
            "      System.out.println(i);\n"
            "      i++;\n"
            "    }\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n\n"
            "int main() {\n"
            "  int i = 1;\n"
            "  while (i <= 3) {\n"
            "    std::cout << i << \"\\n\";\n"
            "    i++;\n"
            "  }\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            "    int i = 1;\n"
            "    while (i <= 3) {\n"
            "      Console.WriteLine(i);\n"
            "      i++;\n"
            "    }\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import \"fmt\"\n\n"
            "func main() {\n"
            "  i := 1\n"
            "  for i <= 3 {\n"
            "    fmt.Println(i)\n"
            "    i++\n"
            "  }\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "fn main() {\n"
            "    let mut i = 1;\n"
            "    while i <= 3 {\n"
            "        println!(\"{}\", i);\n"
            "        i += 1;\n"
            "    }\n"
            "}"
        )
    if language_slug == "sql":
        return "SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3;"
    raise ValueError("Unsupported language")


def _list_append(language_slug: str) -> str:
    if language_slug == "python":
        return "nums = [1, 2]\nnums.append(3)\nprint(nums[-1])"
    if language_slug in {"javascript", "typescript"}:
        return "const nums = [1, 2];\nnums.push(3);\nconsole.log(nums[nums.length - 1]);"
    if language_slug == "java":
        return (
            "import java.util.*;\n\n"
            "public class Main {\n"
            "  public static void main(String[] args) {\n"
            "    List<Integer> nums = new ArrayList<>(Arrays.asList(1, 2));\n"
            "    nums.add(3);\n"
            "    System.out.println(nums.get(nums.size() - 1));\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n"
            "#include <vector>\n\n"
            "int main() {\n"
            "  std::vector<int> nums = {1, 2};\n"
            "  nums.push_back(3);\n"
            "  std::cout << nums.back();\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n"
            "using System.Collections.Generic;\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            "    var nums = new List<int> { 1, 2 };\n"
            "    nums.Add(3);\n"
            "    Console.WriteLine(nums[nums.Count - 1]);\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import \"fmt\"\n\n"
            "func main() {\n"
            "  nums := []int{1, 2}\n"
            "  nums = append(nums, 3)\n"
            "  fmt.Println(nums[len(nums)-1])\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "fn main() {\n"
            "    let mut nums = vec![1, 2];\n"
            "    nums.push(3);\n"
            "    println!(\"{}\", nums[nums.len() - 1]);\n"
            "}"
        )
    if language_slug == "sql":
        return "SELECT 3 AS value;"
    raise ValueError("Unsupported language")


def _list_length(language_slug: str) -> str:
    if language_slug == "python":
        return "letters = ['a', 'b', 'c']\nprint(len(letters))"
    if language_slug in {"javascript", "typescript"}:
        return "const letters = ['a', 'b', 'c'];\nconsole.log(letters.length);"
    if language_slug == "java":
        return (
            "import java.util.*;\n\n"
            "public class Main {\n"
            "  public static void main(String[] args) {\n"
            "    List<String> letters = Arrays.asList(\"a\", \"b\", \"c\");\n"
            "    System.out.println(letters.size());\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n"
            "#include <vector>\n"
            "#include <string>\n\n"
            "int main() {\n"
            "  std::vector<std::string> letters = {\"a\", \"b\", \"c\"};\n"
            "  std::cout << letters.size();\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n"
            "using System.Collections.Generic;\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            "    var letters = new List<string> { \"a\", \"b\", \"c\" };\n"
            "    Console.WriteLine(letters.Count);\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import \"fmt\"\n\n"
            "func main() {\n"
            "  letters := []string{\"a\", \"b\", \"c\"}\n"
            "  fmt.Println(len(letters))\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "fn main() {\n"
            "    let letters = vec![\"a\", \"b\", \"c\"];\n"
            "    println!(\"{}\", letters.len());\n"
            "}"
        )
    if language_slug == "sql":
        return "SELECT 3 AS length;"
    raise ValueError("Unsupported language")


def _tuple_first(language_slug: str) -> str:
    if language_slug == "python":
        return "data = (1, 2, 3)\nprint(data[0])"
    if language_slug in {"javascript", "typescript"}:
        return "const data = [1, 2, 3];\nconsole.log(data[0]);"
    if language_slug == "java":
        return (
            "public class Main {\n"
            "  public static void main(String[] args) {\n"
            "    int[] data = {1, 2, 3};\n"
            "    System.out.println(data[0]);\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n"
            "#include <tuple>\n\n"
            "int main() {\n"
            "  auto data = std::make_tuple(1, 2, 3);\n"
            "  std::cout << std::get<0>(data);\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            "    var data = (1, 2, 3);\n"
            "    Console.WriteLine(data.Item1);\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import \"fmt\"\n\n"
            "func main() {\n"
            "  data := []int{1, 2, 3}\n"
            "  fmt.Println(data[0])\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "fn main() {\n"
            "    let data = (1, 2, 3);\n"
            "    println!(\"{}\", data.0);\n"
            "}"
        )
    if language_slug == "sql":
        return "SELECT 1 AS value;"
    raise ValueError("Unsupported language")


def _set_size(language_slug: str) -> str:
    if language_slug == "python":
        return "values = {1, 2, 2}\nprint(len(values))"
    if language_slug in {"javascript", "typescript"}:
        return "const values = new Set([1, 2, 2]);\nconsole.log(values.size);"
    if language_slug == "java":
        return (
            "import java.util.*;\n\n"
            "public class Main {\n"
            "  public static void main(String[] args) {\n"
            "    Set<Integer> values = new HashSet<>(Arrays.asList(1, 2, 2));\n"
            "    System.out.println(values.size());\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n"
            "#include <set>\n\n"
            "int main() {\n"
            "  std::set<int> values = {1, 2, 2};\n"
            "  std::cout << values.size();\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n"
            "using System.Collections.Generic;\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            "    var values = new HashSet<int> { 1, 2, 2 };\n"
            "    Console.WriteLine(values.Count);\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import \"fmt\"\n\n"
            "func main() {\n"
            "  values := map[int]bool{1: true, 2: true}\n"
            "  fmt.Println(len(values))\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "use std::collections::HashSet;\n\n"
            "fn main() {\n"
            "    let values: HashSet<i32> = [1, 2, 2].iter().cloned().collect();\n"
            "    println!(\"{}\", values.len());\n"
            "}"
        )
    if language_slug == "sql":
        return "SELECT 2 AS size;"
    raise ValueError("Unsupported language")


def _dict_value(language_slug: str) -> str:
    if language_slug == "python":
        return "data = {'name': 'Ada'}\nprint(data['name'])"
    if language_slug in {"javascript", "typescript"}:
        return "const data = { name: 'Ada' };\nconsole.log(data.name);"
    if language_slug == "java":
        return (
            "import java.util.*;\n\n"
            "public class Main {\n"
            "  public static void main(String[] args) {\n"
            "    Map<String, String> data = new HashMap<>();\n"
            "    data.put(\"name\", \"Ada\");\n"
            "    System.out.println(data.get(\"name\"));\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n"
            "#include <string>\n"
            "#include <unordered_map>\n\n"
            "int main() {\n"
            "  std::unordered_map<std::string, std::string> data;\n"
            "  data[\"name\"] = \"Ada\";\n"
            "  std::cout << data[\"name\"];\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n"
            "using System.Collections.Generic;\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            "    var data = new Dictionary<string, string>();\n"
            "    data[\"name\"] = \"Ada\";\n"
            "    Console.WriteLine(data[\"name\"]);\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import \"fmt\"\n\n"
            "func main() {\n"
            "  data := map[string]string{\"name\": \"Ada\"}\n"
            "  fmt.Println(data[\"name\"])\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "use std::collections::HashMap;\n\n"
            "fn main() {\n"
            "    let mut data = HashMap::new();\n"
            "    data.insert(\"name\", \"Ada\");\n"
            "    println!(\"{}\", data.get(\"name\").unwrap());\n"
            "}"
        )
    if language_slug == "sql":
        return "SELECT 'Ada' AS name;"
    raise ValueError("Unsupported language")


def _dict_update(language_slug: str) -> str:
    if language_slug == "python":
        return "data = {'lang': 'Python'}\nprint(data['lang'])"
    if language_slug in {"javascript", "typescript"}:
        return "const data = {};\ndata.lang = 'Python';\nconsole.log(data.lang);"
    if language_slug == "java":
        return (
            "import java.util.*;\n\n"
            "public class Main {\n"
            "  public static void main(String[] args) {\n"
            "    Map<String, String> data = new HashMap<>();\n"
            "    data.put(\"lang\", \"Python\");\n"
            "    System.out.println(data.get(\"lang\"));\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n"
            "#include <string>\n"
            "#include <unordered_map>\n\n"
            "int main() {\n"
            "  std::unordered_map<std::string, std::string> data;\n"
            "  data[\"lang\"] = \"Python\";\n"
            "  std::cout << data[\"lang\"];\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n"
            "using System.Collections.Generic;\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            "    var data = new Dictionary<string, string>();\n"
            "    data[\"lang\"] = \"Python\";\n"
            "    Console.WriteLine(data[\"lang\"]);\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import \"fmt\"\n\n"
            "func main() {\n"
            "  data := map[string]string{}\n"
            "  data[\"lang\"] = \"Python\"\n"
            "  fmt.Println(data[\"lang\"])\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "use std::collections::HashMap;\n\n"
            "fn main() {\n"
            "    let mut data = HashMap::new();\n"
            "    data.insert(\"lang\", \"Python\");\n"
            "    println!(\"{}\", data.get(\"lang\").unwrap());\n"
            "}"
        )
    if language_slug == "sql":
        return "SELECT 'Python' AS lang;"
    raise ValueError("Unsupported language")


def _function_return(language_slug: str, value: str) -> str:
    if language_slug == "python":
        return f"def message():\n    return \"{value}\"\n\nprint(message())"
    if language_slug in {"javascript", "typescript"}:
        return f"function message() {{\n  return \"{value}\";\n}}\nconsole.log(message());"
    if language_slug == "java":
        return (
            "public class Main {\n"
            f"  static String message() {{\n    return \"{value}\";\n  }}\n"
            "  public static void main(String[] args) {\n"
            "    System.out.println(message());\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n"
            "#include <string>\n\n"
            f"std::string message() {{\n  return \"{value}\";\n}}\n\n"
            "int main() {\n"
            "  std::cout << message();\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n\n"
            "class Program {\n"
            f"  static string Message() {{\n    return \"{value}\";\n  }}\n"
            "  static void Main() {\n"
            "    Console.WriteLine(Message());\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import \"fmt\"\n\n"
            f"func message() string {{\n  return \"{value}\"\n}}\n\n"
            "func main() {\n  fmt.Println(message())\n}"
        )
    if language_slug == "rust":
        return (
            "fn message() -> String {\n"
            f"    \"{value}\".to_string()\n"
            "}\n\n"
            "fn main() {\n"
            "    println!(\"{}\", message());\n"
            "}"
        )
    if language_slug == "sql":
        return f"SELECT '{value}' AS result;"
    raise ValueError("Unsupported language")


def _function_add(language_slug: str) -> str:
    if language_slug == "python":
        return "def add(a, b):\n    return a + b\n\nprint(add(2, 3))"
    if language_slug in {"javascript", "typescript"}:
        return "function add(a, b) {\n  return a + b;\n}\nconsole.log(add(2, 3));"
    if language_slug == "java":
        return (
            "public class Main {\n"
            "  static int add(int a, int b) {\n    return a + b;\n  }\n"
            "  public static void main(String[] args) {\n"
            "    System.out.println(add(2, 3));\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n\n"
            "int add(int a, int b) {\n  return a + b;\n}\n\n"
            "int main() {\n"
            "  std::cout << add(2, 3);\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n\n"
            "class Program {\n"
            "  static int Add(int a, int b) {\n    return a + b;\n  }\n"
            "  static void Main() {\n"
            "    Console.WriteLine(Add(2, 3));\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import \"fmt\"\n\n"
            "func add(a int, b int) int {\n  return a + b\n}\n\n"
            "func main() {\n  fmt.Println(add(2, 3))\n}"
        )
    if language_slug == "rust":
        return (
            "fn add(a: i32, b: i32) -> i32 {\n    a + b\n}\n\n"
            "fn main() {\n    println!(\"{}\", add(2, 3));\n}"
        )
    if language_slug == "sql":
        return "SELECT 2 + 3 AS sum;"
    raise ValueError("Unsupported language")


def _handle_div_zero(language_slug: str) -> str:
    if language_slug == "python":
        return "try:\n    1 / 0\nexcept ZeroDivisionError:\n    print(\"error\")"
    if language_slug in {"javascript", "typescript"}:
        return "try {\n  throw new Error('fail');\n} catch (err) {\n  console.log('error');\n}"
    if language_slug == "java":
        return (
            "public class Main {\n"
            "  public static void main(String[] args) {\n"
            "    try {\n"
            "      int value = 1 / 0;\n"
            "    } catch (ArithmeticException ex) {\n"
            "      System.out.println(\"error\");\n"
            "    }\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n\n"
            "int main() {\n"
            "  try {\n"
            "    throw std::runtime_error(\"fail\");\n"
            "  } catch (...) {\n"
            "    std::cout << \"error\";\n"
            "  }\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            "    try {\n"
            "      var value = 1 / 0;\n"
            "    } catch (DivideByZeroException) {\n"
            "      Console.WriteLine(\"error\");\n"
            "    }\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import (\n  \"fmt\"\n  \"strconv\"\n)\n\n"
            "func main() {\n"
            "  _, err := strconv.Atoi(\"x\")\n"
            "  if err != nil {\n"
            "    fmt.Println(\"error\")\n"
            "  }\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "fn main() {\n"
            "    let parsed = \"x\".parse::<i32>();\n"
            "    match parsed {\n"
            "        Ok(_) => println!(\"ok\"),\n"
            "        Err(_) => println!(\"error\"),\n"
            "    }\n"
            "}"
        )
    if language_slug == "sql":
        return "SELECT 'error' AS result;"
    raise ValueError("Unsupported language")


def _handle_parse_error(language_slug: str) -> str:
    if language_slug == "python":
        return "try:\n    int('x')\nexcept ValueError:\n    print(\"handled\")"
    if language_slug in {"javascript", "typescript"}:
        return "try {\n  JSON.parse('{oops}');\n} catch (err) {\n  console.log('handled');\n}"
    if language_slug == "java":
        return (
            "public class Main {\n"
            "  public static void main(String[] args) {\n"
            "    try {\n"
            "      Integer.parseInt(\"x\");\n"
            "    } catch (NumberFormatException ex) {\n"
            "      System.out.println(\"handled\");\n"
            "    }\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n"
            "#include <string>\n\n"
            "int main() {\n"
            "  try {\n"
            "    std::stoi(\"x\");\n"
            "  } catch (...) {\n"
            "    std::cout << \"handled\";\n"
            "  }\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            "    try {\n"
            "      int.Parse(\"x\");\n"
            "    } catch (FormatException) {\n"
            "      Console.WriteLine(\"handled\");\n"
            "    }\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import (\n  \"fmt\"\n  \"strconv\"\n)\n\n"
            "func main() {\n"
            "  _, err := strconv.Atoi(\"x\")\n"
            "  if err != nil {\n"
            "    fmt.Println(\"handled\")\n"
            "  }\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "fn main() {\n"
            "    match \"x\".parse::<i32>() {\n"
            "        Ok(_) => println!(\"ok\"),\n"
            "        Err(_) => println!(\"handled\"),\n"
            "    }\n"
            "}"
        )
    if language_slug == "sql":
        return "SELECT 'handled' AS result;"
    raise ValueError("Unsupported language")


def _file_write_read(language_slug: str) -> str:
    if language_slug == "python":
        return (
            "with open('note.txt', 'w') as handle:\n"
            "    handle.write('recode')\n\n"
            "with open('note.txt', 'r') as handle:\n"
            "    print(handle.read())"
        )
    if language_slug == "javascript":
        return (
            "const fs = require('fs');\n"
            "fs.writeFileSync('note.txt', 'recode');\n"
            "const content = fs.readFileSync('note.txt', 'utf8');\n"
            "console.log(content);"
        )
    if language_slug == "typescript":
        return (
            "import * as fs from 'fs';\n"
            "fs.writeFileSync('note.txt', 'recode');\n"
            "const content = fs.readFileSync('note.txt', 'utf8');\n"
            "console.log(content);"
        )
    if language_slug == "java":
        return (
            "import java.nio.file.*;\n\n"
            "public class Main {\n"
            "  public static void main(String[] args) throws Exception {\n"
            "    Path path = Path.of(\"note.txt\");\n"
            "    Files.writeString(path, \"recode\");\n"
            "    String content = Files.readString(path);\n"
            "    System.out.println(content);\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <fstream>\n"
            "#include <iostream>\n\n"
            "int main() {\n"
            "  std::ofstream out(\"note.txt\");\n"
            "  out << \"recode\";\n"
            "  out.close();\n\n"
            "  std::ifstream in(\"note.txt\");\n"
            "  std::string content;\n"
            "  in >> content;\n"
            "  std::cout << content;\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n"
            "using System.IO;\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            "    File.WriteAllText(\"note.txt\", \"recode\");\n"
            "    var content = File.ReadAllText(\"note.txt\");\n"
            "    Console.WriteLine(content);\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import (\n  \"fmt\"\n  \"os\"\n)\n\n"
            "func main() {\n"
            "  os.WriteFile(\"note.txt\", []byte(\"recode\"), 0644)\n"
            "  content, _ := os.ReadFile(\"note.txt\")\n"
            "  fmt.Println(string(content))\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "use std::fs;\n\n"
            "fn main() {\n"
            "    fs::write(\"note.txt\", \"recode\").unwrap();\n"
            "    let content = fs::read_to_string(\"note.txt\").unwrap();\n"
            "    println!(\"{}\", content);\n"
            "}"
        )
    if language_slug == "sql":
        return (
            "CREATE TABLE notes (text TEXT);\n"
            "INSERT INTO notes VALUES ('recode');\n"
            "SELECT text FROM notes;"
        )
    raise ValueError("Unsupported language")


def _file_append(language_slug: str) -> str:
    if language_slug == "python":
        return (
            "with open('note.txt', 'w') as handle:\n"
            "    handle.write('recode')\n\n"
            "with open('note.txt', 'a') as handle:\n"
            "    handle.write('!')\n\n"
            "with open('note.txt', 'r') as handle:\n"
            "    print(handle.read())"
        )
    if language_slug == "javascript":
        return (
            "const fs = require('fs');\n"
            "fs.writeFileSync('note.txt', 'recode');\n"
            "fs.appendFileSync('note.txt', '!');\n"
            "const content = fs.readFileSync('note.txt', 'utf8');\n"
            "console.log(content);"
        )
    if language_slug == "typescript":
        return (
            "import * as fs from 'fs';\n"
            "fs.writeFileSync('note.txt', 'recode');\n"
            "fs.appendFileSync('note.txt', '!');\n"
            "const content = fs.readFileSync('note.txt', 'utf8');\n"
            "console.log(content);"
        )
    if language_slug == "java":
        return (
            "import java.nio.file.*;\n"
            "import java.nio.file.StandardOpenOption;\n\n"
            "public class Main {\n"
            "  public static void main(String[] args) throws Exception {\n"
            "    Path path = Path.of(\"note.txt\");\n"
            "    Files.writeString(path, \"recode\");\n"
            "    Files.writeString(path, \"!\", StandardOpenOption.APPEND);\n"
            "    String content = Files.readString(path);\n"
            "    System.out.println(content);\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <fstream>\n"
            "#include <iostream>\n\n"
            "int main() {\n"
            "  std::ofstream out(\"note.txt\");\n"
            "  out << \"recode\";\n"
            "  out.close();\n\n"
            "  std::ofstream append(\"note.txt\", std::ios::app);\n"
            "  append << \"!\";\n"
            "  append.close();\n\n"
            "  std::ifstream in(\"note.txt\");\n"
            "  std::string content;\n"
            "  in >> content;\n"
            "  std::cout << content;\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n"
            "using System.IO;\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            "    File.WriteAllText(\"note.txt\", \"recode\");\n"
            "    File.AppendAllText(\"note.txt\", \"!\");\n"
            "    var content = File.ReadAllText(\"note.txt\");\n"
            "    Console.WriteLine(content);\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import (\n  \"fmt\"\n  \"os\"\n)\n\n"
            "func main() {\n"
            "  os.WriteFile(\"note.txt\", []byte(\"recode\"), 0644)\n"
            "  file, _ := os.OpenFile(\"note.txt\", os.O_APPEND|os.O_WRONLY, 0644)\n"
            "  file.WriteString(\"!\")\n"
            "  file.Close()\n"
            "  content, _ := os.ReadFile(\"note.txt\")\n"
            "  fmt.Println(string(content))\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "use std::fs;\n"
            "use std::fs::OpenOptions;\n"
            "use std::io::Write;\n\n"
            "fn main() {\n"
            "    fs::write(\"note.txt\", \"recode\").unwrap();\n"
            "    let mut file = OpenOptions::new().append(true).open(\"note.txt\").unwrap();\n"
            "    file.write_all(b\"!\").unwrap();\n"
            "    let content = fs::read_to_string(\"note.txt\").unwrap();\n"
            "    println!(\"{}\", content);\n"
            "}"
        )
    if language_slug == "sql":
        return (
            "CREATE TABLE notes (text TEXT);\n"
            "INSERT INTO notes VALUES ('recode');\n"
            "UPDATE notes SET text = text || '!';\n"
            "SELECT text FROM notes;"
        )
    raise ValueError("Unsupported language")


def _math_sqrt(language_slug: str) -> str:
    if language_slug == "python":
        return "import math\nprint(int(math.sqrt(16)))"
    if language_slug in {"javascript", "typescript"}:
        return "console.log(Math.sqrt(16));"
    if language_slug == "java":
        return (
            "public class Main {\n"
            "  public static void main(String[] args) {\n"
            "    System.out.println((int) Math.sqrt(16));\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n"
            "#include <cmath>\n\n"
            "int main() {\n"
            "  std::cout << static_cast<int>(std::sqrt(16));\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            "    Console.WriteLine((int) Math.Sqrt(16));\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import (\n  \"fmt\"\n  \"math\"\n)\n\n"
            "func main() {\n"
            "  fmt.Println(int(math.Sqrt(16)))\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "fn main() {\n"
            "    let value = (16.0_f64).sqrt() as i32;\n"
            "    println!(\"{}\", value);\n"
            "}"
        )
    if language_slug == "sql":
        return "SELECT 4 AS result;"
    raise ValueError("Unsupported language")


def _math_pow(language_slug: str) -> str:
    if language_slug == "python":
        return "import math\nprint(int(math.pow(2, 3)))"
    if language_slug in {"javascript", "typescript"}:
        return "console.log(Math.pow(2, 3));"
    if language_slug == "java":
        return (
            "public class Main {\n"
            "  public static void main(String[] args) {\n"
            "    System.out.println((int) Math.pow(2, 3));\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n"
            "#include <cmath>\n\n"
            "int main() {\n"
            "  std::cout << static_cast<int>(std::pow(2, 3));\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            "    Console.WriteLine((int) Math.Pow(2, 3));\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import (\n  \"fmt\"\n  \"math\"\n)\n\n"
            "func main() {\n"
            "  fmt.Println(int(math.Pow(2, 3)))\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "fn main() {\n"
            "    let value = 2_i32.pow(3);\n"
            "    println!(\"{}\", value);\n"
            "}"
        )
    if language_slug == "sql":
        return "SELECT 8 AS result;"
    raise ValueError("Unsupported language")


def _pattern_even_sum(language_slug: str) -> str:
    if language_slug == "python":
        return (
            "nums = [1, 2, 3, 4]\n"
            "evens = [n for n in nums if n % 2 == 0]\n"
            "print(sum(evens))"
        )
    if language_slug in {"javascript", "typescript"}:
        return (
            "const nums = [1, 2, 3, 4];\n"
            "const sum = nums.filter(n => n % 2 === 0).reduce((a, b) => a + b, 0);\n"
            "console.log(sum);"
        )
    if language_slug == "java":
        return (
            "public class Main {\n"
            "  public static void main(String[] args) {\n"
            "    int[] nums = {1, 2, 3, 4};\n"
            "    int sum = 0;\n"
            "    for (int n : nums) {\n"
            "      if (n % 2 == 0) {\n"
            "        sum += n;\n"
            "      }\n"
            "    }\n"
            "    System.out.println(sum);\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n\n"
            "int main() {\n"
            "  int nums[] = {1, 2, 3, 4};\n"
            "  int sum = 0;\n"
            "  for (int n : nums) {\n"
            "    if (n % 2 == 0) {\n"
            "      sum += n;\n"
            "    }\n"
            "  }\n"
            "  std::cout << sum;\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            "    int[] nums = {1, 2, 3, 4};\n"
            "    int sum = 0;\n"
            "    foreach (int n in nums) {\n"
            "      if (n % 2 == 0) {\n"
            "        sum += n;\n"
            "      }\n"
            "    }\n"
            "    Console.WriteLine(sum);\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import \"fmt\"\n\n"
            "func main() {\n"
            "  nums := []int{1, 2, 3, 4}\n"
            "  sum := 0\n"
            "  for _, n := range nums {\n"
            "    if n%2 == 0 {\n"
            "      sum += n\n"
            "    }\n"
            "  }\n"
            "  fmt.Println(sum)\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "fn main() {\n"
            "    let nums = [1, 2, 3, 4];\n"
            "    let mut sum = 0;\n"
            "    for n in nums {\n"
            "        if n % 2 == 0 {\n"
            "            sum += n;\n"
            "        }\n"
            "    }\n"
            "    println!(\"{}\", sum);\n"
            "}"
        )
    if language_slug == "sql":
        return "SELECT 6 AS sum;"
    raise ValueError("Unsupported language")


def _pattern_pair_count(language_slug: str) -> str:
    if language_slug == "python":
        return (
            "a = [1, 2]\n"
            "b = [3, 4]\n"
            "count = 0\n"
            "for _ in zip(a, b):\n"
            "    count += 1\n"
            "print(count)"
        )
    if language_slug in {"javascript", "typescript"}:
        return (
            "const a = [1, 2];\n"
            "const b = [3, 4];\n"
            "const count = Math.min(a.length, b.length);\n"
            "console.log(count);"
        )
    if language_slug == "java":
        return (
            "public class Main {\n"
            "  public static void main(String[] args) {\n"
            "    int[] a = {1, 2};\n"
            "    int[] b = {3, 4};\n"
            "    int count = Math.min(a.length, b.length);\n"
            "    System.out.println(count);\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n\n"
            "int main() {\n"
            "  int a[] = {1, 2};\n"
            "  int b[] = {3, 4};\n"
            "  int len_a = sizeof(a) / sizeof(int);\n"
            "  int len_b = sizeof(b) / sizeof(int);\n"
            "  int count = len_a < len_b ? len_a : len_b;\n"
            "  std::cout << count;\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            "    int[] a = {1, 2};\n"
            "    int[] b = {3, 4};\n"
            "    int count = Math.Min(a.Length, b.Length);\n"
            "    Console.WriteLine(count);\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import \"fmt\"\n\n"
            "func main() {\n"
            "  a := []int{1, 2}\n"
            "  b := []int{3, 4}\n"
            "  count := len(a)\n"
            "  if len(b) < count {\n"
            "    count = len(b)\n"
            "  }\n"
            "  fmt.Println(count)\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "fn main() {\n"
            "    let a = [1, 2];\n"
            "    let b = [3, 4];\n"
            "    let count = if a.len() < b.len() { a.len() } else { b.len() };\n"
            "    println!(\"{}\", count);\n"
            "}"
        )
    if language_slug == "sql":
        return "SELECT 2 AS count;"
    raise ValueError("Unsupported language")


def _class_method(language_slug: str) -> str:
    if language_slug == "python":
        return (
            "class Bot:\n"
            "    def ready(self):\n"
            "        return 'ready'\n\n"
            "bot = Bot()\n"
            "print(bot.ready())"
        )
    if language_slug in {"javascript", "typescript"}:
        return (
            "class Bot {\n"
            "  ready() {\n"
            "    return 'ready';\n"
            "  }\n"
            "}\n"
            "const bot = new Bot();\n"
            "console.log(bot.ready());"
        )
    if language_slug == "java":
        return (
            "public class Main {\n"
            "  static class Bot {\n"
            "    String ready() {\n"
            "      return \"ready\";\n"
            "    }\n"
            "  }\n"
            "  public static void main(String[] args) {\n"
            "    Bot bot = new Bot();\n"
            "    System.out.println(bot.ready());\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n"
            "#include <string>\n\n"
            "class Bot {\n"
            "public:\n"
            "  std::string ready() {\n"
            "    return \"ready\";\n"
            "  }\n"
            "};\n\n"
            "int main() {\n"
            "  Bot bot;\n"
            "  std::cout << bot.ready();\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n\n"
            "class Bot {\n"
            "  public string Ready() {\n"
            "    return \"ready\";\n"
            "  }\n"
            "}\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            "    var bot = new Bot();\n"
            "    Console.WriteLine(bot.Ready());\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import \"fmt\"\n\n"
            "type Bot struct{}\n\n"
            "func (b Bot) Ready() string {\n"
            "  return \"ready\"\n"
            "}\n\n"
            "func main() {\n"
            "  bot := Bot{}\n"
            "  fmt.Println(bot.Ready())\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "struct Bot;\n\n"
            "impl Bot {\n"
            "    fn ready(&self) -> String {\n"
            "        \"ready\".to_string()\n"
            "    }\n"
            "}\n\n"
            "fn main() {\n"
            "    let bot = Bot;\n"
            "    println!(\"{}\", bot.ready());\n"
            "}"
        )
    if language_slug == "sql":
        return "SELECT 'ready' AS status;"
    raise ValueError("Unsupported language")


def _class_property(language_slug: str) -> str:
    if language_slug == "python":
        return (
            "class User:\n"
            "    def __init__(self, name):\n"
            "        self.name = name\n\n"
            "user = User('Ada')\n"
            "print(user.name)"
        )
    if language_slug in {"javascript", "typescript"}:
        return (
            "class User {\n"
            "  constructor(name) {\n"
            "    this.name = name;\n"
            "  }\n"
            "}\n"
            "const user = new User('Ada');\n"
            "console.log(user.name);"
        )
    if language_slug == "java":
        return (
            "public class Main {\n"
            "  static class User {\n"
            "    String name;\n"
            "    User(String name) {\n"
            "      this.name = name;\n"
            "    }\n"
            "  }\n"
            "  public static void main(String[] args) {\n"
            "    User user = new User(\"Ada\");\n"
            "    System.out.println(user.name);\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n"
            "#include <string>\n\n"
            "class User {\n"
            "public:\n"
            "  std::string name;\n"
            "  User(std::string name) : name(name) {}\n"
            "};\n\n"
            "int main() {\n"
            "  User user(\"Ada\");\n"
            "  std::cout << user.name;\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n\n"
            "class User {\n"
            "  public string Name { get; }\n"
            "  public User(string name) {\n"
            "    Name = name;\n"
            "  }\n"
            "}\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            "    var user = new User(\"Ada\");\n"
            "    Console.WriteLine(user.Name);\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import \"fmt\"\n\n"
            "type User struct {\n"
            "  Name string\n"
            "}\n\n"
            "func main() {\n"
            "  user := User{Name: \"Ada\"}\n"
            "  fmt.Println(user.Name)\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "struct User {\n"
            "    name: String,\n"
            "}\n\n"
            "fn main() {\n"
            "    let user = User { name: \"Ada\".to_string() };\n"
            "    println!(\"{}\", user.name);\n"
            "}"
        )
    if language_slug == "sql":
        return "SELECT 'Ada' AS name;"
    raise ValueError("Unsupported language")


def _project_calculator(language_slug: str) -> str:
    if language_slug == "python":
        return "result = 7 + 5\nprint(result)"
    if language_slug in {"javascript", "typescript"}:
        return "const result = 7 + 5;\nconsole.log(result);"
    if language_slug == "java":
        return (
            "public class Main {\n"
            "  public static void main(String[] args) {\n"
            "    int result = 7 + 5;\n"
            "    System.out.println(result);\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n\n"
            "int main() {\n"
            "  int result = 7 + 5;\n"
            "  std::cout << result;\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            "    int result = 7 + 5;\n"
            "    Console.WriteLine(result);\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import \"fmt\"\n\n"
            "func main() {\n"
            "  result := 7 + 5\n"
            "  fmt.Println(result)\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "fn main() {\n"
            "    let result = 7 + 5;\n"
            "    println!(\"{}\", result);\n"
            "}"
        )
    if language_slug == "sql":
        return "SELECT 7 + 5 AS result;"
    raise ValueError("Unsupported language")


def _project_word_count(language_slug: str) -> str:
    if language_slug == "python":
        return "text = 'hello world'\nprint(len(text.split()))"
    if language_slug in {"javascript", "typescript"}:
        return "const text = 'hello world';\nconsole.log(text.split(' ').length);"
    if language_slug == "java":
        return (
            "public class Main {\n"
            "  public static void main(String[] args) {\n"
            "    String text = \"hello world\";\n"
            "    System.out.println(text.split(\" \").length);\n"
            "  }\n"
            "}"
        )
    if language_slug == "cpp":
        return (
            "#include <iostream>\n"
            "#include <sstream>\n\n"
            "int main() {\n"
            "  std::string text = \"hello world\";\n"
            "  std::istringstream stream(text);\n"
            "  int count = 0;\n"
            "  std::string word;\n"
            "  while (stream >> word) {\n"
            "    count++;\n"
            "  }\n"
            "  std::cout << count;\n"
            "  return 0;\n"
            "}"
        )
    if language_slug == "csharp":
        return (
            "using System;\n\n"
            "class Program {\n"
            "  static void Main() {\n"
            "    string text = \"hello world\";\n"
            "    Console.WriteLine(text.Split(' ').Length);\n"
            "  }\n"
            "}"
        )
    if language_slug == "go":
        return (
            "package main\n\n"
            "import (\n  \"fmt\"\n  \"strings\"\n)\n\n"
            "func main() {\n"
            "  text := \"hello world\"\n"
            "  fmt.Println(len(strings.Split(text, \" \")))\n"
            "}"
        )
    if language_slug == "rust":
        return (
            "fn main() {\n"
            "    let text = \"hello world\";\n"
            "    let count = text.split_whitespace().count();\n"
            "    println!(\"{}\", count);\n"
            "}"
        )
    if language_slug == "sql":
        return "SELECT 2 AS count;"
    raise ValueError("Unsupported language")


def solution_for(exercise_id: str, language_slug: str) -> str:
    if exercise_id == "p1a":
        return _print_literal(language_slug, "Hello, Recode!")
    if exercise_id == "p1b":
        return _variable_print(language_slug, "Ada")
    if exercise_id == "p2a":
        return _string_first_char(language_slug, "recode")
    if exercise_id == "p2b":
        return _string_last_char(language_slug, "syntax")
    if exercise_id == "p3a":
        return _if_else_yes(language_slug)
    if exercise_id == "p3b":
        return _if_else_ok(language_slug)
    if exercise_id == "p4a":
        return _for_loop_1_3(language_slug)
    if exercise_id == "p4b":
        return _while_loop_1_3(language_slug)
    if exercise_id == "p5a":
        return _list_append(language_slug)
    if exercise_id == "p5b":
        return _list_length(language_slug)
    if exercise_id == "p6a":
        return _tuple_first(language_slug)
    if exercise_id == "p6b":
        return _set_size(language_slug)
    if exercise_id == "p7a":
        return _dict_value(language_slug)
    if exercise_id == "p7b":
        return _dict_update(language_slug)
    if exercise_id == "p8a":
        return _function_return(language_slug, "done")
    if exercise_id == "p8b":
        return _function_add(language_slug)
    if exercise_id == "p9a":
        return _handle_div_zero(language_slug)
    if exercise_id == "p9b":
        return _handle_parse_error(language_slug)
    if exercise_id == "p10a":
        return _file_write_read(language_slug)
    if exercise_id == "p10b":
        return _file_append(language_slug)
    if exercise_id == "p11a":
        return _math_sqrt(language_slug)
    if exercise_id == "p11b":
        return _math_pow(language_slug)
    if exercise_id == "p12a":
        return _pattern_even_sum(language_slug)
    if exercise_id == "p12b":
        return _pattern_pair_count(language_slug)
    if exercise_id == "p13a":
        return _class_method(language_slug)
    if exercise_id == "p13b":
        return _class_property(language_slug)
    if exercise_id == "p14a":
        return _project_calculator(language_slug)
    if exercise_id == "p14b":
        return _project_word_count(language_slug)
    raise ValueError(f"Unknown exercise_id: {exercise_id}")


def seed_data(session: Session) -> None:
    existing_language = session.exec(select(Language).limit(1)).first()
    if existing_language:
        return

    base_xp = 40
    xp_step = 5

    for lang_data in LANGUAGES:
        language = Language(**lang_data)
        session.add(language)
        session.flush()

        order_index = 1
        for phase_index, phase in enumerate(PHASES, start=1):
            phase_xp = base_xp + (phase_index - 1) * xp_step
            for lesson_offset, exercise_id in enumerate(phase["exercise_ids"], start=1):
                suffix = "A" if lesson_offset == 1 else "B"
                lesson_title = f"{phase['title']} {suffix}"
                lesson = Lesson(
                    language_id=language.id,
                    title=lesson_title,
                    summary=phase["summary"],
                    difficulty="Beginner",
                    order_index=order_index,
                    xp=phase_xp,
                )
                session.add(lesson)
                session.flush()

                solution = solution_for(exercise_id, language.slug)
                prompt = EXERCISE_PROMPTS[exercise_id]
                tests = EXERCISE_TESTS[exercise_id]

                challenge = Challenge(
                    lesson_id=lesson.id,
                    title=f"{lesson.title} Challenge",
                    prompt=prompt,
                    starter_code="",
                    solution_code=solution,
                    tests=tests,
                    xp=lesson.xp,
                )
                session.add(challenge)
                order_index += 1

    for achievement_data in ACHIEVEMENTS:
        session.add(Achievement(**achievement_data))

    session.add(UserProfile(name="Player One"))

    session.commit()
