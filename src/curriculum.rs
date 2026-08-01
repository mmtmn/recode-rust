use crate::domain::{CodeTask, Difficulty, Lesson, Quiz, Source, Track};

macro_rules! lesson {
    (
        $id:literal, $track:expr, $unit:literal, $title:literal, $summary:literal,
        [$($note:literal),+ $(,)?], $difficulty:expr, $minutes:literal, $xp:literal,
        [$(($source_label:literal, $source_url:literal)),+ $(,)?],
        ($prompt:literal, $starter:literal, $solution:literal, [$($required:literal),+ $(,)?], $hint:literal),
        ($question:literal, [$choice_a:literal, $choice_b:literal, $choice_c:literal], $answer:literal, $explanation:literal)
    ) => {
        Lesson {
            id: $id,
            track: $track,
            unit: $unit,
            title: $title,
            summary: $summary,
            notes: &[$($note),+],
            difficulty: $difficulty,
            minutes: $minutes,
            xp: $xp,
            sources: &[$(Source { label: $source_label, url: $source_url }),+],
            code: CodeTask {
                prompt: $prompt,
                starter: $starter,
                solution: $solution,
                required: &[$($required),+],
                hint: $hint,
            },
            quiz: Quiz {
                question: $question,
                choices: [$choice_a, $choice_b, $choice_c],
                answer: $answer,
                explanation: $explanation,
            },
        }
    };
}

