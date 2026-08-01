# Source and version policy

Curriculum snapshot: **2026-08-01**.

recode-rust teaches concepts in original wording and links to upstream material for depth. It does not reproduce documentation pages. The source order is:

1. Official Rust project books and references for the language and Cargo.
2. docs.rs documentation and official repositories for ecosystem crates.
3. W3Schools as the specifically requested supplementary beginner syntax path.

## Version baseline

| Component | Curriculum baseline | Canonical source |
| --- | ---: | --- |
| Rust | stable; Rust Book with async chapter and 2024 edition-aware examples | <https://doc.rust-lang.org/book/> |
| Cargo | stable | <https://doc.rust-lang.org/cargo/> |
| Axum | 0.8.9 | <https://docs.rs/axum/0.8.9/axum/> |
| Tower | 0.5.3 | <https://docs.rs/tower/0.5.3/tower/> |
| tower-http | 0.7.0 | <https://docs.rs/tower-http/0.7.0/tower_http/> |
| Tokio | 1.53.1 | <https://docs.rs/tokio/1.53.1/tokio/> |
| Hyper | 1.11.0 | <https://docs.rs/hyper/1.11.0/hyper/> |
| Tonic | 0.14.6 | <https://docs.rs/tonic/0.14.6/tonic/> |

The `Cargo.toml` is the executable version record. Patch releases may resolve higher within the declared compatible ranges; `Cargo.lock` records the tested graph.

## Rust language path

- [The Rust Programming Language](https://doc.rust-lang.org/book/): primary sequential curriculum, including its concept chapters and the guessing game, minigrep, and web-server project lessons.
- [The Rust Reference](https://doc.rust-lang.org/reference/): language-detail arbiter when the Book intentionally simplifies.
- [The Cargo Book](https://doc.rust-lang.org/cargo/): manifests, features, profiles, workspaces, and publishing.
- [W3Schools Rust Tutorial](https://www.w3schools.com/rust/): supplementary order for syntax, output, comments, variables, data types, constants, operators, booleans, conditional control flow, match, loops, functions, scope, strings, ownership, borrowing, arrays, vectors, tuples, hash maps, structs, and enums.

## Axum ecosystem path

- [Axum crate documentation](https://docs.rs/axum/latest/axum/) and [official examples](https://github.com/tokio-rs/axum/tree/main/examples)
- [Tower crate documentation](https://docs.rs/tower/latest/tower/) and [official guides](https://github.com/tower-rs/tower/tree/master/guides)
- [tower-http crate documentation](https://docs.rs/tower-http/latest/tower_http/) and [official examples](https://github.com/tower-rs/tower-http/tree/master/examples)
- [Tokio crate documentation](https://docs.rs/tokio/latest/tokio/) and [Tokio tutorial](https://tokio.rs/tokio/tutorial)
- [Hyper crate documentation](https://docs.rs/hyper/latest/hyper/), [Hyper guides](https://hyper.rs/guides/), and [hyper-util](https://docs.rs/hyper-util/latest/hyper_util/)
- [Tonic crate documentation](https://docs.rs/tonic/latest/tonic/) and [official examples](https://github.com/hyperium/tonic/tree/master/examples)

## Updating

When a baseline changes:

1. Read the crate changelog and new top-level/module docs.
2. Search `src/curriculum.rs` for removed syntax and renamed APIs.
3. Update lesson notes, solutions, source links, this file, and `Cargo.toml` together.
4. Run the full checks and manually submit one code task and one Q&A from each track.
5. Call out behavioral migrations in the pull request; do not silently teach mixed major versions.