pub static CURRICULUM: &[Lesson] = &[
    lesson!(
        "rust-toolchain",
        Track::RustFoundations,
        "01 · Start here",
        "Rustup, rustc, and Cargo",
        "Know which tool owns which part of the workflow before writing application code.",
        [
            "rustup installs and updates toolchains; rustc is the compiler; Cargo creates, builds, tests, documents, and publishes packages.",
            "A package contains Cargo.toml and one or more crates. Use cargo check for the fastest compile-feedback loop."
        ],
        Difficulty::Beginner,
        12,
        40,
        [
            (
                "Rust Book · Getting Started",
                "https://doc.rust-lang.org/book/ch01-00-getting-started.html"
            ),
            (
                "W3Schools · Get Started",
                "https://www.w3schools.com/rust/rust_getstarted.php"
            )
        ],
        (
            "Write a tiny main function that prints the Cargo command you would use for fast type-checking.",
            "fn main() {\n    // Print the command\n}\n",
            "fn main() {\n    println!(\"cargo check\");\n}\n",
            ["fn main", "println!", "cargo check"],
            "The command checks code without producing a final executable."
        ),
        (
            "What is Cargo's role?",
            [
                "Only installing Rust itself",
                "Package management plus build/test tooling",
                "Replacing the Rust compiler"
            ],
            1,
            "Cargo orchestrates packages and invokes rustc; rustup manages toolchains."
        )
    ),
    lesson!(
        "rust-hello",
        Track::RustFoundations,
        "01 · Start here",
        "Syntax, output, and comments",
        "Read the shape of a Rust program and use its print macros deliberately.",
        [
            "Functions use fn, blocks use braces, and most statements end with semicolons.",
            "println! is a macro, which is why its name ends in !. Use // and /* ... */ for comments."
        ],
        Difficulty::Beginner,
        10,
        40,
        [
            (
                "Rust Book · Hello, World!",
                "https://doc.rust-lang.org/book/ch01-02-hello-world.html"
            ),
            (
                "W3Schools · Syntax",
                "https://www.w3schools.com/rust/rust_syntax.php"
            ),
            (
                "W3Schools · Output",
                "https://www.w3schools.com/rust/rust_output.php"
            )
        ],
        (
            "Print `Hello, Rust!` from main and include one line comment.",
            "fn main() {\n    // Your greeting\n}\n",
            "fn main() {\n    // Macros use a trailing bang.\n    println!(\"Hello, Rust!\");\n}\n",
            ["fn main", "//", "println!", "Hello, Rust!"],
            "Keep the comment outside the string literal."
        ),
        (
            "Why does println! end with !?",
            [
                "It returns an error",
                "It is a macro invocation",
                "It writes only to stderr"
            ],
            1,
            "The bang distinguishes macro invocation from an ordinary function call."
        )
    ),
    lesson!(
        "rust-bindings",
        Track::RustFoundations,
        "02 · Language core",
        "Bindings, mutability, constants, and shadowing",
        "Use immutability as the default and choose mut, const, or shadowing for distinct jobs.",
        [
            "let bindings are immutable unless declared with mut.",
            "const requires a type and a compile-time expression. Shadowing creates a new binding and may change the type."
        ],
        Difficulty::Beginner,
        14,
        45,
        [
            (
                "Rust Book · Variables and Mutability",
                "https://doc.rust-lang.org/book/ch03-01-variables-and-mutability.html"
            ),
            (
                "W3Schools · Variables",
                "https://www.w3schools.com/rust/rust_variables.php"
            ),
            (
                "W3Schools · Constants",
                "https://www.w3schools.com/rust/rust_constants.php"
            )
        ],
        (
            "Declare a constant MAX, mutate a counter, then shadow it as a string.",
            "const MAX: u32 = 3;\n\nfn main() {\n    // counter starts at 1\n}\n",
            "const MAX: u32 = 3;\n\nfn main() {\n    let mut counter = 1;\n    counter += MAX;\n    let counter = counter.to_string();\n    println!(\"{counter}\");\n}\n",
            [
                "const MAX: u32",
                "let mut counter",
                "counter +=",
                "let counter =",
                "to_string"
            ],
            "Shadow with a second `let counter = ...`."
        ),
        (
            "Which operation can change a binding's type?",
            [
                "Assignment to a mut binding",
                "Shadowing with let",
                "Declaring a const"
            ],
            1,
            "Shadowing creates a new binding, so its type need not match the old one."
        )
    ),
    lesson!(
        "rust-scalars",
        Track::RustFoundations,
        "02 · Language core",
        "Scalar types and inference",
        "Be explicit at boundaries and let inference work inside obvious expressions.",
        [
            "Rust scalar types are integers, floating-point numbers, booleans, and chars.",
            "Integer literals support suffixes and visual separators. char is a Unicode scalar value and uses single quotes."
        ],
        Difficulty::Beginner,
        14,
        45,
        [
            (
                "Rust Book · Data Types",
                "https://doc.rust-lang.org/book/ch03-02-data-types.html"
            ),
            (
                "W3Schools · Data Types",
                "https://www.w3schools.com/rust/rust_data_types.php"
            )
        ],
        (
            "Create typed values for an HTTP port, a ratio, a flag, and a crab character.",
            "fn main() {\n    // Add four scalar bindings\n}\n",
            "fn main() {\n    let port: u16 = 3000;\n    let ratio: f64 = 0.75;\n    let healthy: bool = true;\n    let mascot: char = '🦀';\n    println!(\"{port} {ratio} {healthy} {mascot}\");\n}\n",
            ["port: u16", "ratio: f64", "healthy: bool", "mascot: char"],
            "A char uses single quotes and can contain more than ASCII."
        ),
        (
            "What does Rust's char represent?",
            [
                "Exactly one byte",
                "A Unicode scalar value",
                "A UTF-8 string slice"
            ],
            1,
            "A char is four bytes and represents one Unicode scalar value; UTF-8 text lives in str/String."
        )
    ),
    lesson!(
        "rust-compound",
        Track::RustFoundations,
        "02 · Language core",
        "Tuples and arrays",
        "Model fixed heterogeneous groups with tuples and fixed homogeneous groups with arrays.",
        [
            "Tuple elements may have different types and are accessed by destructuring or .index.",
            "Arrays have a fixed length known at compile time; use Vec for a growable collection."
        ],
        Difficulty::Beginner,
        12,
        45,
        [
            (
                "Rust Book · Compound Types",
                "https://doc.rust-lang.org/book/ch03-02-data-types.html#compound-types"
            ),
            (
                "W3Schools · Arrays",
                "https://www.w3schools.com/rust/rust_arrays.php"
            ),
            (
                "W3Schools · Tuples",
                "https://www.w3schools.com/rust/rust_tuples.php"
            )
        ],
        (
            "Destructure a server tuple and read the last element of a three-item array.",
            "fn main() {\n    let server = (\"127.0.0.1\", 3000_u16);\n    let codes = [200, 404, 500];\n}\n",
            "fn main() {\n    let server = (\"127.0.0.1\", 3000_u16);\n    let codes = [200, 404, 500];\n    let (host, port) = server;\n    println!(\"{host}:{port} {}\", codes[2]);\n}\n",
            ["let (host, port)", "codes[2]", "println!"],
            "Tuple destructuring uses a pattern on the left of =."
        ),
        (
            "When is an array a better fit than Vec?",
            [
                "The size is fixed and known",
                "Elements have different types",
                "The collection must always grow"
            ],
            0,
            "Arrays encode a fixed length in their type; vectors are heap-backed and growable."
        )
    ),
    lesson!(
        "rust-operators-if",
        Track::RustFoundations,
        "02 · Language core",
        "Operators, booleans, and if expressions",
        "Combine typed expressions and remember that control flow can produce values.",
        [
            "Arithmetic, comparison, logical, and bitwise operators require compatible operand types.",
            "if is an expression; every branch used as a value must produce the same type."
        ],
        Difficulty::Beginner,
        14,
        45,
        [
            (
                "Rust Book · Control Flow",
                "https://doc.rust-lang.org/book/ch03-05-control-flow.html"
            ),
            (
                "W3Schools · Operators",
                "https://www.w3schools.com/rust/rust_operators.php"
            ),
            (
                "W3Schools · If Else",
                "https://www.w3schools.com/rust/rust_if_else.php"
            )
        ],
        (
            "Use an if expression to label status 200 as `ok` and other values as `error`.",
            "fn label(status: u16) -> &'static str {\n    // Return a label\n}\n\nfn main() {}\n",
            "fn label(status: u16) -> &'static str {\n    if status == 200 { \"ok\" } else { \"error\" }\n}\n\nfn main() {\n    println!(\"{}\", label(200));\n}\n",
            ["fn label", "if status == 200", "else", "-> &'static str"],
            "Do not add semicolons to the final branch expressions."
        ),
        (
            "Why must value-producing if branches have one type?",
            [
                "The compiler needs one type for the expression",
                "Only booleans may be returned",
                "Because else runs first"
            ],
            0,
            "An expression has a single static type regardless of which branch runs."
        )
    ),
    lesson!(
        "rust-match",
        Track::RustFoundations,
        "02 · Language core",
        "match and exhaustive decisions",
        "Let the compiler prove every case is handled.",
        [
            "match compares a value against ordered patterns and must be exhaustive.",
            "Use | for alternatives, ranges for bounded values, and _ as a deliberate catch-all."
        ],
        Difficulty::Beginner,
        15,
        50,
        [
            (
                "Rust Book · match",
                "https://doc.rust-lang.org/book/ch06-02-match.html"
            ),
            (
                "W3Schools · Match",
                "https://www.w3schools.com/rust/rust_match.php"
            )
        ],
        (
            "Map HTTP status classes to labels with ranges and a catch-all arm.",
            "fn class(status: u16) -> &'static str {\n    match status {\n        // Add arms\n    }\n}\n\nfn main() {}\n",
            "fn class(status: u16) -> &'static str {\n    match status {\n        200..=299 => \"success\",\n        400..=499 => \"client-error\",\n        500..=599 => \"server-error\",\n        _ => \"other\",\n    }\n}\n\nfn main() {}\n",
            [
                "match status",
                "200..=299",
                "400..=499",
                "500..=599",
                "_ =>"
            ],
            "The inclusive range pattern is `start..=end`."
        ),
        (
            "What does exhaustiveness buy you?",
            [
                "Faster networking",
                "Compile-time coverage of every possible value",
                "Automatic error logging"
            ],
            1,
            "The compiler rejects a match whose patterns do not cover all possible inputs."
        )
    ),
    lesson!(
        "rust-loops",
        Track::RustFoundations,
        "02 · Language core",
        "loop, while, for, and labels",
        "Choose the control-flow construct that states the termination rule most clearly.",
        [
            "loop repeats until break and can return a value with break value.",
            "for iterates through IntoIterator values. Labels disambiguate nested break and continue targets."
        ],
        Difficulty::Beginner,
        15,
        50,
        [
            (
                "Rust Book · Repetition with Loops",
                "https://doc.rust-lang.org/book/ch03-05-control-flow.html#repetition-with-loops"
            ),
            (
                "W3Schools · Loops",
                "https://www.w3schools.com/rust/rust_loops.php"
            ),
            (
                "W3Schools · For Loops",
                "https://www.w3schools.com/rust/rust_loops_for.php"
            )
        ],
        (
            "Use loop and break to compute 3, then iterate 1 through 3 inclusively.",
            "fn main() {\n    let mut count = 0;\n}\n",
            "fn main() {\n    let mut count = 0;\n    let final_count = loop {\n        count += 1;\n        if count == 3 { break count; }\n    };\n    for value in 1..=final_count {\n        println!(\"{value}\");\n    }\n}\n",
            ["loop", "break count", "for value in 1..=final_count"],
            "A break expression can carry the loop's resulting value."
        ),
        (
            "Which loop naturally returns a value?",
            [
                "loop with break value",
                "for with continue",
                "while without a body"
            ],
            0,
            "A loop expression can evaluate to the value supplied to break."
        )
    ),
    lesson!(
        "rust-functions",
        Track::RustFoundations,
        "02 · Language core",
        "Functions, statements, expressions, and scope",
        "Read return types and tail expressions without fighting semicolons.",
        [
            "Function parameters always declare their types. Return types follow ->.",
            "A block's final expression becomes its value when it has no trailing semicolon."
        ],
        Difficulty::Beginner,
        14,
        50,
        [
            (
                "Rust Book · Functions",
                "https://doc.rust-lang.org/book/ch03-03-how-functions-work.html"
            ),
            (
                "W3Schools · Functions",
                "https://www.w3schools.com/rust/rust_functions.php"
            ),
            (
                "W3Schools · Scope",
                "https://www.w3schools.com/rust/rust_scope.php"
            )
        ],
        (
            "Write a function that returns the larger of two u32 values using a tail expression.",
            "fn max(a: u32, b: u32) -> u32 {\n    // Return the larger value\n}\n\nfn main() {}\n",
            "fn max(a: u32, b: u32) -> u32 {\n    if a > b { a } else { b }\n}\n\nfn main() {\n    println!(\"{}\", max(8, 5));\n}\n",
            ["fn max(a: u32, b: u32) -> u32", "if a > b { a } else { b }"],
            "The final if expression needs no return keyword or semicolon."
        ),
        (
            "What changes `x + 1` from an expression to a statement?",
            [
                "A trailing semicolon",
                "A type annotation",
                "The + operator"
            ],
            0,
            "A semicolon discards the expression's value and makes the line a statement."
        )
    ),
    lesson!(
        "rust-strings",
        Track::RustFoundations,
        "03 · Ownership",
        "String and &str",
        "Distinguish owned growable text from borrowed UTF-8 views.",
        [
            "String owns a growable UTF-8 buffer; &str borrows a UTF-8 slice.",
            "String indexing is forbidden because byte indexes do not necessarily identify Unicode scalar boundaries."
        ],
        Difficulty::Beginner,
        16,
        50,
        [
            (
                "Rust Book · Storing UTF-8 Text",
                "https://doc.rust-lang.org/book/ch08-02-strings.html"
            ),
            (
                "W3Schools · Strings",
                "https://www.w3schools.com/rust/rust_strings.php"
            )
        ],
        (
            "Append to an owned String, then pass it to a function borrowing &str.",
            "fn length(text: &str) -> usize {\n    0\n}\n\nfn main() {}\n",
            "fn length(text: &str) -> usize {\n    text.len()\n}\n\nfn main() {\n    let mut route = String::from(\"/api\");\n    route.push_str(\"/users\");\n    println!(\"{}\", length(&route));\n}\n",
            ["text: &str", "String::from", "push_str", "length(&route)"],
            "Borrow the String; deref coercion produces the &str view."
        ),
        (
            "Why is `text[0]` rejected for String?",
            [
                "String is always empty",
                "UTF-8 characters have variable byte widths",
                "Indexes must be floats"
            ],
            1,
            "A byte index may land inside a UTF-8 code point, so Rust requires explicit byte or char iteration."
        )
    ),
    lesson!(
        "rust-ownership",
        Track::RustFoundations,
        "03 · Ownership",
        "Ownership, moves, Clone, and Copy",
        "Predict when values move, duplicate deeply, or copy trivially.",
        [
            "Each value has one owner; leaving scope drops it. Assignment or argument passing may move ownership.",
            "Copy types duplicate bits implicitly. Clone performs an explicit duplication that may allocate."
        ],
        Difficulty::Beginner,
        20,
        60,
        [
            (
                "Rust Book · Ownership",
                "https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html"
            ),
            (
                "W3Schools · Ownership",
                "https://www.w3schools.com/rust/rust_ownership.php"
            )
        ],
        (
            "Clone an owned name before moving the original into a consuming function.",
            "fn consume(value: String) {\n    println!(\"{value}\");\n}\n\nfn main() {\n    let name = String::from(\"Ferris\");\n}\n",
            "fn consume(value: String) {\n    println!(\"{value}\");\n}\n\nfn main() {\n    let name = String::from(\"Ferris\");\n    let backup = name.clone();\n    consume(name);\n    println!(\"{backup}\");\n}\n",
            ["name.clone", "consume(name)", "backup"],
            "Clone before the move so one owned allocation remains available."
        ),
        (
            "Why does assigning one String to another usually invalidate the first binding?",
            [
                "String implements Copy",
                "Ownership moves to prevent double free",
                "Strings live only in registers"
            ],
            1,
            "Moving transfers responsibility for the heap allocation to exactly one owner."
        )
    ),
    lesson!(
        "rust-borrowing",
        Track::RustFoundations,
        "03 · Ownership",
        "References and borrowing",
        "Share access without transfer and enforce aliasing rules at compile time.",
        [
            "Any number of immutable references or one mutable reference may exist for a value at a time.",
            "References must remain valid; non-lexical lifetimes end borrows at their last use when possible."
        ],
        Difficulty::Beginner,
        20,
        60,
        [
            (
                "Rust Book · References and Borrowing",
                "https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html"
            ),
            (
                "W3Schools · Borrowing",
                "https://www.w3schools.com/rust/rust_borrowing_references.php"
            )
        ],
        (
            "Write one shared-borrow reader and one exclusive-borrow mutator for String.",
            "fn read(value: &String) -> usize { 0 }\nfn append(value: &mut String) {}\n\nfn main() {}\n",
            "fn read(value: &String) -> usize { value.len() }\nfn append(value: &mut String) { value.push('!'); }\n\nfn main() {\n    let mut value = String::from(\"safe\");\n    println!(\"{}\", read(&value));\n    append(&mut value);\n}\n",
            [
                "value: &String",
                "value: &mut String",
                "read(&value)",
                "append(&mut value)"
            ],
            "The caller must also use &mut for an exclusive borrow."
        ),
        (
            "Which borrow set is legal at one moment?",
            [
                "Two mutable references",
                "One mutable and one shared reference",
                "Several shared references"
            ],
            2,
            "Shared borrows may coexist; an active mutable borrow must be exclusive."
        )
    ),
    lesson!(
        "rust-slices",
        Track::RustFoundations,
        "03 · Ownership",
        "Slices and borrowed ranges",
        "Return views into existing storage without inventing new ownership.",
        [
            "A slice stores a pointer and length into contiguous data owned elsewhere.",
            "String slicing must occur on UTF-8 character boundaries; prefer APIs that make boundaries explicit."
        ],
        Difficulty::Beginner,
        16,
        55,
        [(
            "Rust Book · Slice Type",
            "https://doc.rust-lang.org/book/ch04-03-slices.html"
        )],
        (
            "Return the first whitespace-delimited word as an &str tied to the input.",
            "fn first_word(text: &str) -> &str {\n    text\n}\n\nfn main() {}\n",
            "fn first_word(text: &str) -> &str {\n    match text.find(' ') {\n        Some(index) => &text[..index],\n        None => text,\n    }\n}\n\nfn main() {}\n",
            ["text: &str", "-> &str", "text.find", "&text[..index]"],
            "The returned slice borrows from the input; no allocation is needed."
        ),
        (
            "What invalidates a slice into a String?",
            [
                "Mutating the owner in a way that may reallocate",
                "Reading the slice length",
                "Passing another shared slice"
            ],
            0,
            "A reallocation could move the buffer, so Rust prevents such mutation while the slice is borrowed."
        )
    ),
    lesson!(
        "rust-structs",
        Track::RustFoundations,
        "04 · Modeling",
        "Structs, methods, and associated functions",
        "Give domain data names and put invariants near their types.",
        [
            "Structs group named fields; tuple structs distinguish otherwise similar values.",
            "Methods receive self; associated functions do not and are commonly used as constructors."
        ],
        Difficulty::Beginner,
        18,
        55,
        [
            (
                "Rust Book · Structs",
                "https://doc.rust-lang.org/book/ch05-00-structs.html"
            ),
            (
                "W3Schools · Structs",
                "https://www.w3schools.com/rust/rust_structs.php"
            )
        ],
        (
            "Model a ServerConfig and implement a constructor plus an address method.",
            "struct ServerConfig {\n    host: String,\n    port: u16,\n}\n\nfn main() {}\n",
            "struct ServerConfig {\n    host: String,\n    port: u16,\n}\n\nimpl ServerConfig {\n    fn new(host: impl Into<String>, port: u16) -> Self {\n        Self { host: host.into(), port }\n    }\n\n    fn address(&self) -> String {\n        format!(\"{}:{}\", self.host, self.port)\n    }\n}\n\nfn main() {}\n",
            [
                "impl ServerConfig",
                "fn new",
                "-> Self",
                "fn address(&self)"
            ],
            "Use Self in constructors so renaming the type is less repetitive."
        ),
        (
            "What distinguishes an associated function from a method?",
            [
                "An associated function has no self parameter",
                "A method cannot return values",
                "A method must be public"
            ],
            0,
            "Both live in impl blocks; only methods receive self, &self, or &mut self."
        )
    ),
    lesson!(
        "rust-enums",
        Track::RustFoundations,
        "04 · Modeling",
        "Enums, Option, and concise matching",
        "Encode valid states directly instead of relying on nulls and sentinel values.",
        [
            "Each enum variant can carry different data while remaining one static type.",
            "Option<T> models presence explicitly. if let and let-else are concise when one pattern is interesting."
        ],
        Difficulty::Beginner,
        18,
        60,
        [
            (
                "Rust Book · Enums and Pattern Matching",
                "https://doc.rust-lang.org/book/ch06-00-enums.html"
            ),
            (
                "W3Schools · Enums",
                "https://www.w3schools.com/rust/rust_enums.php"
            )
        ],
        (
            "Create a Health enum and turn an Option<Health> into a static label with match.",
            "enum Health { Ready, Degraded(String) }\n\nfn label(value: Option<Health>) -> &'static str {\n    \"todo\"\n}\n\nfn main() {}\n",
            "enum Health { Ready, Degraded(String) }\n\nfn label(value: Option<Health>) -> &'static str {\n    match value {\n        Some(Health::Ready) => \"ready\",\n        Some(Health::Degraded(_)) => \"degraded\",\n        None => \"unknown\",\n    }\n}\n\nfn main() {}\n",
            [
                "enum Health",
                "Option<Health>",
                "Some(Health::Ready)",
                "None =>"
            ],
            "Match both the Option layer and the inner enum variant."
        ),
        (
            "What does Option<T> prevent?",
            [
                "All runtime errors",
                "Unmarked absence represented as a null value",
                "Heap allocation"
            ],
            1,
            "Callers must handle Some and None explicitly, making absence part of the type."
        )
    ),
    lesson!(
        "rust-modules",
        Track::RustFoundations,
        "05 · Programs",
        "Packages, crates, modules, and visibility",
        "Navigate Rust's compile and namespace boundaries confidently.",
        [
            "A package contains one or more crates; a crate is a compilation unit; modules organize paths within a crate.",
            "Items are private by default. pub exposes an item, while use brings a path into scope."
        ],
        Difficulty::Intermediate,
        20,
        65,
        [(
            "Rust Book · Packages, Crates, and Modules",
            "https://doc.rust-lang.org/book/ch07-00-managing-growing-projects-with-packages-crates-and-modules.html"
        )],
        (
            "Create a public nested route module and import its handler with use.",
            "mod api {\n    // Add a public module and function\n}\n\nfn main() {}\n",
            "mod api {\n    pub mod routes {\n        pub fn health() -> &'static str { \"ok\" }\n    }\n}\n\nuse api::routes::health;\n\nfn main() {\n    println!(\"{}\", health());\n}\n",
            ["pub mod routes", "pub fn health", "use api::routes::health"],
            "Every module boundary in the path must expose the item."
        ),
        (
            "What is a crate?",
            [
                "Only a third-party dependency",
                "A Rust compilation unit",
                "A single function"
            ],
            1,
            "Binary and library crates are the units rustc compiles; a package is Cargo's manifest-level container."
        )
    ),
    lesson!(
        "rust-vectors",
        Track::RustFoundations,
        "06 · Collections",
        "Vectors and iteration",
        "Grow homogeneous data safely and choose indexing behavior deliberately.",
        [
            "Vec<T> owns a growable contiguous buffer of T values.",
            "Indexing may panic; get returns Option. Iterating by value, shared reference, or mutable reference has different ownership effects."
        ],
        Difficulty::Beginner,
        16,
        55,
        [
            (
                "Rust Book · Vectors",
                "https://doc.rust-lang.org/book/ch08-01-vectors.html"
            ),
            (
                "W3Schools · Vectors",
                "https://www.w3schools.com/rust/rust_vectors.php"
            )
        ],
        (
            "Build a vector, mutate every value through iter_mut, then read safely with get.",
            "fn main() {\n    let mut ports = vec![3000, 3001];\n}\n",
            "fn main() {\n    let mut ports = vec![3000, 3001];\n    for port in &mut ports {\n        *port += 100;\n    }\n    if let Some(first) = ports.get(0) {\n        println!(\"{first}\");\n    }\n}\n",
            ["vec!", "&mut ports", "*port +=", "ports.get", "Some(first)"],
            "Dereference each &mut element before changing its value."
        ),
        (
            "How does get differ from indexing?",
            [
                "get returns Option instead of panicking out of bounds",
                "get consumes the vector",
                "get works only on strings"
            ],
            0,
            "Index syntax assumes validity; get exposes absence through Option."
        )
    ),
    lesson!(
        "rust-utf8",
        Track::RustFoundations,
        "06 · Collections",
        "UTF-8 strings in depth",
        "Choose bytes, scalar values, or grapheme-aware tooling consciously.",
        [
            "String and str guarantee valid UTF-8, but len reports bytes.",
            "chars iterates Unicode scalar values; bytes exposes encoding bytes. User-perceived graphemes require an external segmentation crate."
        ],
        Difficulty::Intermediate,
        18,
        60,
        [
            (
                "Rust Book · Strings",
                "https://doc.rust-lang.org/book/ch08-02-strings.html"
            ),
            (
                "W3Schools · Strings",
                "https://www.w3schools.com/rust/rust_strings.php"
            )
        ],
        (
            "Collect Unicode scalar values from a &str and report byte and scalar counts.",
            "fn inspect(text: &str) -> (usize, usize) {\n    (0, 0)\n}\n\nfn main() {}\n",
            "fn inspect(text: &str) -> (usize, usize) {\n    let bytes = text.len();\n    let scalars = text.chars().count();\n    (bytes, scalars)\n}\n\nfn main() {\n    println!(\"{:?}\", inspect(\"Olá\"));\n}\n",
            ["text.len", "text.chars().count", "(bytes, scalars)"],
            "len and chars().count intentionally measure different layers."
        ),
        (
            "For `Olá`, what does String::len return?",
            [
                "User-perceived graphemes",
                "Unicode scalar values",
                "UTF-8 bytes"
            ],
            2,
            "String length is the buffer length in bytes."
        )
    ),
    lesson!(
        "rust-hashmaps",
        Track::RustFoundations,
        "06 · Collections",
        "Hash maps and entry",
        "Own keys and values intentionally and update aggregates without double lookup.",
        [
            "HashMap<K, V> stores one value type behind one key type and takes ownership of owned inputs.",
            "The entry API combines lookup and insertion, making counters and caches concise."
        ],
        Difficulty::Beginner,
        17,
        55,
        [
            (
                "Rust Book · Hash Maps",
                "https://doc.rust-lang.org/book/ch08-03-hash-maps.html"
            ),
            (
                "W3Schools · HashMap",
                "https://www.w3schools.com/rust/rust_hashmap.php"
            )
        ],
        (
            "Count repeated route names with HashMap::entry and or_insert.",
            "use std::collections::HashMap;\n\nfn main() {\n    let routes = [\"health\", \"users\", \"health\"];\n}\n",
            "use std::collections::HashMap;\n\nfn main() {\n    let routes = [\"health\", \"users\", \"health\"];\n    let mut counts = HashMap::new();\n    for route in routes {\n        *counts.entry(route).or_insert(0) += 1;\n    }\n    println!(\"{:?}\", counts);\n}\n",
            ["HashMap::new", "counts.entry", "or_insert", "+= 1"],
            "or_insert returns a mutable reference to the stored value."
        ),
        (
            "Why prefer entry for a counter?",
            [
                "It performs lookup-or-insert as one API flow",
                "It sorts the map",
                "It avoids mutable values"
            ],
            0,
            "entry lets you modify an existing value or initialize a missing one without separate lookups."
        )
    ),
    lesson!(
        "rust-errors",
        Track::RustFoundations,
        "07 · Reliable Rust",
        "panic!, Result, and the ? operator",
        "Separate unrecoverable invariant failures from errors callers can handle.",
        [
            "panic! unwinds or aborts; Result<T, E> represents recoverable success or failure.",
            "? returns early on Err and converts compatible errors through From. Design errors at abstraction boundaries."
        ],
        Difficulty::Intermediate,
        22,
        70,
        [(
            "Rust Book · Error Handling",
            "https://doc.rust-lang.org/book/ch09-00-error-handling.html"
        )],
        (
            "Read a file into a String and propagate I/O errors with Result and ?.",
            "use std::{fs, io};\n\nfn read_config(path: &str) -> Result<String, io::Error> {\n    todo!()\n}\n\nfn main() {}\n",
            "use std::{fs, io};\n\nfn read_config(path: &str) -> Result<String, io::Error> {\n    let contents = fs::read_to_string(path)?;\n    Ok(contents)\n}\n\nfn main() {}\n",
            [
                "Result<String, io::Error>",
                "fs::read_to_string(path)?",
                "Ok(contents)"
            ],
            "The ? operator unwraps Ok or returns the Err to the caller."
        ),
        (
            "When is panic appropriate?",
            [
                "Every expected network timeout",
                "A violated invariant that cannot be meaningfully recovered here",
                "Any parse error from user input"
            ],
            1,
            "Expected failures belong in Result; panic is for bugs or unrecoverable invariants."
        )
    ),
    lesson!(
        "rust-generics",
        Track::RustFoundations,
        "08 · Abstraction",
        "Generics and monomorphization",
        "Share behavior across types without paying for dynamic dispatch by default.",
        [
            "Generic parameters appear in angle brackets and are constrained by trait bounds when behavior is required.",
            "Rust typically monomorphizes generics into concrete machine code for each used type."
        ],
        Difficulty::Intermediate,
        18,
        65,
        [(
            "Rust Book · Generic Data Types",
            "https://doc.rust-lang.org/book/ch10-01-syntax.html"
        )],
        (
            "Create a generic Envelope<T> and a consuming into_inner method.",
            "struct Envelope<T> {\n    value: T,\n}\n\nfn main() {}\n",
            "struct Envelope<T> {\n    value: T,\n}\n\nimpl<T> Envelope<T> {\n    fn into_inner(self) -> T {\n        self.value\n    }\n}\n\nfn main() {}\n",
            [
                "struct Envelope<T>",
                "impl<T> Envelope<T>",
                "fn into_inner(self) -> T"
            ],
            "Consuming self permits moving T out of the wrapper."
        ),
        (
            "What is monomorphization?",
            [
                "Converting every type to String",
                "Generating concrete code for used generic types",
                "Runtime reflection"
            ],
            1,
            "The compiler specializes generic code for concrete instantiations, usually avoiding dispatch overhead."
        )
    ),
    lesson!(
        "rust-traits",
        Track::RustFoundations,
        "08 · Abstraction",
        "Traits, bounds, impl Trait, and dyn Trait",
        "Choose static or dynamic polymorphism based on ownership and heterogeneity needs.",
        [
            "Traits define shared behavior. Bounds enable generic code to call trait methods.",
            "impl Trait usually means static dispatch; dyn Trait uses a vtable and enables heterogeneous values behind a pointer."
        ],
        Difficulty::Intermediate,
        22,
        70,
        [(
            "Rust Book · Traits",
            "https://doc.rust-lang.org/book/ch10-02-traits.html"
        )],
        (
            "Define a Respond trait, implement it for &str, and accept an impl Respond argument.",
            "trait Respond {\n    fn body(&self) -> String;\n}\n\nfn render(value: impl Respond) -> String {\n    todo!()\n}\n\nfn main() {}\n",
            "trait Respond {\n    fn body(&self) -> String;\n}\n\nimpl Respond for &str {\n    fn body(&self) -> String { self.to_string() }\n}\n\nfn render(value: impl Respond) -> String {\n    value.body()\n}\n\nfn main() {}\n",
            [
                "trait Respond",
                "impl Respond for &str",
                "value: impl Respond",
                "value.body"
            ],
            "The trait method's self receiver lets the implementation read the value."
        ),
        (
            "When is dyn Trait especially useful?",
            [
                "A collection must hold different concrete implementors",
                "Compile-time specialization is required",
                "No indirection is allowed"
            ],
            0,
            "Trait objects erase concrete types so heterogeneous implementors can share one pointer type."
        )
    ),
    lesson!(
        "rust-lifetimes",
        Track::RustFoundations,
        "08 · Abstraction",
        "Lifetimes and borrowed relationships",
        "Annotate relationships between references, not how long values should live.",
        [
            "Most lifetimes are inferred by elision. An annotation connects input and output reference validity.",
            "A lifetime parameter does not extend any value's lifetime; it constrains accepted callers."
        ],
        Difficulty::Intermediate,
        24,
        75,
        [(
            "Rust Book · Lifetimes",
            "https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html"
        )],
        (
            "Return the longer of two borrowed string slices using one named lifetime.",
            "fn longest(left: &str, right: &str) -> &str {\n    todo!()\n}\n\nfn main() {}\n",
            "fn longest<'a>(left: &'a str, right: &'a str) -> &'a str {\n    if left.len() >= right.len() { left } else { right }\n}\n\nfn main() {}\n",
            [
                "fn longest<'a>",
                "left: &'a str",
                "right: &'a str",
                "-> &'a str"
            ],
            "The output can be valid only while both possible inputs satisfy 'a."
        ),
        (
            "What does a lifetime annotation do?",
            [
                "Keeps a value alive at runtime",
                "Describes relationships among borrowed references",
                "Allocates references on the heap"
            ],
            1,
            "Lifetimes are compile-time constraints; annotations do not change runtime duration."
        )
    ),
    lesson!(
        "rust-tests",
        Track::RustFoundations,
        "09 · Confidence",
        "Unit, integration, and documentation tests",
        "Place tests where they can exercise the right public or private boundary.",
        [
            "#[test] functions may use assertions and return Result for fallible setup.",
            "Unit tests live beside code and can inspect private items; integration tests live in tests/ and use the public API."
        ],
        Difficulty::Intermediate,
        18,
        65,
        [(
            "Rust Book · Writing Automated Tests",
            "https://doc.rust-lang.org/book/ch11-00-testing.html"
        )],
        (
            "Write a unit test module with an assertion for a status classification function.",
            "fn is_success(status: u16) -> bool {\n    (200..=299).contains(&status)\n}\n",
            "fn is_success(status: u16) -> bool {\n    (200..=299).contains(&status)\n}\n\n#[cfg(test)]\nmod tests {\n    use super::*;\n\n    #[test]\n    fn classifies_success() {\n        assert!(is_success(204));\n        assert!(!is_success(404));\n    }\n}\n",
            ["#[cfg(test)]", "#[test]", "assert!", "assert!(!"],
            "cfg(test) keeps the test module out of normal builds."
        ),
        (
            "Why can unit tests access private items?",
            [
                "They are compiled as a child module in the same crate",
                "Privacy is disabled in tests",
                "All test functions are public"
            ],
            0,
            "Child modules can access ancestor items, so colocated unit tests can cover internals."
        )
    ),
    lesson!(
        "rust-closures",
        Track::RustFoundations,
        "10 · Functional tools",
        "Closures and capture modes",
        "Use callable values while understanding whether the environment is borrowed or moved.",
        [
            "Closures infer parameter and return types from context and capture only what they use.",
            "Fn, FnMut, and FnOnce describe how a closure may call through captured state; move transfers captures into the closure."
        ],
        Difficulty::Intermediate,
        20,
        65,
        [(
            "Rust Book · Closures",
            "https://doc.rust-lang.org/book/ch13-01-closures.html"
        )],
        (
            "Return a move closure that owns a prefix and formats request paths.",
            "fn prefixer(prefix: String) -> impl Fn(&str) -> String {\n    todo!()\n}\n\nfn main() {}\n",
            "fn prefixer(prefix: String) -> impl Fn(&str) -> String {\n    move |path| format!(\"{prefix}{path}\")\n}\n\nfn main() {\n    let api = prefixer(String::from(\"/api\"));\n    println!(\"{}\", api(\"/health\"));\n}\n",
            ["-> impl Fn(&str) -> String", "move |path|", "format!"],
            "move lets the returned closure own prefix after the function returns."
        ),
        (
            "Which closure trait permits consuming a captured value?",
            ["Fn", "FnMut", "FnOnce"],
            2,
            "A closure that moves out of its environment can be invoked at most once."
        )
    ),
    lesson!(
        "rust-iterators",
        Track::RustFoundations,
        "10 · Functional tools",
        "Iterators, adapters, and consumers",
        "Build lazy transformation pipelines and make ownership visible in the iterator choice.",
        [
            "Iterator adapters such as map and filter are lazy; consumers such as collect and sum drive them.",
            "iter borrows, iter_mut mutably borrows, and into_iter consumes the collection."
        ],
        Difficulty::Intermediate,
        20,
        70,
        [(
            "Rust Book · Iterators",
            "https://doc.rust-lang.org/book/ch13-02-iterators.html"
        )],
        (
            "Filter successful status codes, map them to strings, and collect a Vec<String>.",
            "fn labels(statuses: Vec<u16>) -> Vec<String> {\n    vec![]\n}\n\nfn main() {}\n",
            "fn labels(statuses: Vec<u16>) -> Vec<String> {\n    statuses\n        .into_iter()\n        .filter(|status| (200..=299).contains(status))\n        .map(|status| status.to_string())\n        .collect()\n}\n\nfn main() {}\n",
            ["into_iter", ".filter", ".map", ".collect"],
            "Add a consumer at the end; adapters alone do no work."
        ),
        (
            "Why does a map/filter pipeline do nothing until collect or another consumer?",
            [
                "Adapters are lazy",
                "Closures run only on threads",
                "Vec cannot be iterated"
            ],
            0,
            "Iterator adapters construct a new iterator; a consuming operation pulls values through it."
        )
    ),
    lesson!(
        "rust-cargo",
        Track::RustFoundations,
        "11 · Ecosystem craft",
        "Cargo profiles, features, workspaces, and publishing",
        "Keep dependency surfaces intentional and organize multi-crate systems coherently.",
        [
            "Profiles tune compilation modes; features provide additive conditional compilation.",
            "A workspace shares a lockfile and output directory. Public crates need metadata, semantic versioning discipline, and useful docs."
        ],
        Difficulty::Intermediate,
        22,
        70,
        [
            (
                "Rust Book · Cargo and Crates.io",
                "https://doc.rust-lang.org/book/ch14-00-more-about-cargo.html"
            ),
            ("Cargo Book", "https://doc.rust-lang.org/cargo/")
        ],
        (
            "Gate a diagnostic function behind a Cargo feature using cfg.",
            "fn main() {}\n",
            "#[cfg(feature = \"diagnostics\")]\nfn diagnostics() -> &'static str {\n    \"enabled\"\n}\n\n#[cfg(not(feature = \"diagnostics\"))]\nfn diagnostics() -> &'static str {\n    \"disabled\"\n}\n\nfn main() {\n    println!(\"{}\", diagnostics());\n}\n",
            [
                "#[cfg(feature = \"diagnostics\")]",
                "#[cfg(not(feature = \"diagnostics\"))]"
            ],
            "Feature names are string values in cfg(feature = ...)."
        ),
        (
            "How should Cargo features usually compose?",
            [
                "Additively",
                "Mutually exclusively",
                "By changing dependency source at runtime"
            ],
            0,
            "Cargo unifies features across the graph, so additive design avoids surprising combinations."
        )
    ),
    lesson!(
        "rust-smart-pointers",
        Track::RustFoundations,
        "12 · Memory models",
        "Box, Rc, Arc, RefCell, Deref, and Drop",
        "Reach for indirection and shared ownership only when the ownership graph requires them.",
        [
            "Box<T> provides single ownership with heap indirection; Rc<T>/Arc<T> provide reference-counted ownership.",
            "RefCell<T> moves borrow checking to runtime for single-threaded interior mutability. Mutex/RwLock are synchronization choices for shared mutation."
        ],
        Difficulty::Advanced,
        28,
        85,
        [(
            "Rust Book · Smart Pointers",
            "https://doc.rust-lang.org/book/ch15-00-smart-pointers.html"
        )],
        (
            "Share an immutable configuration across threads with Arc and show two clones.",
            "use std::sync::Arc;\n\nfn main() {\n    let config = Arc::new(String::from(\"prod\"));\n}\n",
            "use std::sync::Arc;\n\nfn main() {\n    let config = Arc::new(String::from(\"prod\"));\n    let worker_a = Arc::clone(&config);\n    let worker_b = Arc::clone(&config);\n    println!(\"{worker_a} {worker_b}\");\n}\n",
            ["Arc::new", "Arc::clone(&config)"],
            "Clone the Arc handle, not the inner String."
        ),
        (
            "Why is RefCell not a general multithreaded lock?",
            [
                "It is not Sync and enforces borrowing at runtime on one thread",
                "It never permits mutation",
                "It always leaks memory"
            ],
            0,
            "RefCell provides interior mutability without synchronization and can panic on conflicting borrows."
        )
    ),
    lesson!(
        "rust-concurrency",
        Track::RustFoundations,
        "13 · Concurrency",
        "Threads, channels, Mutex, Send, and Sync",
        "Let ownership cross thread boundaries only through types that prove it is safe.",
        [
            "spawned closures commonly use move to own captured values. Channels transfer messages; Arc<Mutex<T>> shares mutable state.",
            "Send permits ownership transfer across threads; Sync permits shared references across threads."
        ],
        Difficulty::Advanced,
        28,
        85,
        [(
            "Rust Book · Fearless Concurrency",
            "https://doc.rust-lang.org/book/ch16-00-concurrency.html"
        )],
        (
            "Spawn a thread that sends an owned String through a channel.",
            "use std::{sync::mpsc, thread};\n\nfn main() {}\n",
            "use std::{sync::mpsc, thread};\n\nfn main() {\n    let (sender, receiver) = mpsc::channel();\n    thread::spawn(move || {\n        sender.send(String::from(\"ready\")).unwrap();\n    });\n    println!(\"{}\", receiver.recv().unwrap());\n}\n",
            [
                "mpsc::channel",
                "thread::spawn(move",
                "sender.send",
                "receiver.recv"
            ],
            "Move the sender into the spawned closure."
        ),
        (
            "What does Sync mean?",
            [
                "A type can be formatted",
                "Shared references to a type can be used across threads safely",
                "A future completes immediately"
            ],
            1,
            "T is Sync when &T can be sent safely between threads."
        )
    ),
    lesson!(
        "rust-async",
        Track::RustFoundations,
        "14 · Async Rust",
        "Futures, async/await, tasks, and streams",
        "Understand that async code describes work and a runtime drives that work forward.",
        [
            "An async function returns a Future; .await yields until that future can progress.",
            "Concurrency interleaves tasks; parallelism runs work simultaneously. Blocking a runtime worker stalls unrelated tasks."
        ],
        Difficulty::Advanced,
        28,
        90,
        [(
            "Rust Book · Async and Await",
            "https://doc.rust-lang.org/book/ch17-00-async-await.html"
        )],
        (
            "Write an async function, spawn it with Tokio, and await its JoinHandle.",
            "async fn health() -> &'static str {\n    \"ok\"\n}\n\n#[tokio::main]\nasync fn main() {}\n",
            "async fn health() -> &'static str {\n    \"ok\"\n}\n\n#[tokio::main]\nasync fn main() {\n    let task = tokio::spawn(health());\n    let value = task.await.unwrap();\n    println!(\"{value}\");\n}\n",
            [
                "async fn health",
                "#[tokio::main]",
                "tokio::spawn",
                "task.await"
            ],
            "Awaiting a JoinHandle yields the task output wrapped in a join result."
        ),
        (
            "What happens when an async function is called?",
            [
                "Its body always runs to completion immediately",
                "It returns a Future that must be polled",
                "It creates an OS thread"
            ],
            1,
            "Calling async code constructs a future; an executor polls it to make progress."
        )
    ),
    lesson!(
        "rust-oop",
        Track::RustFoundations,
        "15 · Design",
        "Encapsulation and trait-object design",
        "Translate object-oriented goals into Rust modules, types, composition, and traits.",
        [
            "Rust supports encapsulation through module privacy and behavior through impl blocks.",
            "Trait objects provide open-ended polymorphism; enums are often better when the complete variant set is known."
        ],
        Difficulty::Advanced,
        20,
        75,
        [(
            "Rust Book · Object-Oriented Features",
            "https://doc.rust-lang.org/book/ch18-00-oop.html"
        )],
        (
            "Create a heterogeneous Vec<Box<dyn Render>> and call each implementation.",
            "trait Render { fn render(&self) -> String; }\nstruct Text(&'static str);\n\nfn main() {}\n",
            "trait Render { fn render(&self) -> String; }\nstruct Text(&'static str);\n\nimpl Render for Text {\n    fn render(&self) -> String { self.0.to_string() }\n}\n\nfn main() {\n    let items: Vec<Box<dyn Render>> = vec![Box::new(Text(\"hello\"))];\n    for item in items { println!(\"{}\", item.render()); }\n}\n",
            [
                "impl Render for Text",
                "Vec<Box<dyn Render>>",
                "item.render"
            ],
            "The Box gives the unsized trait object a sized pointer representation."
        ),
        (
            "When is an enum often preferable to dyn Trait?",
            [
                "The complete set of variants is known and should be exhaustively matched",
                "Third parties must add implementations",
                "Dynamic loading is required"
            ],
            0,
            "Closed sets benefit from enum exhaustiveness and static dispatch."
        )
    ),
    lesson!(
        "rust-patterns",
        Track::RustFoundations,
        "15 · Design",
        "Patterns, destructuring, guards, and @ bindings",
        "Use the full pattern language to make invariants visible in control flow.",
        [
            "Patterns appear in let, match, function parameters, for loops, if let, and let-else.",
            "Guards add conditions; @ both tests a subpattern and binds the matched value."
        ],
        Difficulty::Advanced,
        22,
        80,
        [(
            "Rust Book · Patterns",
            "https://doc.rust-lang.org/book/ch19-00-patterns.html"
        )],
        (
            "Match a response tuple with destructuring, an inclusive range, a guard, and @ binding.",
            "fn describe(response: (u16, &str)) -> &'static str {\n    match response {\n        _ => \"other\",\n    }\n}\n\nfn main() {}\n",
            "fn describe(response: (u16, &str)) -> &'static str {\n    match response {\n        (code @ 200..=299, body) if !body.is_empty() && code != 204 => \"body\",\n        (204, _) => \"empty\",\n        _ => \"other\",\n    }\n}\n\nfn main() {}\n",
            ["code @ 200..=299", "if !body.is_empty", "(204, _)", "_ =>"],
            "Place the guard after the pattern and before =>."
        ),
        (
            "What does @ provide in a pattern?",
            [
                "A binding for a value that also matches a subpattern",
                "An async task",
                "Automatic dereferencing"
            ],
            0,
            "The operator checks the pattern on its right while binding the whole matched value on its left."
        )
    ),
    lesson!(
        "rust-advanced",
        Track::RustFoundations,
        "16 · Advanced Rust",
        "Unsafe, advanced traits/types, and macros",
        "Know where Rust's escape hatches and compile-time metaprogramming fit—and where they do not.",
        [
            "unsafe enables five extra capabilities but does not disable the borrow checker. Wrap unsafe internals in a safe API only when invariants are documented and enforced.",
            "Associated types, newtypes, fully qualified syntax, function pointers, declarative macros, and procedural macros solve different abstraction problems."
        ],
        Difficulty::Advanced,
        32,
        100,
        [(
            "Rust Book · Advanced Features",
            "https://doc.rust-lang.org/book/ch20-00-advanced-features.html"
        )],
        (
            "Define a small declarative macro that builds a route tuple without using unsafe.",
            "macro_rules! route {\n    // Match method and path\n}\n\nfn main() {}\n",
            "macro_rules! route {\n    ($method:expr, $path:expr) => {\n        ($method.to_string(), $path.to_string())\n    };\n}\n\nfn main() {\n    let health = route!(\"GET\", \"/health\");\n    println!(\"{:?}\", health);\n}\n",
            [
                "macro_rules! route",
                "$method:expr",
                "$path:expr",
                "route!("
            ],
            "macro_rules metavariables begin with $ and declare a fragment kind."
        ),
        (
            "What does an unsafe block mean?",
            [
                "The compiler stops checking all Rust rules",
                "The programmer must uphold specific extra safety invariants",
                "The code is automatically faster"
            ],
            1,
            "unsafe unlocks limited operations and transfers proof obligations to the programmer."
        )
    ),
    lesson!(
        "rust-projects",
        Track::RustFoundations,
        "17 · Put it together",
        "CLI and server project architecture",
        "Separate parsing, domain logic, I/O, and process concerns so each boundary can be tested.",
        [
            "The Rust Book's grep and web-server projects demonstrate moving logic from main into a library, propagating errors, testing behavior, and managing concurrency.",
            "Production services benefit from the same boundaries: configuration, transport, application logic, infrastructure, and observability."
        ],
        Difficulty::Advanced,
        30,
        100,
        [
            (
                "Rust Book · minigrep",
                "https://doc.rust-lang.org/book/ch12-00-an-io-project.html"
            ),
            (
                "Rust Book · Web Server",
                "https://doc.rust-lang.org/book/ch21-00-final-project-a-web-server.html"
            )
        ],
        (
            "Model a testable run function that accepts configuration and returns Result.",
            "#[derive(Debug)]\nstruct Config { query: String }\n\nfn run(config: Config) {\n}\n\nfn main() {}\n",
            "use std::error::Error;\n\n#[derive(Debug)]\nstruct Config { query: String }\n\nfn run(config: Config) -> Result<(), Box<dyn Error>> {\n    if config.query.is_empty() { return Err(\"query is empty\".into()); }\n    Ok(())\n}\n\nfn main() {}\n",
            [
                "fn run(config: Config) -> Result",
                "Box<dyn Error>",
                "return Err",
                "Ok(())"
            ],
            "Keep process exit and printing in main; return errors from reusable logic."
        ),
        (
            "Why move substantial logic out of main?",
            [
                "To make boundaries reusable and testable",
                "Because main cannot call functions",
                "To avoid Cargo"
            ],
            0,
            "A thin main wires I/O and exit behavior while library functions can be tested directly."
        )
    ),
    lesson!(
        "axum-stack",
        Track::AxumMastery,
        "01 · Mental model",
        "The Axum dependency stack",
        "See the runtime, protocol, service, middleware, and ergonomic layers as one coherent system.",
        [
            "Tokio supplies the runtime and async I/O; Hyper implements HTTP; Tower defines Service and Layer; tower-http adds HTTP middleware; Axum adds routing, extractors, handlers, and responses.",
            "Tonic builds gRPC on the same Tokio/Hyper/Tower foundation, which is why middleware can cross framework boundaries."
        ],
        Difficulty::Beginner,
        16,
        55,
        [
            ("Axum · Crate Overview", "https://docs.rs/axum/latest/axum/"),
            ("Tower · Overview", "https://docs.rs/tower/latest/tower/"),
            ("Tokio · Overview", "https://docs.rs/tokio/latest/tokio/")
        ],
        (
            "Express the stack as nested wrapper types from the handler outward.",
            "struct TokioRuntime;\nstruct HyperHttp<T>(T);\nstruct TowerService<T>(T);\nstruct AxumRouter<T>(T);\n\nfn main() {}\n",
            "struct TokioRuntime;\nstruct HyperHttp<T>(T);\nstruct TowerService<T>(T);\nstruct AxumRouter<T>(T);\n\nfn main() {\n    let stack = AxumRouter(TowerService(HyperHttp(TokioRuntime)));\n    let _ = stack;\n}\n",
            ["AxumRouter(TowerService(HyperHttp(TokioRuntime)))"],
            "The model is conceptual: Axum exposes a Tower service that Hyper serves on Tokio."
        ),
        (
            "Which layer defines the reusable Service abstraction?",
            ["Tower", "Tokio", "Serde"],
            0,
            "Tower's Service is the integration point used throughout the stack."
        )
    ),
    lesson!(
        "axum-hello",
        Track::AxumMastery,
        "02 · Axum foundations",
        "Router, handlers, TcpListener, and serve",
        "Build the smallest current Axum server and know what each line contributes.",
        [
            "Router maps requests to services. A handler is an async function whose inputs are extractors and whose output implements IntoResponse.",
            "axum::serve accepts a Tokio TcpListener and a make-service-compatible application."
        ],
        Difficulty::Beginner,
        18,
        60,
        [
            (
                "Axum · Example",
                "https://docs.rs/axum/latest/axum/#example"
            ),
            (
                "Axum · serve",
                "https://docs.rs/axum/latest/axum/fn.serve.html"
            )
        ],
        (
            "Create a GET / route and serve it on a Tokio TcpListener.",
            "use axum::{routing::get, Router};\n\nasync fn root() -> &'static str { \"Hello\" }\n\n#[tokio::main]\nasync fn main() {\n}\n",
            "use axum::{routing::get, Router};\n\nasync fn root() -> &'static str { \"Hello, Axum!\" }\n\n#[tokio::main]\nasync fn main() {\n    let app = Router::new().route(\"/\", get(root));\n    let listener = tokio::net::TcpListener::bind(\"127.0.0.1:3000\").await.unwrap();\n    axum::serve(listener, app).await.unwrap();\n}\n",
            [
                "Router::new",
                ".route(\"/\", get(root))",
                "TcpListener::bind",
                "axum::serve"
            ],
            "Bind before calling serve; both operations are asynchronous."
        ),
        (
            "What must a handler return?",
            [
                "Only String",
                "Something implementing IntoResponse",
                "A Hyper connection"
            ],
            1,
            "Axum converts many standard and framework types through IntoResponse."
        )
    ),
    lesson!(
        "axum-routing",
        Track::AxumMastery,
        "02 · Axum foundations",
        "MethodRouter and route composition",
        "Compose method-specific handlers without macros or stringly typed dispatch logic.",
        [
            "get, post, put, patch, delete, head, options, trace, and any create MethodRouter values.",
            "A MethodRouter can chain methods for one path; merge combines routers while route_service mounts an arbitrary service."
        ],
        Difficulty::Beginner,
        18,
        60,
        [
            (
                "Axum · routing",
                "https://docs.rs/axum/latest/axum/routing/"
            ),
            (
                "Axum · MethodRouter",
                "https://docs.rs/axum/latest/axum/routing/method_routing/struct.MethodRouter.html"
            )
        ],
        (
            "Route GET and POST /users to separate handlers and merge a health router.",
            "use axum::{routing::{get, post}, Router};\n\nasync fn list() {}\nasync fn create() {}\nasync fn health() {}\n\nfn app() -> Router { Router::new() }\n\nfn main() {}\n",
            "use axum::{routing::{get, post}, Router};\n\nasync fn list() {}\nasync fn create() {}\nasync fn health() {}\n\nfn app() -> Router {\n    let health = Router::new().route(\"/health\", get(health));\n    Router::new()\n        .route(\"/users\", get(list).post(create))\n        .merge(health)\n}\n\nfn main() {}\n",
            [
                "get(list).post(create)",
                ".merge(health)",
                "route(\"/health\""
            ],
            "Chain post directly on the GET MethodRouter."
        ),
        (
            "When should route_service be considered?",
            [
                "Mounting a type that already implements Service",
                "Defining a local variable",
                "Parsing JSON"
            ],
            0,
            "route_service connects non-handler Tower services to a path."
        )
    ),
    lesson!(
        "axum-paths",
        Track::AxumMastery,
        "02 · Axum foundations",
        "Path syntax, nesting, merging, and fallbacks",
        "Design route trees whose matching and fallback behavior stays predictable.",
        [
            "Current path parameters use {id}; wildcards use {*rest}. Static and dynamic routes can coexist.",
            "nest applies a prefix and strips it for the nested service; fallbacks handle unmatched paths or methods at deliberate scopes."
        ],
        Difficulty::Intermediate,
        20,
        65,
        [(
            "Axum · Router",
            "https://docs.rs/axum/latest/axum/struct.Router.html"
        )],
        (
            "Nest an API router, use a {id} route, and add a top-level fallback.",
            "use axum::{routing::get, Router};\nasync fn user() {}\nasync fn missing() {}\n\nfn app() -> Router { Router::new() }\n\nfn main() {}\n",
            "use axum::{routing::get, Router};\nasync fn user() {}\nasync fn missing() {}\n\nfn app() -> Router {\n    let api = Router::new().route(\"/users/{id}\", get(user));\n    Router::new().nest(\"/api\", api).fallback(missing)\n}\n\nfn main() {}\n",
            [
                "route(\"/users/{id}\"",
                ".nest(\"/api\", api)",
                ".fallback(missing)"
            ],
            "Define child routes without repeating the /api prefix."
        ),
        (
            "What does nest do with the matched prefix?",
            [
                "It strips the prefix before forwarding to the nested service",
                "It converts it into JSON",
                "It rejects every nested route"
            ],
            0,
            "Nested routing sees the remaining URI path while OriginalUri can preserve the original."
        )
    ),
    lesson!(
        "axum-handlers",
        Track::AxumMastery,
        "02 · Axum foundations",
        "Handler rules and diagnostics",
        "Recognize why a seemingly ordinary async function may not satisfy Handler.",
        [
            "Handlers are async, take at most 16 extractor arguments, and return IntoResponse values.",
            "The resulting future must be Send; holding a non-Send guard across await is a frequent cause. #[debug_handler] improves diagnostics."
        ],
        Difficulty::Intermediate,
        22,
        70,
        [
            (
                "Axum · handler",
                "https://docs.rs/axum/latest/axum/handler/"
            ),
            (
                "Axum · debug_handler",
                "https://docs.rs/axum/latest/axum/attr.debug_handler.html"
            )
        ],
        (
            "Annotate an async handler for clearer diagnostics and return a status/body tuple.",
            "use axum::{http::StatusCode, response::IntoResponse};\n\nasync fn health() -> impl IntoResponse {\n    todo!()\n}\n\nfn main() {}\n",
            "use axum::{debug_handler, http::StatusCode, response::IntoResponse};\n\n#[debug_handler]\nasync fn health() -> impl IntoResponse {\n    (StatusCode::OK, \"ready\")\n}\n\nfn main() {}\n",
            [
                "debug_handler",
                "async fn health",
                "-> impl IntoResponse",
                "StatusCode::OK"
            ],
            "Enable Axum's macros feature to use debug_handler."
        ),
        (
            "Why might holding std::sync::MutexGuard across await break a handler?",
            [
                "The handler future may become non-Send",
                "MutexGuard implements IntoResponse",
                "await requires JSON"
            ],
            0,
            "Axum handlers generally need Send futures, and many synchronous guards are not Send across suspension points."
        )
    ),
    lesson!(
        "axum-path-query",
        Track::AxumMastery,
        "03 · Extractors",
        "Path, Query, and request parts",
        "Deserialize URI data into explicit request models and let rejections handle malformed inputs.",
        [
            "Path<T> deserializes route captures; Query<T> deserializes the query string.",
            "Method, Uri, Version, HeaderMap, and Extension can extract directly from request parts without consuming the body."
        ],
        Difficulty::Beginner,
        20,
        65,
        [
            (
                "Axum · extract",
                "https://docs.rs/axum/latest/axum/extract/"
            ),
            (
                "Axum · Path",
                "https://docs.rs/axum/latest/axum/extract/struct.Path.html"
            ),
            (
                "Axum · Query",
                "https://docs.rs/axum/latest/axum/extract/struct.Query.html"
            )
        ],
        (
            "Extract a numeric user id and typed pagination query from one handler.",
            "use axum::extract::{Path, Query};\nuse serde::Deserialize;\n\n#[derive(Deserialize)]\nstruct Page { page: usize }\n\nasync fn user() {}\nfn main() {}\n",
            "use axum::extract::{Path, Query};\nuse serde::Deserialize;\n\n#[derive(Deserialize)]\nstruct Page { page: usize }\n\nasync fn user(Path(id): Path<u64>, Query(page): Query<Page>) -> String {\n    format!(\"user={id} page={}\", page.page)\n}\nfn main() {}\n",
            [
                "Path(id): Path<u64>",
                "Query(page): Query<Page>",
                "#[derive(Deserialize)]"
            ],
            "Pattern-match the extractor wrappers in the parameter list."
        ),
        (
            "Do Path and Query consume the request body?",
            ["Both do", "Neither does", "Only Path does"],
            1,
            "They operate on URI/request parts and therefore implement FromRequestParts."
        )
    ),
    lesson!(
        "axum-bodies",
        Track::AxumMastery,
        "03 · Extractors",
        "Json, Form, bytes, strings, and Request",
        "Consume the body once, at the correct point in the extractor list.",
        [
            "Json<T> and Form<T> deserialize structured bodies; Bytes and String buffer raw content; Body or Request provides lower-level streaming/control.",
            "A body-consuming FromRequest extractor must be last because the request body is a one-shot asynchronous stream."
        ],
        Difficulty::Intermediate,
        22,
        70,
        [
            (
                "Axum · extract",
                "https://docs.rs/axum/latest/axum/extract/#applying-multiple-extractors"
            ),
            (
                "Axum · Json",
                "https://docs.rs/axum/latest/axum/struct.Json.html"
            ),
            (
                "Axum · Form",
                "https://docs.rs/axum/latest/axum/struct.Form.html"
            )
        ],
        (
            "Accept request headers first and a typed JSON body last, then return JSON.",
            "use axum::{http::HeaderMap, Json};\nuse serde::{Deserialize, Serialize};\n\n#[derive(Deserialize, Serialize)]\nstruct User { name: String }\n\nasync fn create() {}\nfn main() {}\n",
            "use axum::{http::HeaderMap, Json};\nuse serde::{Deserialize, Serialize};\n\n#[derive(Deserialize, Serialize)]\nstruct User { name: String }\n\nasync fn create(headers: HeaderMap, Json(user): Json<User>) -> Json<User> {\n    let _ = headers;\n    Json(user)\n}\nfn main() {}\n",
            [
                "headers: HeaderMap",
                "Json(user): Json<User>",
                "-> Json<User>",
                "Json(user)"
            ],
            "Place Json last because it consumes the body."
        ),
        (
            "Why may only one handler argument consume the body?",
            [
                "HTTP methods forbid multiple arguments",
                "The body is a stream that can be taken once",
                "Serde supports one type"
            ],
            1,
            "Once consumed or buffered, the original stream is no longer available to another extractor."
        )
    ),
    lesson!(
        "axum-rejections",
        Track::AxumMastery,
        "03 · Extractors",
        "Extractor ordering, Option, Result, and rejections",
        "Take control of malformed or missing input without bypassing Axum's extraction model.",
        [
            "Wrap an extractor in Result to handle its rejection locally. Supported optional extractors can use Option to distinguish absence.",
            "Rejection enums are often non_exhaustive; include a catch-all when matching them."
        ],
        Difficulty::Intermediate,
        24,
        75,
        [
            (
                "Axum · Handling extractor rejections",
                "https://docs.rs/axum/latest/axum/extract/#handling-extractor-rejections"
            ),
            (
                "Axum · rejection",
                "https://docs.rs/axum/latest/axum/extract/rejection/"
            )
        ],
        (
            "Accept Result<Json<Value>, JsonRejection> and map failure to BAD_REQUEST.",
            "use axum::{extract::rejection::JsonRejection, http::StatusCode, Json};\nuse serde_json::Value;\n\nasync fn ingest() {}\nfn main() {}\n",
            "use axum::{extract::rejection::JsonRejection, http::StatusCode, Json};\nuse serde_json::Value;\n\nasync fn ingest(payload: Result<Json<Value>, JsonRejection>) -> Result<Json<Value>, StatusCode> {\n    payload.map_err(|_| StatusCode::BAD_REQUEST)\n}\nfn main() {}\n",
            [
                "Result<Json<Value>, JsonRejection>",
                "map_err",
                "StatusCode::BAD_REQUEST"
            ],
            "Result prevents the default rejection response and hands the error to your handler."
        ),
        (
            "Why include a wildcard arm for many rejection enums?",
            [
                "They are marked non_exhaustive",
                "They contain strings",
                "match cannot inspect errors"
            ],
            0,
            "non_exhaustive lets Axum add variants without a breaking release."
        )
    ),
    lesson!(
        "axum-custom-extractors",
        Track::AxumMastery,
        "03 · Extractors",
        "Custom FromRequestParts and FromRequest",
        "Turn repeated request validation into reusable, typed boundaries.",
        [
            "Implement FromRequestParts when only method, URI, headers, extensions, or state are needed.",
            "Implement FromRequest when body access is required. Define a rejection that implements IntoResponse."
        ],
        Difficulty::Advanced,
        28,
        90,
        [
            (
                "Axum · Defining custom extractors",
                "https://docs.rs/axum/latest/axum/extract/#defining-custom-extractors"
            ),
            (
                "Axum · FromRequestParts",
                "https://docs.rs/axum/latest/axum/extract/trait.FromRequestParts.html"
            )
        ],
        (
            "Sketch an extractor that reads x-api-key from request parts and rejects with UNAUTHORIZED.",
            "use axum::{extract::FromRequestParts, http::{request::Parts, StatusCode}};\n\nstruct ApiKey(String);\n\nfn main() {}\n",
            "use axum::{extract::FromRequestParts, http::{request::Parts, StatusCode}};\n\nstruct ApiKey(String);\n\nimpl<S: Send + Sync> FromRequestParts<S> for ApiKey {\n    type Rejection = StatusCode;\n\n    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {\n        parts.headers.get(\"x-api-key\")\n            .and_then(|value| value.to_str().ok())\n            .map(|value| ApiKey(value.to_owned()))\n            .ok_or(StatusCode::UNAUTHORIZED)\n    }\n}\n\nfn main() {}\n",
            [
                "impl<S: Send + Sync> FromRequestParts<S>",
                "type Rejection = StatusCode",
                "async fn from_request_parts",
                "StatusCode::UNAUTHORIZED"
            ],
            "Request-parts extraction leaves the body untouched for a later extractor."
        ),
        (
            "Which trait fits a header-only extractor?",
            ["FromRequestParts", "IntoResponse", "Service"],
            0,
            "Headers are available in request parts, so no body consumption is necessary."
        )
    ),
    lesson!(
        "axum-responses",
        Track::AxumMastery,
        "04 · Responses and errors",
        "IntoResponse, tuples, headers, and bodies",
        "Build responses compositionally while keeping handler return types understandable.",
        [
            "Strings, bytes, status codes, headers, Redirect, Json, Html, and Response implement or help produce IntoResponse.",
            "Tuples apply response parts before a final body. Use Response when branches cannot share one concrete impl IntoResponse type."
        ],
        Difficulty::Intermediate,
        22,
        70,
        [
            (
                "Axum · response",
                "https://docs.rs/axum/latest/axum/response/"
            ),
            (
                "Axum · IntoResponse",
                "https://docs.rs/axum/latest/axum/response/trait.IntoResponse.html"
            )
        ],
        (
            "Return CREATED, one Location header, and a JSON body as a response tuple.",
            "use axum::{http::{header, StatusCode}, Json};\nuse serde_json::{json, Value};\n\nasync fn create() -> (StatusCode, [(header::HeaderName, &'static str); 1], Json<Value>) {\n    todo!()\n}\nfn main() {}\n",
            "use axum::{http::{header, StatusCode}, Json};\nuse serde_json::{json, Value};\n\nasync fn create() -> (StatusCode, [(header::HeaderName, &'static str); 1], Json<Value>) {\n    (\n        StatusCode::CREATED,\n        [(header::LOCATION, \"/users/1\")],\n        Json(json!({\"id\": 1})),\n    )\n}\nfn main() {}\n",
            ["StatusCode::CREATED", "header::LOCATION", "Json(json!"],
            "The final tuple element supplies the response body."
        ),
        (
            "Why can `impl IntoResponse` be awkward with different branch types?",
            [
                "impl Trait still denotes one concrete return type",
                "IntoResponse has no implementations",
                "HTTP forbids branching"
            ],
            0,
            "Each return path must resolve to the same hidden concrete type; converting branches to Response erases that difference."
        )
    ),
    lesson!(
        "axum-errors",
        Track::AxumMastery,
        "04 · Responses and errors",
        "Application errors and infallible serving",
        "Convert domain failures into HTTP responses before they reach Hyper as service errors.",
        [
            "Handlers commonly return Result<T, E> where both T and E implement IntoResponse.",
            "Axum's error model aims to ensure requests receive responses. A Tower middleware error must be mapped with HandleErrorLayer or avoided with an infallible HTTP-specific layer."
        ],
        Difficulty::Intermediate,
        24,
        75,
        [
            (
                "Axum · error_handling",
                "https://docs.rs/axum/latest/axum/error_handling/"
            ),
            (
                "Axum · HandleErrorLayer",
                "https://docs.rs/axum/latest/axum/error_handling/struct.HandleErrorLayer.html"
            )
        ],
        (
            "Define an AppError that turns a NotFound variant into a JSON 404 response.",
            "use axum::{http::StatusCode, response::{IntoResponse, Response}, Json};\nuse serde_json::json;\n\nenum AppError { NotFound }\n\nfn main() {}\n",
            "use axum::{http::StatusCode, response::{IntoResponse, Response}, Json};\nuse serde_json::json;\n\nenum AppError { NotFound }\n\nimpl IntoResponse for AppError {\n    fn into_response(self) -> Response {\n        (StatusCode::NOT_FOUND, Json(json!({\"error\": \"not found\"}))).into_response()\n    }\n}\n\nfn main() {}\n",
            [
                "impl IntoResponse for AppError",
                "fn into_response",
                "StatusCode::NOT_FOUND",
                ".into_response()"
            ],
            "Delegate to the tuple's existing IntoResponse implementation."
        ),
        (
            "What can happen if Hyper receives a service error before a response exists?",
            [
                "The connection may close without an HTTP response",
                "It always invents a 404",
                "The request is retried forever"
            ],
            0,
            "Axum therefore expects middleware errors to be handled and converted into responses."
        )
    ),
    lesson!(
        "axum-state",
        Track::AxumMastery,
        "05 · State",
        "State, FromRef, Extension, and shared ownership",
        "Make dependencies explicit and cheap to clone across concurrent requests.",
        [
            "Router::with_state provides state and State<T> extracts it type-safely. Router<S> means a router still missing S, not a router already holding S.",
            "FromRef derives substates; Extension uses request extensions and is useful for middleware-inserted request-scoped data."
        ],
        Difficulty::Intermediate,
        24,
        75,
        [
            (
                "Axum · Sharing state",
                "https://docs.rs/axum/latest/axum/#sharing-state-with-handlers"
            ),
            (
                "Axum · State",
                "https://docs.rs/axum/latest/axum/extract/struct.State.html"
            ),
            (
                "Axum · FromRef",
                "https://docs.rs/axum/latest/axum/extract/trait.FromRef.html"
            )
        ],
        (
            "Attach cloneable Arc state to a Router and extract it in a handler.",
            "use std::sync::Arc;\nuse axum::{extract::State, routing::get, Router};\n\n#[derive(Default)]\nstruct AppState { name: String }\n\nasync fn name() {}\nfn main() {}\n",
            "use std::sync::Arc;\nuse axum::{extract::State, routing::get, Router};\n\n#[derive(Default)]\nstruct AppState { name: String }\n\nasync fn name(State(state): State<Arc<AppState>>) -> String {\n    state.name.clone()\n}\n\nfn app() -> Router {\n    Router::new().route(\"/name\", get(name)).with_state(Arc::new(AppState::default()))\n}\nfn main() {}\n",
            [
                "State(state): State<Arc<AppState>>",
                ".with_state(Arc::new",
                "route(\"/name\""
            ],
            "State is cloned per request; Arc keeps that clone cheap."
        ),
        (
            "What does Router<AppState> usually mean?",
            [
                "The router has no routes",
                "The router is still missing an AppState",
                "AppState is global static data"
            ],
            1,
            "The type parameter tracks state that must still be supplied with with_state."
        )
    ),
    lesson!(
        "axum-middleware",
        Track::AxumMastery,
        "06 · Middleware",
        "Router layers, route layers, and ordering",
        "Apply policy at the narrowest correct scope and read layer order from the request's perspective.",
        [
            "Router::layer wraps all current routes; route_layer applies only to current routes and can reject unmatched requests without hiding 404s.",
            "Layers added later wrap earlier layers, so request order is typically bottom-to-top and response order reverses."
        ],
        Difficulty::Intermediate,
        24,
        80,
        [
            (
                "Axum · middleware",
                "https://docs.rs/axum/latest/axum/middleware/"
            ),
            (
                "Axum · Router::layer",
                "https://docs.rs/axum/latest/axum/struct.Router.html#method.layer"
            )
        ],
        (
            "Apply TraceLayer to the router and an auth middleware only to one protected route.",
            "use axum::{middleware, routing::get, Router};\nuse tower_http::trace::TraceLayer;\n\nasync fn dashboard() {}\nasync fn auth() {}\nfn main() {}\n",
            "use axum::{middleware, routing::get, Router};\nuse tower_http::trace::TraceLayer;\n\nasync fn dashboard() {}\nasync fn auth(request: axum::extract::Request, next: middleware::Next) -> axum::response::Response {\n    next.run(request).await\n}\n\nfn app() -> Router {\n    Router::new()\n        .route(\"/dashboard\", get(dashboard))\n        .route_layer(middleware::from_fn(auth))\n        .layer(TraceLayer::new_for_http())\n}\nfn main() {}\n",
            [
                "route_layer(middleware::from_fn(auth))",
                ".layer(TraceLayer::new_for_http())",
                "next.run(request).await"
            ],
            "route_layer is useful for authorization on already matched routes."
        ),
        (
            "Why use route_layer for authorization?",
            [
                "It runs only after a route matches, preserving normal 404 behavior",
                "It disables extractors",
                "It makes every route public"
            ],
            0,
            "A global rejecting layer can turn unknown routes into authentication failures and leak routing behavior."
        )
    ),
    lesson!(
        "axum-custom-middleware",
        Track::AxumMastery,
        "06 · Middleware",
        "from_fn, map layers, and custom Layer/Service",
        "Start ergonomic, then drop to Tower traits when middleware must be reusable or highly configurable.",
        [
            "from_fn supports extractors, Request, Next, and response creation. from_fn_with_state adds State extraction.",
            "map_request and map_response transform messages; a custom Layer manufactures a custom Service wrapping an inner service."
        ],
        Difficulty::Advanced,
        30,
        95,
        [
            (
                "Axum · from_fn",
                "https://docs.rs/axum/latest/axum/middleware/fn.from_fn.html"
            ),
            (
                "Axum · Writing middleware",
                "https://docs.rs/axum/latest/axum/middleware/#writing-middleware"
            ),
            (
                "Tower · Layer",
                "https://docs.rs/tower/latest/tower/trait.Layer.html"
            )
        ],
        (
            "Write from_fn middleware that adds an x-powered-by response header.",
            "use axum::{extract::Request, http::{header::HeaderName, HeaderValue}, middleware::Next, response::Response};\n\nasync fn powered_by(request: Request, next: Next) -> Response {\n    todo!()\n}\nfn main() {}\n",
            "use axum::{extract::Request, http::{header::HeaderName, HeaderValue}, middleware::Next, response::Response};\n\nasync fn powered_by(request: Request, next: Next) -> Response {\n    let mut response = next.run(request).await;\n    response.headers_mut().insert(\n        HeaderName::from_static(\"x-powered-by\"),\n        HeaderValue::from_static(\"axum\"),\n    );\n    response\n}\nfn main() {}\n",
            [
                "next.run(request).await",
                "response.headers_mut().insert",
                "HeaderValue::from_static"
            ],
            "Await the inner service before mutating its response."
        ),
        (
            "What does a Tower Layer do?",
            [
                "Transforms one Service into another Service",
                "Parses only JSON",
                "Starts the Tokio runtime"
            ],
            0,
            "Layer is the middleware factory abstraction; its output wraps the inner Service."
        )
    ),
    lesson!(
        "axum-server",
        Track::AxumMastery,
        "07 · Server lifecycle",
        "ConnectInfo, listeners, and graceful shutdown",
        "Treat binding, peer metadata, and shutdown as application lifecycle concerns.",
        [
            "TcpListener makes address binding explicit. ConnectInfo extracts metadata supplied by the make service or serve setup.",
            "with_graceful_shutdown stops accepting new connections after a future resolves and lets in-flight work finish within surrounding process policy."
        ],
        Difficulty::Intermediate,
        24,
        80,
        [
            (
                "Axum · serve",
                "https://docs.rs/axum/latest/axum/fn.serve.html"
            ),
            (
                "Axum · ConnectInfo",
                "https://docs.rs/axum/latest/axum/extract/connect_info/struct.ConnectInfo.html"
            )
        ],
        (
            "Serve a router with Ctrl+C graceful shutdown.",
            "use axum::Router;\n\n#[tokio::main]\nasync fn main() {\n    let app = Router::new();\n}\n",
            "use axum::Router;\n\n#[tokio::main]\nasync fn main() {\n    let app = Router::new();\n    let listener = tokio::net::TcpListener::bind(\"127.0.0.1:3000\").await.unwrap();\n    axum::serve(listener, app)\n        .with_graceful_shutdown(async { tokio::signal::ctrl_c().await.unwrap(); })\n        .await\n        .unwrap();\n}\n",
            [
                "TcpListener::bind",
                "axum::serve",
                ".with_graceful_shutdown",
                "tokio::signal::ctrl_c"
            ],
            "The shutdown signal is simply a Future<Output = ()>."
        ),
        (
            "What triggers graceful shutdown?",
            [
                "A future passed to with_graceful_shutdown completes",
                "Every 404",
                "Dropping a JSON value"
            ],
            0,
            "The server watches the supplied future and begins graceful shutdown when it resolves."
        )
    ),
    lesson!(
        "axum-testing",
        Track::AxumMastery,
        "07 · Server lifecycle",
        "Testing Routers as Services",
        "Exercise the full routing/extraction/response path without binding a TCP port.",
        [
            "Router implements Service<Request>, so tower::ServiceExt::oneshot can send an in-memory request through it.",
            "Use http-body-util BodyExt to collect bodies. Integration tests can still bind ephemeral ports when transport behavior matters."
        ],
        Difficulty::Intermediate,
        24,
        80,
        [
            (
                "Axum · Testing example",
                "https://github.com/tokio-rs/axum/tree/main/examples/testing"
            ),
            (
                "Tower · ServiceExt",
                "https://docs.rs/tower/latest/tower/trait.ServiceExt.html"
            )
        ],
        (
            "Send an in-memory GET /health request through a Router with oneshot.",
            "use axum::{body::Body, http::Request, routing::get, Router};\nuse tower::ServiceExt;\n\nasync fn health() -> &'static str { \"ok\" }\n\n#[tokio::test]\nasync fn test_health() {}\n",
            "use axum::{body::Body, http::{Request, StatusCode}, routing::get, Router};\nuse tower::ServiceExt;\n\nasync fn health() -> &'static str { \"ok\" }\n\n#[tokio::test]\nasync fn test_health() {\n    let app = Router::new().route(\"/health\", get(health));\n    let response = app.oneshot(Request::builder().uri(\"/health\").body(Body::empty()).unwrap()).await.unwrap();\n    assert_eq!(response.status(), StatusCode::OK);\n}\n",
            [
                "#[tokio::test]",
                ".oneshot",
                "Request::builder",
                "assert_eq!"
            ],
            "oneshot drives readiness and one call for you."
        ),
        (
            "Why can Router tests skip TCP?",
            [
                "Router is a Tower Service",
                "HTTP works only in memory",
                "Tokio forbids sockets in tests"
            ],
            0,
            "Service<Request> is the same abstraction the server drives, so requests can be injected directly."
        )
    ),
    lesson!(
        "axum-websockets",
        Track::AxumMastery,
        "08 · Streaming and files",
        "WebSocket upgrades and split streams",
        "Move an HTTP connection into a bidirectional message protocol safely.",
        [
            "WebSocketUpgrade is a feature-gated extractor; on_upgrade runs after the HTTP upgrade response.",
            "A WebSocket can receive/send sequentially or be split for concurrent reading and writing. Always handle disconnects and task cancellation."
        ],
        Difficulty::Advanced,
        28,
        90,
        [(
            "Axum · WebSockets",
            "https://docs.rs/axum/latest/axum/extract/ws/"
        )],
        (
            "Route any method to a WebSocket upgrade and echo messages in the upgraded task.",
            "use axum::{extract::ws::{WebSocket, WebSocketUpgrade}, response::Response, routing::any, Router};\n\nasync fn ws() {}\nasync fn echo() {}\nfn main() {}\n",
            "use axum::{extract::ws::{WebSocket, WebSocketUpgrade}, response::Response, routing::any, Router};\n\nasync fn ws(upgrade: WebSocketUpgrade) -> Response {\n    upgrade.on_upgrade(echo)\n}\n\nasync fn echo(mut socket: WebSocket) {\n    while let Some(Ok(message)) = socket.recv().await {\n        if socket.send(message).await.is_err() { break; }\n    }\n}\n\nfn app() -> Router { Router::new().route(\"/ws\", any(ws)) }\nfn main() {}\n",
            [
                "WebSocketUpgrade",
                ".on_upgrade(echo)",
                "socket.recv().await",
                "socket.send(message).await"
            ],
            "The upgraded connection is handled in a separate async callback."
        ),
        (
            "When does the on_upgrade callback run?",
            [
                "After the HTTP upgrade succeeds",
                "Before routing",
                "At compile time"
            ],
            0,
            "The handler returns the upgrade response, then Axum hands the upgraded stream to the callback."
        )
    ),
    lesson!(
        "axum-sse",
        Track::AxumMastery,
        "08 · Streaming and files",
        "Server-Sent Events and keep-alives",
        "Stream one-way events over HTTP while respecting disconnects and buffering behavior.",
        [
            "Sse wraps a Stream of Result<Event, E>. Event configures data, event name, id, retry, and comments.",
            "KeepAlive periodically emits comments; production streams need bounded resources and cancellation when clients leave."
        ],
        Difficulty::Advanced,
        26,
        85,
        [
            (
                "Axum · Sse",
                "https://docs.rs/axum/latest/axum/response/sse/struct.Sse.html"
            ),
            (
                "Axum · response::sse",
                "https://docs.rs/axum/latest/axum/response/sse/"
            )
        ],
        (
            "Return an SSE stream with one ready event and a keep-alive policy.",
            "use axum::response::sse::{Event, KeepAlive, Sse};\nuse std::convert::Infallible;\n\nasync fn events() {}\nfn main() {}\n",
            "use axum::response::sse::{Event, KeepAlive, Sse};\nuse std::convert::Infallible;\n\nasync fn events() -> Sse<impl futures_core::Stream<Item = Result<Event, Infallible>>> {\n    let stream = futures_util::stream::once(async { Ok(Event::default().event(\"status\").data(\"ready\")) });\n    Sse::new(stream).keep_alive(KeepAlive::default())\n}\nfn main() {}\n",
            [
                "Sse<",
                "Result<Event, Infallible>",
                "Event::default",
                ".keep_alive"
            ],
            "Each stream item is a Result because streaming can fail after headers are sent."
        ),
        (
            "How does SSE differ from WebSockets?",
            [
                "SSE is server-to-client over HTTP; WebSockets are bidirectional",
                "SSE is binary-only",
                "WebSockets cannot stream"
            ],
            0,
            "SSE is a simple one-way event stream; WebSockets support messages in both directions."
        )
    ),
    lesson!(
        "axum-payloads",
        Track::AxumMastery,
        "08 · Streaming and files",
        "Multipart, file services, and body limits",
        "Bound memory and disk exposure whenever requests or responses carry large payloads.",
        [
            "Multipart is feature-gated and yields fields sequentially. Apply DefaultBodyLimit or RequestBodyLimitLayer according to endpoint policy.",
            "tower-http ServeDir/ServeFile handles static content, range requests, and content types; do not expose unintended filesystem roots."
        ],
        Difficulty::Advanced,
        28,
        90,
        [
            (
                "Axum · Multipart",
                "https://docs.rs/axum/latest/axum/extract/struct.Multipart.html"
            ),
            (
                "Axum · DefaultBodyLimit",
                "https://docs.rs/axum/latest/axum/extract/struct.DefaultBodyLimit.html"
            ),
            (
                "tower-http · services",
                "https://docs.rs/tower-http/latest/tower_http/services/"
            )
        ],
        (
            "Limit one upload route to 10 MiB and extract Multipart.",
            "use axum::{extract::{DefaultBodyLimit, Multipart}, routing::post, Router};\n\nasync fn upload() {}\nfn main() {}\n",
            "use axum::{extract::{DefaultBodyLimit, Multipart}, routing::post, Router};\n\nasync fn upload(mut multipart: Multipart) {\n    while let Some(field) = multipart.next_field().await.unwrap() {\n        let _name = field.name().unwrap_or(\"unnamed\").to_owned();\n    }\n}\n\nfn app() -> Router {\n    Router::new().route(\"/upload\", post(upload)).layer(DefaultBodyLimit::max(10 * 1024 * 1024))\n}\nfn main() {}\n",
            [
                "multipart: Multipart",
                "multipart.next_field().await",
                "DefaultBodyLimit::max(10 * 1024 * 1024)"
            ],
            "Read fields sequentially and enforce a limit before buffering."
        ),
        (
            "Why limit bodies before processing?",
            [
                "To bound resource use from untrusted payloads",
                "To enable routing",
                "To make every request JSON"
            ],
            0,
            "Unbounded buffering is a denial-of-service risk even when application parsing is correct."
        )
    ),
    lesson!(
        "axum-features",
        Track::AxumMastery,
        "09 · Axum surface audit",
        "Feature flags, macros, and integrations",
        "Enable only the API surface a service actually needs and know where companion crates begin.",
        [
            "Axum defaults include form, http1, json, query, Tokio integration, and tracing; http2, macros, multipart, and ws are opt-in.",
            "axum-extra hosts additional extractors and responses; axum-core supports framework authors. Feature choices affect compile time and dependency surface."
        ],
        Difficulty::Intermediate,
        20,
        70,
        [
            (
                "Axum · Feature flags",
                "https://docs.rs/axum/latest/axum/#feature-flags"
            ),
            (
                "axum-extra",
                "https://docs.rs/axum-extra/latest/axum_extra/"
            ),
            ("axum-core", "https://docs.rs/axum-core/latest/axum_core/")
        ],
        (
            "Use cfg to compile a WebSocket route only when a local ws feature is enabled.",
            "use axum::Router;\n\nfn base() -> Router { Router::new() }\nfn main() {}\n",
            "use axum::Router;\n\nfn base() -> Router { Router::new() }\n\n#[cfg(feature = \"ws\")]\nfn with_websocket(app: Router) -> Router {\n    use axum::routing::any;\n    app.route(\"/ws\", any(|| async {}))\n}\n\nfn main() {}\n",
            [
                "#[cfg(feature = \"ws\")]",
                "fn with_websocket",
                "routing::any"
            ],
            "Your crate feature can forward to Axum's ws feature in Cargo.toml."
        ),
        (
            "Are Axum's ws and multipart APIs always compiled?",
            ["Yes", "No, they are feature-gated", "Only on Windows"],
            1,
            "Opt-in features keep unused protocol and parsing dependencies out of the graph."
        )
    ),
    lesson!(
        "tower-service",
        Track::AxumMastery,
        "10 · Tower core",
        "tower::Service as an async function",
        "Read every Axum router and middleware stack as one typed request-to-response machine.",
        [
            "Service<Request> has associated Response, Error, and Future types plus poll_ready and call.",
            "call may return a future borrowing or owning internal work. Cloning a service before readiness can violate expectations; use ready or ready_oneshot."
        ],
        Difficulty::Advanced,
        30,
        100,
        [
            (
                "Tower · Service",
                "https://docs.rs/tower/latest/tower/trait.Service.html"
            ),
            (
                "tower-service",
                "https://docs.rs/tower-service/latest/tower_service/"
            )
        ],
        (
            "Implement an always-ready Service<&str> that uppercases requests.",
            "use std::{convert::Infallible, future::{ready, Ready}, task::{Context, Poll}};\nuse tower::Service;\n\n#[derive(Clone)]\nstruct Uppercase;\n\nfn main() {}\n",
            "use std::{convert::Infallible, future::{ready, Ready}, task::{Context, Poll}};\nuse tower::Service;\n\n#[derive(Clone)]\nstruct Uppercase;\n\nimpl Service<&str> for Uppercase {\n    type Response = String;\n    type Error = Infallible;\n    type Future = Ready<Result<String, Infallible>>;\n\n    fn poll_ready(&mut self, _cx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> { Poll::Ready(Ok(())) }\n    fn call(&mut self, request: &str) -> Self::Future { ready(Ok(request.to_uppercase())) }\n}\n\nfn main() {}\n",
            [
                "impl Service<&str> for Uppercase",
                "type Response = String",
                "fn poll_ready",
                "fn call"
            ],
            "The associated Future type describes the asynchronous response computation."
        ),
        (
            "What is the best first mental model for Service?",
            [
                "An async Request -> Result<Response, Error> function with readiness",
                "A database table",
                "A Tokio thread"
            ],
            0,
            "The async-function analogy is useful, with poll_ready adding capacity/backpressure signaling."
        )
    ),
    lesson!(
        "tower-readiness",
        Track::AxumMastery,
        "10 · Tower core",
        "Readiness, backpressure, and load",
        "Do not send work faster than a service can safely accept it.",
        [
            "poll_ready reserves or reports capacity before call. Backpressure propagates upstream by delaying readiness.",
            "Axum routing assumes endpoint services do not require per-route backpressure; buffer or otherwise adapt services that do."
        ],
        Difficulty::Advanced,
        28,
        95,
        [
            (
                "Tower guide · Service and backpressure",
                "https://github.com/tower-rs/tower/tree/master/guides"
            ),
            (
                "Axum · Routing to services and backpressure",
                "https://docs.rs/axum/latest/axum/middleware/#routing-to-servicesmiddleware-and-backpressure"
            )
        ],
        (
            "Use ServiceExt::ready before calling a mutable service.",
            "use tower::{Service, ServiceExt};\n\nasync fn send<S>(service: &mut S)\nwhere S: Service<String>, S::Error: std::fmt::Debug {\n}\nfn main() {}\n",
            "use tower::{Service, ServiceExt};\n\nasync fn send<S>(service: &mut S)\nwhere S: Service<String>, S::Error: std::fmt::Debug {\n    service.ready().await.unwrap().call(String::from(\"work\")).await.ok();\n}\nfn main() {}\n",
            ["service.ready().await", ".call(String::from", "ServiceExt"],
            "ready waits for poll_ready and returns the service reference."
        ),
        (
            "What does backpressure communicate?",
            [
                "Downstream capacity to upstream producers",
                "Only HTTP status codes",
                "Compiler warnings"
            ],
            0,
            "Producers slow down when downstream services are not ready to accept more work."
        )
    ),
    lesson!(
        "tower-layer",
        Track::AxumMastery,
        "10 · Tower core",
        "Layer and ServiceBuilder ordering",
        "Compose middleware types without losing track of execution order.",
        [
            "Layer<S> takes an inner service and produces a wrapped service. ServiceBuilder builds nested layers with readable inference.",
            "ServiceBuilder layers run requests in declaration order; repeated Router::layer calls wrap previously added layers and therefore read differently."
        ],
        Difficulty::Advanced,
        28,
        95,
        [
            (
                "Tower · Layer",
                "https://docs.rs/tower/latest/tower/trait.Layer.html"
            ),
            (
                "Tower · ServiceBuilder",
                "https://docs.rs/tower/latest/tower/struct.ServiceBuilder.html"
            )
        ],
        (
            "Build a stack where tracing observes a 2-second timeout around a service_fn.",
            "use std::time::Duration;\nuse tower::{service_fn, ServiceBuilder};\nuse tower_http::trace::TraceLayer;\n\nfn main() {}\n",
            "use std::time::Duration;\nuse tower::{service_fn, ServiceBuilder};\nuse tower_http::trace::TraceLayer;\n\nfn main() {\n    let _service = ServiceBuilder::new()\n        .layer(TraceLayer::new_for_http())\n        .timeout(Duration::from_secs(2))\n        .service(service_fn(|request: String| async move { Ok::<_, std::convert::Infallible>(request) }));\n}\n",
            [
                "ServiceBuilder::new",
                ".layer(TraceLayer::new_for_http())",
                ".timeout(Duration::from_secs(2))",
                ".service(service_fn"
            ],
            "ServiceBuilder request execution follows the order layers are listed."
        ),
        (
            "What does Layer<S> return?",
            ["A wrapped Service", "An HTTP body only", "A Cargo feature"],
            0,
            "Layer is parameterized by an inner service and its associated Service is the decorated output."
        )
    ),
    lesson!(
        "tower-ext",
        Track::AxumMastery,
        "10 · Tower core",
        "ServiceExt, adapters, boxing, and service_fn",
        "Use Tower's utility vocabulary to test, transform, and erase complex service types.",
        [
            "ServiceExt adds ready, oneshot, map_request, map_response, map_err, and boxed adapters.",
            "service_fn turns an async closure into a Service. Boxing controls enormous concrete types but introduces allocation/dynamic dispatch tradeoffs."
        ],
        Difficulty::Advanced,
        26,
        90,
        [
            (
                "Tower · ServiceExt",
                "https://docs.rs/tower/latest/tower/trait.ServiceExt.html"
            ),
            (
                "Tower · service_fn",
                "https://docs.rs/tower/latest/tower/fn.service_fn.html"
            ),
            ("Tower · util", "https://docs.rs/tower/latest/tower/util/")
        ],
        (
            "Create a service_fn, map its response, and call it once with oneshot.",
            "use tower::{service_fn, ServiceExt};\n\n#[tokio::main]\nasync fn main() {}\n",
            "use tower::{service_fn, ServiceExt};\n\n#[tokio::main]\nasync fn main() {\n    let service = service_fn(|value: u32| async move { Ok::<_, std::convert::Infallible>(value + 1) })\n        .map_response(|value| value * 2);\n    let result = service.oneshot(20).await.unwrap();\n    println!(\"{result}\");\n}\n",
            ["service_fn", ".map_response", ".oneshot(20)"],
            "oneshot consumes the service and handles readiness for a single request."
        ),
        (
            "What tradeoff comes with BoxService?",
            [
                "Simpler erased types at the cost of allocation/dynamic dispatch",
                "No errors are possible",
                "It enables unsafe automatically"
            ],
            0,
            "Boxing is useful at architecture boundaries but removes some static specialization."
        )
    ),
    lesson!(
        "tower-resilience",
        Track::AxumMastery,
        "11 · Tower resilience",
        "Timeouts, limits, buffers, load shedding, and retries",
        "Combine latency and capacity policies without creating retry storms or hidden queues.",
        [
            "Timeout bounds individual work; concurrency and rate limits bound admission; Buffer adds a queue; LoadShed rejects when unready.",
            "Retry requires a Policy and safe replay semantics. Layer order determines whether each retry gets its own timeout or shares an outer budget."
        ],
        Difficulty::Advanced,
        32,
        105,
        [
            (
                "Tower · timeout",
                "https://docs.rs/tower/latest/tower/timeout/"
            ),
            ("Tower · limit", "https://docs.rs/tower/latest/tower/limit/"),
            (
                "Tower · buffer",
                "https://docs.rs/tower/latest/tower/buffer/"
            ),
            ("Tower · retry", "https://docs.rs/tower/latest/tower/retry/")
        ],
        (
            "Use ServiceBuilder to cap concurrency, shed load, and apply a timeout.",
            "use std::time::Duration;\nuse tower::ServiceBuilder;\n\nfn wrap<S>(service: S) {\n}\nfn main() {}\n",
            "use std::time::Duration;\nuse tower::ServiceBuilder;\n\nfn wrap<S>(service: S) {\n    let _wrapped = ServiceBuilder::new()\n        .load_shed()\n        .concurrency_limit(64)\n        .timeout(Duration::from_secs(2))\n        .service(service);\n}\nfn main() {}\n",
            [
                ".load_shed()",
                ".concurrency_limit(64)",
                ".timeout(Duration::from_secs(2))"
            ],
            "Put load shedding outside the constrained service so overload fails fast."
        ),
        (
            "What must a retry policy consider first?",
            [
                "Whether a request is safe and possible to replay",
                "The response font",
                "The number of source files"
            ],
            0,
            "Non-idempotent requests and streaming bodies may not be safely replayable; budgets and backoff also matter."
        )
    ),
    lesson!(
        "tower-routing",
        Track::AxumMastery,
        "11 · Tower resilience",
        "Discovery, balancing, steering, hedging, and reconnect",
        "Understand the client-side service machinery used by higher-level networking stacks.",
        [
            "Discover streams service-set changes; balance distributes load using readiness/load metrics; Steer routes requests among services.",
            "Hedging duplicates slow work after a latency threshold; reconnect recreates broken services. Each technique has resource and correctness costs."
        ],
        Difficulty::Advanced,
        30,
        100,
        [
            (
                "Tower · balance",
                "https://docs.rs/tower/latest/tower/balance/"
            ),
            (
                "Tower · discover",
                "https://docs.rs/tower/latest/tower/discover/"
            ),
            ("Tower · steer", "https://docs.rs/tower/latest/tower/steer/"),
            ("Tower · hedge", "https://docs.rs/tower/latest/tower/hedge/")
        ],
        (
            "Represent a simple request classifier for steering read and write services.",
            "enum Request { Read(String), Write(String) }\n\nfn pick(request: &Request) -> usize {\n    0\n}\nfn main() {}\n",
            "enum Request { Read(String), Write(String) }\n\nfn pick(request: &Request) -> usize {\n    match request {\n        Request::Read(_) => 0,\n        Request::Write(_) => 1,\n    }\n}\nfn main() {}\n",
            [
                "match request",
                "Request::Read(_) => 0",
                "Request::Write(_) => 1"
            ],
            "Steer takes a picker with the same conceptual job: choose a service index for a request."
        ),
        (
            "What input does a load balancer need beyond endpoints?",
            [
                "A load or readiness signal for candidate services",
                "HTML templates",
                "A global mutable string"
            ],
            0,
            "Balancing decisions depend on which services exist and how loaded/ready they are."
        )
    ),
    lesson!(
        "tower-http-observability",
        Track::AxumMastery,
        "12 · tower-http",
        "Tracing, classifiers, request IDs, and sensitive headers",
        "Give every request a correlated, privacy-aware lifecycle in logs.",
        [
            "TraceLayer uses MakeSpan, OnRequest, OnResponse, OnFailure, and classifiers to define request telemetry.",
            "SetRequestIdLayer and PropagateRequestIdLayer correlate work. Mark authorization and cookies sensitive before debug formatting or traces can expose them."
        ],
        Difficulty::Advanced,
        30,
        100,
        [
            (
                "tower-http · trace",
                "https://docs.rs/tower-http/latest/tower_http/trace/"
            ),
            (
                "tower-http · request_id",
                "https://docs.rs/tower-http/latest/tower_http/request_id/"
            ),
            (
                "tower-http · sensitive_headers",
                "https://docs.rs/tower-http/latest/tower_http/sensitive_headers/"
            )
        ],
        (
            "Build an HTTP TraceLayer that includes request headers and records millisecond latency.",
            "use tower_http::{classify::ServerErrorsFailureClass, trace::TraceLayer, LatencyUnit};\n\nfn layer() {\n}\nfn main() {}\n",
            "use tower_http::{classify::ServerErrorsFailureClass, trace::TraceLayer, LatencyUnit};\n\nfn layer() {\n    let _trace = TraceLayer::new_for_http()\n        .make_span_with(|request: &axum::http::Request<axum::body::Body>| {\n            tracing::info_span!(\"http_request\", method = %request.method(), uri = %request.uri())\n        })\n        .on_failure(|failure: ServerErrorsFailureClass, latency: std::time::Duration, _span: &tracing::Span| {\n            tracing::warn!(?failure, ?latency);\n        })\n        .latency_unit(LatencyUnit::Millis);\n}\nfn main() {}\n",
            [
                "TraceLayer::new_for_http",
                ".make_span_with",
                ".on_failure",
                "LatencyUnit::Millis"
            ],
            "Classifiers decide which responses count as failures."
        ),
        (
            "Why mark Authorization sensitive?",
            [
                "To redact it from debug output used by middleware",
                "To make it immutable",
                "To compress it"
            ],
            0,
            "http header sensitivity is honored by debug formatting and helps prevent credential leakage in logs."
        )
    ),
    lesson!(
        "tower-http-security",
        Track::AxumMastery,
        "12 · tower-http",
        "CORS, authorization, validation, and CSRF",
        "Treat browser origin policy, authentication, and request forgery as different controls.",
        [
            "CorsLayer produces CORS response headers; it is not authentication. ValidateRequest and AsyncRequireAuthorization can gate requests.",
            "CSRF protection defends credential-bearing browser requests; safe configuration depends on origin, cookies, methods, and deployment topology."
        ],
        Difficulty::Advanced,
        30,
        105,
        [
            (
                "tower-http · cors",
                "https://docs.rs/tower-http/latest/tower_http/cors/"
            ),
            (
                "tower-http · auth",
                "https://docs.rs/tower-http/latest/tower_http/auth/"
            ),
            (
                "tower-http · csrf",
                "https://docs.rs/tower-http/latest/tower_http/csrf/"
            ),
            (
                "tower-http · validate_request",
                "https://docs.rs/tower-http/latest/tower_http/validate_request/"
            )
        ],
        (
            "Configure a narrow CORS policy for one origin and GET/POST methods.",
            "use axum::http::{HeaderValue, Method};\nuse tower_http::cors::CorsLayer;\n\nfn cors() -> CorsLayer {\n    CorsLayer::new()\n}\nfn main() {}\n",
            "use axum::http::{HeaderValue, Method};\nuse tower_http::cors::CorsLayer;\n\nfn cors() -> CorsLayer {\n    CorsLayer::new()\n        .allow_origin(\"https://app.example.com\".parse::<HeaderValue>().unwrap())\n        .allow_methods([Method::GET, Method::POST])\n}\nfn main() {}\n",
            [
                "CorsLayer::new",
                ".allow_origin",
                ".allow_methods([Method::GET, Method::POST])"
            ],
            "Prefer explicit origins and methods over permissive production defaults."
        ),
        (
            "Does allowing a CORS origin authenticate that caller?",
            [
                "Yes",
                "No; CORS is a browser response-sharing policy",
                "Only for GET"
            ],
            1,
            "Non-browser clients ignore CORS, and an allowed browser origin still needs authentication/authorization."
        )
    ),
    lesson!(
        "tower-http-payload",
        Track::AxumMastery,
        "12 · tower-http",
        "Compression, decompression, limits, timeout, and panic handling",
        "Bound payload and execution costs while preserving correct HTTP semantics.",
        [
            "Compression and decompression negotiate content encodings and should avoid already compressed or sensitive payload pitfalls.",
            "RequestBodyLimit bounds input; TimeoutLayer can create timeout responses; CatchPanic converts panics but is not a substitute for invariant-safe code."
        ],
        Difficulty::Advanced,
        28,
        100,
        [
            (
                "tower-http · compression",
                "https://docs.rs/tower-http/latest/tower_http/compression/"
            ),
            (
                "tower-http · decompression",
                "https://docs.rs/tower-http/latest/tower_http/decompression/"
            ),
            (
                "tower-http · limit",
                "https://docs.rs/tower-http/latest/tower_http/limit/"
            ),
            (
                "tower-http · timeout",
                "https://docs.rs/tower-http/latest/tower_http/timeout/"
            )
        ],
        (
            "Layer a 1 MiB request limit, gzip compression, and a five-second HTTP timeout.",
            "use std::time::Duration;\nuse tower::ServiceBuilder;\nuse tower_http::{compression::CompressionLayer, limit::RequestBodyLimitLayer, timeout::TimeoutLayer};\n\nfn main() {}\n",
            "use std::time::Duration;\nuse tower::ServiceBuilder;\nuse tower_http::{compression::CompressionLayer, limit::RequestBodyLimitLayer, timeout::TimeoutLayer};\n\nfn main() {\n    let _layers = ServiceBuilder::new()\n        .layer(RequestBodyLimitLayer::new(1024 * 1024))\n        .layer(CompressionLayer::new().gzip(true))\n        .layer(TimeoutLayer::new(Duration::from_secs(5)));\n}\n",
            [
                "RequestBodyLimitLayer::new(1024 * 1024)",
                "CompressionLayer::new",
                "TimeoutLayer::new(Duration::from_secs(5))"
            ],
            "tower-http's timeout returns an HTTP response rather than exposing a Tower error."
        ),
        (
            "Is CatchPanic a reason to ignore panic safety?",
            [
                "Yes",
                "No; state may already be inconsistent and the panic still signals a bug",
                "Only in debug builds"
            ],
            1,
            "Catching a panic may protect the connection, but code should not rely on it for normal control flow."
        )
    ),
    lesson!(
        "tower-http-utilities",
        Track::AxumMastery,
        "12 · tower-http",
        "Files, redirects, normalization, mapping, headers, and metrics",
        "Know the remaining tower-http modules well enough to choose existing middleware before writing custom code.",
        [
            "ServeDir/ServeFile, FollowRedirect, NormalizePath, SetHeader, SetStatus, PropagateHeader, and map-body layers cover common protocol transformations.",
            "Metrics and OnEarlyDrop observe body completion; classify controls success/failure semantics. ServiceBuilderExt and ServiceExt add fluent tower-http adapters."
        ],
        Difficulty::Advanced,
        32,
        105,
        [
            (
                "tower-http · crate modules",
                "https://docs.rs/tower-http/latest/tower_http/#modules"
            ),
            (
                "tower-http · services",
                "https://docs.rs/tower-http/latest/tower_http/services/"
            ),
            (
                "tower-http · metrics",
                "https://docs.rs/tower-http/latest/tower_http/metrics/"
            ),
            (
                "tower-http · normalize_path",
                "https://docs.rs/tower-http/latest/tower_http/normalize_path/"
            )
        ],
        (
            "Mount a static directory with an index fallback using ServeDir and ServeFile.",
            "use tower_http::services::{ServeDir, ServeFile};\n\nfn files() {\n}\nfn main() {}\n",
            "use tower_http::services::{ServeDir, ServeFile};\n\nfn files() {\n    let _service = ServeDir::new(\"web\")\n        .not_found_service(ServeFile::new(\"web/index.html\"));\n}\nfn main() {}\n",
            [
                "ServeDir::new(\"web\")",
                ".not_found_service(ServeFile::new"
            ],
            "A fallback file supports a browser application while other static files keep their normal paths."
        ),
        (
            "Why track early response-body drops?",
            [
                "A response can begin successfully but fail or be cancelled before completion",
                "Bodies are always empty",
                "It changes route matching"
            ],
            0,
            "Streaming outcomes happen after headers, so completion/drop metrics reveal failures status codes alone miss."
        )
    ),
    lesson!(
        "tokio-runtime",
        Track::AxumMastery,
        "13 · Tokio",
        "Runtime, schedulers, tasks, and feature flags",
        "Match lightweight async work to Tokio's cooperative execution model.",
        [
            "Tokio combines a task scheduler, I/O driver, and timer. rt and rt-multi-thread select scheduler capability; macros enables tokio::main/test.",
            "Tasks are cheap but cooperative: long CPU work without await blocks a worker. Libraries should enable only needed features."
        ],
        Difficulty::Intermediate,
        26,
        85,
        [
            (
                "Tokio · crate overview",
                "https://docs.rs/tokio/latest/tokio/"
            ),
            (
                "Tokio · runtime",
                "https://docs.rs/tokio/latest/tokio/runtime/"
            )
        ],
        (
            "Spawn three lightweight tasks and await all JoinHandles.",
            "#[tokio::main]\nasync fn main() {\n}\n",
            "#[tokio::main]\nasync fn main() {\n    let mut tasks = Vec::new();\n    for id in 0..3 {\n        tasks.push(tokio::spawn(async move { id * 2 }));\n    }\n    for task in tasks {\n        println!(\"{}\", task.await.unwrap());\n    }\n}\n",
            ["tokio::spawn", "async move", "task.await"],
            "Spawn schedules futures on the runtime; JoinHandle awaits their outputs."
        ),
        (
            "What makes Tokio tasks cooperative?",
            [
                "They yield at await points instead of being preempted arbitrarily",
                "Each task owns an OS process",
                "They cannot run concurrently"
            ],
            0,
            "A future returns Pending at suspension points, allowing the scheduler to poll other tasks."
        )
    ),
    lesson!(
        "tokio-cancellation",
        Track::AxumMastery,
        "13 · Tokio",
        "join!, select!, cancellation, and task ownership",
        "Compose concurrency while knowing which losing or dropped work is safe to cancel.",
        [
            "join! waits for every branch; try_join! short-circuits on Err; select! completes one branch and drops the others in that task.",
            "Cancellation safety is an API property. Dropping a future may lose partially completed logical work even when memory safety remains intact."
        ],
        Difficulty::Advanced,
        30,
        100,
        [
            (
                "Tokio · select!",
                "https://docs.rs/tokio/latest/tokio/macro.select.html"
            ),
            (
                "Tokio · join!",
                "https://docs.rs/tokio/latest/tokio/macro.join.html"
            ),
            (
                "Tokio tutorial · Select",
                "https://tokio.rs/tokio/tutorial/select"
            )
        ],
        (
            "Select between Ctrl+C and a timeout, biasing shutdown first.",
            "use std::time::Duration;\n\n#[tokio::main]\nasync fn main() {\n}\n",
            "use std::time::Duration;\n\n#[tokio::main]\nasync fn main() {\n    tokio::select! {\n        biased;\n        result = tokio::signal::ctrl_c() => { result.unwrap(); }\n        () = tokio::time::sleep(Duration::from_secs(30)) => {}\n    }\n}\n",
            [
                "tokio::select!",
                "biased;",
                "tokio::signal::ctrl_c",
                "tokio::time::sleep"
            ],
            "biased checks branches in source order; use it only when that priority is intended."
        ),
        (
            "What happens to losing select! branches?",
            [
                "They are dropped/cancelled in the current task",
                "They always become threads",
                "They run twice"
            ],
            0,
            "select! waits for one branch and cancels the remaining branch futures by dropping them."
        )
    ),
    lesson!(
        "tokio-sync",
        Track::AxumMastery,
        "13 · Tokio",
        "Channels and async synchronization",
        "Choose message passing or shared state based on data flow, contention, and lifecycle.",
        [
            "mpsc carries many-to-one work, oneshot carries one value, broadcast gives each receiver messages, and watch retains the latest value.",
            "Tokio Mutex permits holding across await but costs more; use std locks when the critical section is synchronous and no guard crosses await."
        ],
        Difficulty::Advanced,
        30,
        100,
        [
            ("Tokio · sync", "https://docs.rs/tokio/latest/tokio/sync/"),
            (
                "Tokio · channels",
                "https://tokio.rs/tokio/tutorial/channels"
            )
        ],
        (
            "Send configuration updates through watch and read the latest value in a task.",
            "#[tokio::main]\nasync fn main() {\n}\n",
            "#[tokio::main]\nasync fn main() {\n    let (sender, mut receiver) = tokio::sync::watch::channel(String::from(\"dev\"));\n    let task = tokio::spawn(async move {\n        receiver.changed().await.unwrap();\n        receiver.borrow().clone()\n    });\n    sender.send(String::from(\"prod\")).unwrap();\n    println!(\"{}\", task.await.unwrap());\n}\n",
            [
                "tokio::sync::watch::channel",
                "receiver.changed().await",
                "receiver.borrow",
                "sender.send"
            ],
            "watch is ideal when consumers care about the current value rather than every historical update."
        ),
        (
            "Which channel stores only the newest value for receivers?",
            ["watch", "mpsc", "oneshot"],
            0,
            "watch lets receivers observe changes and borrow the latest value."
        )
    ),
    lesson!(
        "tokio-io",
        Track::AxumMastery,
        "13 · Tokio",
        "Async I/O, networking, time, signals, and blocking work",
        "Keep runtime workers non-blocking and move the right work to the right execution resource.",
        [
            "AsyncRead/AsyncWrite and extension traits power non-blocking I/O; net, fs, process, signal, and time modules are feature-gated.",
            "spawn_blocking is for bounded blocking operations. CPU-heavy sustained work usually belongs on a dedicated pool such as Rayon, with results returned asynchronously."
        ],
        Difficulty::Advanced,
        32,
        105,
        [
            ("Tokio · io", "https://docs.rs/tokio/latest/tokio/io/"),
            ("Tokio · net", "https://docs.rs/tokio/latest/tokio/net/"),
            (
                "Tokio · task::spawn_blocking",
                "https://docs.rs/tokio/latest/tokio/task/fn.spawn_blocking.html"
            ),
            ("Tokio · time", "https://docs.rs/tokio/latest/tokio/time/")
        ],
        (
            "Move a blocking checksum calculation off the async worker and apply a timeout.",
            "use std::time::Duration;\n\nasync fn checksum(bytes: Vec<u8>) -> Result<u64, tokio::time::error::Elapsed> {\n    todo!()\n}\nfn main() {}\n",
            "use std::time::Duration;\n\nasync fn checksum(bytes: Vec<u8>) -> Result<u64, tokio::time::error::Elapsed> {\n    tokio::time::timeout(Duration::from_secs(1), async move {\n        tokio::task::spawn_blocking(move || bytes.into_iter().map(u64::from).sum())\n            .await\n            .unwrap()\n    }).await\n}\nfn main() {}\n",
            [
                "tokio::time::timeout",
                "tokio::task::spawn_blocking",
                "bytes.into_iter"
            ],
            "spawn_blocking protects async workers; timeout limits how long the caller waits."
        ),
        (
            "Where should sustained CPU-bound work usually run?",
            [
                "Directly inside every async handler",
                "A dedicated CPU pool",
                "Inside HeaderMap"
            ],
            1,
            "Async runtime workers should remain available to poll I/O-bound tasks."
        )
    ),
    lesson!(
        "hyper-types",
        Track::AxumMastery,
        "14 · Hyper",
        "HTTP types, streaming bodies, and runtime adapters",
        "Know the protocol-level types Axum reexports and the body model flowing through every service.",
        [
            "Hyper uses http::Request/Response, Method, Uri, StatusCode, HeaderMap, and Version; the body is an asynchronous stream of Frames.",
            "http-body and http-body-util provide body traits/combinators. Hyper 1.x keeps runtime I/O/timer integration explicit through traits and hyper-util adapters."
        ],
        Difficulty::Advanced,
        30,
        100,
        [
            (
                "Hyper · crate overview",
                "https://docs.rs/hyper/latest/hyper/"
            ),
            ("Hyper · body", "https://docs.rs/hyper/latest/hyper/body/"),
            ("http-body", "https://docs.rs/http-body/latest/http_body/")
        ],
        (
            "Construct an HTTP request with method, URI, header, and a Full<Bytes> body.",
            "use bytes::Bytes;\nuse http_body_util::Full;\nuse hyper::{Method, Request};\n\nfn main() {}\n",
            "use bytes::Bytes;\nuse http_body_util::Full;\nuse hyper::{Method, Request};\n\nfn main() {\n    let _request = Request::builder()\n        .method(Method::POST)\n        .uri(\"/events\")\n        .header(\"content-type\", \"text/plain\")\n        .body(Full::new(Bytes::from_static(b\"ready\")))\n        .unwrap();\n}\n",
            [
                "Request::builder",
                ".method(Method::POST)",
                ".uri(\"/events\")",
                "Full::new(Bytes::from_static"
            ],
            "Full is a one-frame body; streaming bodies implement the same Body trait."
        ),
        (
            "What does an HTTP body yield in the http-body model?",
            [
                "Asynchronous Frames containing data or trailers",
                "Only String",
                "Tower Layers"
            ],
            0,
            "Frames model streamed data chunks and optional trailer headers."
        )
    ),
    lesson!(
        "hyper-connections",
        Track::AxumMastery,
        "14 · Hyper",
        "Connections, clients, upgrades, and cancellation",
        "Understand what Axum delegates to Hyper and where lower-level control begins.",
        [
            "Hyper exposes HTTP/1 and HTTP/2 client/server connection builders; hyper-util supplies Tokio I/O adapters, executors, legacy pooled clients, and server helpers.",
            "Upgrades support protocol switching. Hyper futures are cancel safe at the memory/protocol layer, with method-specific consequences documented per API."
        ],
        Difficulty::Advanced,
        34,
        110,
        [
            (
                "Hyper · server",
                "https://docs.rs/hyper/latest/hyper/server/"
            ),
            (
                "Hyper · client",
                "https://docs.rs/hyper/latest/hyper/client/"
            ),
            (
                "Hyper · upgrade",
                "https://docs.rs/hyper/latest/hyper/upgrade/"
            ),
            (
                "hyper-util",
                "https://docs.rs/hyper-util/latest/hyper_util/"
            )
        ],
        (
            "Adapt a Tokio TCP stream for Hyper using TokioIo.",
            "use hyper_util::rt::TokioIo;\n\nasync fn adapt(stream: tokio::net::TcpStream) {\n}\nfn main() {}\n",
            "use hyper_util::rt::TokioIo;\n\nasync fn adapt(stream: tokio::net::TcpStream) {\n    let io = TokioIo::new(stream);\n    let _ = io;\n}\nfn main() {}\n",
            ["TokioIo::new(stream)"],
            "Hyper runtime traits are decoupled; hyper-util bridges Tokio's AsyncRead/AsyncWrite types."
        ),
        (
            "Why does hyper-util exist alongside Hyper 1.x?",
            [
                "To provide runtime adapters and higher-level utilities outside Hyper's low-level core",
                "To replace HTTP",
                "To compile CSS"
            ],
            0,
            "The split keeps Hyper focused while hyper-util supplies Tokio integration and convenient client/server builders."
        )
    ),
    lesson!(
        "tonic-codegen",
        Track::AxumMastery,
        "15 · Tonic",
        "gRPC, Protobuf, code generation, and service traits",
        "Connect schema-first RPC definitions to Rust request/response implementations.",
        [
            "Tonic implements gRPC over HTTP/2. tonic-prost-build commonly compiles .proto schemas into Rust client/server modules at build time.",
            "Generated server traits define async RPC methods over tonic::Request and tonic::Response, with tonic::Status for failures."
        ],
        Difficulty::Advanced,
        32,
        105,
        [
            (
                "Tonic · crate overview",
                "https://docs.rs/tonic/latest/tonic/"
            ),
            (
                "tonic-prost-build",
                "https://docs.rs/tonic-prost-build/latest/tonic_prost_build/"
            ),
            (
                "Tonic examples",
                "https://github.com/hyperium/tonic/tree/master/examples"
            )
        ],
        (
            "Implement the shape of a unary Greeter method using tonic Request, Response, and Status.",
            "use tonic::{Request, Response, Status};\n\n#[derive(Default)]\nstruct Greeter;\n\nimpl Greeter {\n    async fn hello(&self) {}\n}\nfn main() {}\n",
            "use tonic::{Request, Response, Status};\n\n#[derive(Default)]\nstruct Greeter;\n\nimpl Greeter {\n    async fn hello(&self, request: Request<String>) -> Result<Response<String>, Status> {\n        let name = request.into_inner();\n        if name.is_empty() { return Err(Status::invalid_argument(\"name required\")); }\n        Ok(Response::new(format!(\"Hello, {name}\")))\n    }\n}\nfn main() {}\n",
            [
                "Request<String>",
                "Result<Response<String>, Status>",
                "request.into_inner",
                "Status::invalid_argument",
                "Response::new"
            ],
            "Generated message types replace String, but the service method shape is the same."
        ),
        (
            "What maps application RPC failure to the gRPC protocol?",
            ["tonic::Status", "axum::Path", "std::thread"],
            0,
            "Status carries a gRPC code, message, and optional details/metadata."
        )
    ),
    lesson!(
        "tonic-streaming",
        Track::AxumMastery,
        "15 · Tonic",
        "Streaming RPCs, metadata, status, and interceptors",
        "Handle gRPC's four interaction shapes and propagate context through typed metadata.",
        [
            "RPCs can be unary, server-streaming, client-streaming, or bidirectional streaming. Streaming<T> receives inbound messages; outbound streams yield Result<Message, Status>.",
            "MetadataMap carries ASCII or binary metadata. Interceptors inspect/modify requests before service calls but are simpler than full Tower middleware."
        ],
        Difficulty::Advanced,
        34,
        110,
        [
            (
                "Tonic · Streaming",
                "https://docs.rs/tonic/latest/tonic/struct.Streaming.html"
            ),
            (
                "Tonic · metadata",
                "https://docs.rs/tonic/latest/tonic/metadata/"
            ),
            (
                "Tonic · service",
                "https://docs.rs/tonic/latest/tonic/service/"
            )
        ],
        (
            "Write an interceptor function that requires an authorization metadata value.",
            "use tonic::{Request, Status};\n\nfn authorize(request: Request<()>) -> Result<Request<()>, Status> {\n    todo!()\n}\nfn main() {}\n",
            "use tonic::{Request, Status};\n\nfn authorize(request: Request<()>) -> Result<Request<()>, Status> {\n    match request.metadata().get(\"authorization\") {\n        Some(value) if value == \"Bearer secret\" => Ok(request),\n        _ => Err(Status::unauthenticated(\"missing credentials\")),\n    }\n}\nfn main() {}\n",
            [
                "request.metadata().get",
                "Status::unauthenticated",
                "Ok(request)"
            ],
            "Metadata keys are lowercase ASCII; sensitive credentials still need redaction in telemetry."
        ),
        (
            "Which gRPC shape streams in both directions?",
            ["Unary", "Bidirectional streaming", "Server reflection"],
            1,
            "Bidirectional RPCs expose an inbound stream and return an outbound stream."
        )
    ),
    lesson!(
        "tonic-transport",
        Track::AxumMastery,
        "15 · Tonic",
        "Transport, TLS, compression, limits, and Tower interoperability",
        "Reuse the same service ecosystem while respecting gRPC's HTTP/2 and streaming semantics.",
        [
            "Tonic transport provides Channel and Server on Tokio, Hyper, and Tower. Feature flags select TLS providers, compression algorithms, client/server support, and the Axum-based router.",
            "Clients and servers expose concurrency, timeout, load balancing, message size, and compression configuration. Tower layers can wrap Tonic services when body/error types align."
        ],
        Difficulty::Advanced,
        34,
        110,
        [
            (
                "Tonic · transport",
                "https://docs.rs/tonic/latest/tonic/transport/"
            ),
            (
                "Tonic · feature flags",
                "https://docs.rs/tonic/latest/tonic/#feature-flags"
            ),
            (
                "Tonic + Tower examples",
                "https://github.com/hyperium/tonic/tree/master/examples/src/tower"
            )
        ],
        (
            "Build a Tonic Endpoint with origin, connect timeout, and request timeout.",
            "use std::time::Duration;\nuse tonic::transport::Endpoint;\n\nfn endpoint() {}\nfn main() {}\n",
            "use std::time::Duration;\nuse tonic::transport::Endpoint;\n\nfn endpoint() {\n    let _endpoint = Endpoint::from_static(\"https://api.example.com\")\n        .origin(\"https://api.example.com\".parse().unwrap())\n        .connect_timeout(Duration::from_secs(3))\n        .timeout(Duration::from_secs(5));\n}\nfn main() {}\n",
            [
                "Endpoint::from_static",
                ".origin",
                ".connect_timeout",
                ".timeout"
            ],
            "Connection establishment and individual RPCs often need separate budgets."
        ),
        (
            "Which shared abstraction lets Axum and Tonic reuse middleware?",
            [
                "tower::Service and Layer",
                "String indexing",
                "Cargo profiles"
            ],
            0,
            "Both expose protocol handling through Tower services, enabling compatible layers to be reused."
        )
    ),
    lesson!(
        "axum-production",
        Track::AxumMastery,
        "16 · Production capstone",
        "A production Axum service blueprint",
        "Assemble boundaries, policy, telemetry, tests, and lifecycle into one maintainable service.",
        [
            "Organize configuration, application state, routes, handlers, extractors, domain services, clients, errors, telemetry, and shutdown as explicit modules.",
            "Production readiness includes bounded bodies/concurrency/time, cancellation-aware work, redacted structured tracing, health/readiness endpoints, security headers, graceful shutdown, in-memory router tests, and transport-level tests."
        ],
        Difficulty::Advanced,
        40,
        125,
        [
            (
                "Axum · examples",
                "https://github.com/tokio-rs/axum/tree/main/examples"
            ),
            (
                "Tower · guides",
                "https://github.com/tower-rs/tower/tree/master/guides"
            ),
            ("Tokio · tutorial", "https://tokio.rs/tokio/tutorial")
        ],
        (
            "Build a compact production router with state, health, request tracing, compression, a body limit, and a timeout.",
            "use std::{sync::Arc, time::Duration};\nuse axum::{extract::DefaultBodyLimit, routing::get, Router};\nuse tower::ServiceBuilder;\nuse tower_http::{compression::CompressionLayer, timeout::TimeoutLayer, trace::TraceLayer};\n\n#[derive(Default)]\nstruct State;\nasync fn health() -> &'static str { \"ready\" }\n\nfn app() -> Router { Router::new() }\nfn main() {}\n",
            "use std::{sync::Arc, time::Duration};\nuse axum::{extract::DefaultBodyLimit, routing::get, Router};\nuse tower::ServiceBuilder;\nuse tower_http::{compression::CompressionLayer, timeout::TimeoutLayer, trace::TraceLayer};\n\n#[derive(Default)]\nstruct State;\nasync fn health() -> &'static str { \"ready\" }\n\nfn app() -> Router {\n    Router::new()\n        .route(\"/health\", get(health))\n        .with_state(Arc::new(State))\n        .layer(DefaultBodyLimit::max(1024 * 1024))\n        .layer(ServiceBuilder::new()\n            .layer(TraceLayer::new_for_http())\n            .layer(CompressionLayer::new())\n            .layer(TimeoutLayer::new(Duration::from_secs(10))))\n}\nfn main() {}\n",
            [
                "route(\"/health\"",
                ".with_state(Arc::new",
                "DefaultBodyLimit::max",
                "TraceLayer::new_for_http",
                "CompressionLayer::new",
                "TimeoutLayer::new"
            ],
            "Keep health cheap and place cross-cutting policy in a visible, reviewable stack."
        ),
        (
            "What is the strongest production default?",
            [
                "Unbounded work with implicit behavior",
                "Explicit limits, typed boundaries, observable failures, and graceful lifecycle",
                "Catching every error as 200 OK"
            ],
            1,
            "Reliability comes from visible budgets and contracts across request, dependency, and shutdown paths."
        )
    ),
];

#[must_use]
pub fn lesson_by_id(id: &str) -> Option<&'static Lesson> {
    CURRICULUM.iter().find(|lesson| lesson.id == id)
}

#[cfg(test)]
mod tests {
    use std::collections::HashSet;

    use super::{CURRICULUM, lesson_by_id};
    use crate::domain::Track;
    use crate::validation::validate_code;

    #[test]
    fn curriculum_is_large_unique_and_balanced() {
        let ids: HashSet<_> = CURRICULUM.iter().map(|lesson| lesson.id).collect();
        assert_eq!(ids.len(), CURRICULUM.len());
        assert!(CURRICULUM.len() >= 60, "expected comprehensive curriculum");
        assert!(
            CURRICULUM
                .iter()
                .filter(|lesson| lesson.track == Track::RustFoundations)
                .count()
                >= 25
        );
        assert!(
            CURRICULUM
                .iter()
                .filter(|lesson| lesson.track == Track::AxumMastery)
                .count()
                >= 30
        );
    }

    #[test]
    fn every_lesson_has_valid_source_and_solution_syntax() {
        for lesson in CURRICULUM {
            assert!(!lesson.sources.is_empty(), "{} has no sources", lesson.id);
            assert!(
                lesson
                    .sources
                    .iter()
                    .all(|source| source.url.starts_with("https://"))
            );
            assert!(lesson.quiz.answer < lesson.quiz.choices.len());
            syn::parse_file(lesson.code.solution).unwrap_or_else(|error| {
                panic!("{} has invalid solution syntax: {error}", lesson.id)
            });
        }
    }

    #[test]
    fn lesson_ids_and_content_are_stable_and_non_empty() {
        for lesson in CURRICULUM {
            assert_eq!(lesson_by_id(lesson.id).map(|item| item.id), Some(lesson.id));
            assert!(
                lesson.id.chars().all(|character| {
                    character.is_ascii_lowercase() || character.is_ascii_digit() || character == '-'
                }),
                "{} is not a kebab-case lesson id",
                lesson.id
            );
            assert!(!lesson.id.starts_with('-') && !lesson.id.ends_with('-'));
            assert!(!lesson.id.contains("--"));
            assert!(!lesson.unit.trim().is_empty());
            assert!(!lesson.title.trim().is_empty());
            assert!(!lesson.summary.trim().is_empty());
            assert!(!lesson.notes.is_empty());
            assert!(lesson.notes.iter().all(|note| !note.trim().is_empty()));
            assert!(lesson.minutes > 0);
            assert!(lesson.xp > 0);
        }

        assert!(lesson_by_id("does-not-exist").is_none());
    }

    #[test]
    fn every_activity_has_a_sound_contract() {
        for lesson in CURRICULUM {
            assert!(!lesson.code.prompt.trim().is_empty(), "{}", lesson.id);
            assert!(!lesson.code.starter.trim().is_empty(), "{}", lesson.id);
            assert!(!lesson.code.hint.trim().is_empty(), "{}", lesson.id);
            assert!(!lesson.code.required.is_empty(), "{}", lesson.id);
            assert!(
                lesson
                    .code
                    .required
                    .iter()
                    .all(|token| !token.trim().is_empty()),
                "{}",
                lesson.id
            );

            let choices: HashSet<_> = lesson.quiz.choices.iter().collect();
            assert_eq!(choices.len(), lesson.quiz.choices.len(), "{}", lesson.id);
            assert!(!lesson.quiz.question.trim().is_empty(), "{}", lesson.id);
            assert!(!lesson.quiz.explanation.trim().is_empty(), "{}", lesson.id);
            assert!(
                lesson
                    .quiz
                    .choices
                    .iter()
                    .all(|choice| !choice.trim().is_empty()),
                "{}",
                lesson.id
            );
        }
    }

    #[test]
    fn every_reference_solution_passes_its_own_validator() {
        for lesson in CURRICULUM {
            let result = validate_code(lesson, lesson.code.solution);
            assert!(result.correct, "{}: {:?}", lesson.id, result.details);
        }
    }
}
