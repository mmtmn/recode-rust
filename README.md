# recode-rust

An open, practice-first route from Rust syntax to production Axum. Every lesson pairs a focused coding task with a Q&A checkpoint, so reading turns into recall and recall turns into working code.

The curriculum has two deliberate tracks:

1. **Rust Foundations** — the full language path taught by the current Rust Book, reinforced with the concise syntax progression from W3Schools.
2. **Axum Mastery** — Axum's documented surface area and the stack beneath it: Tokio, Hyper, Tower, `tower::Service`, tower-http, and Tonic.

The app is itself built with Axum. It is stateless, stores learning progress only in the browser, and never executes submitted code. Rust snippets are parsed with `syn` and checked for the lesson's required concepts; that makes local practice safe while still catching syntax mistakes.

## Quick start

You need the stable Rust toolchain (MSRV 1.88 because of the current Tonic release).

```bash
git clone https://github.com/mmtmn/recode-rust.git
cd recode-rust
cargo run
```

Open <http://127.0.0.1:3000>. Override the bind address with `RECODE_ADDR`:

```bash
RECODE_ADDR=0.0.0.0:8080 cargo run
```

## What is covered

| Track | Coverage |
| --- | --- |
| Rust Foundations | Tooling and Cargo; syntax; scalar and compound types; ownership, borrowing and slices; structs and enums; modules; collections; errors; generics, traits and lifetimes; tests; closures and iterators; smart pointers; fearless concurrency; async Rust; patterns; unsafe Rust; macros; project architecture |
| Axum | Routers and method routing; handlers; all core extractor families and extractor ordering; responses; rejections and error handling; state; middleware; WebSockets; SSE; multipart; graceful shutdown; testing; feature flags |
| Tower | `Service`, readiness and backpressure; `Layer`; `ServiceBuilder`; `ServiceExt`; buffering, limits, load shedding, timeouts, retries, discovery, balancing and routing |
| tower-http | Tracing, request IDs, sensitive headers, CORS, auth, CSRF, compression, body limits, timeouts, panic handling, file services, redirects, normalization, mapping, metrics and classification |
| Tokio | Runtime models; tasks; cancellation; `select!`/`join!`; channels and synchronization; async I/O; networking; time; signals; blocking work and graceful shutdown |
| Hyper | HTTP types and bodies; HTTP/1 and HTTP/2 connections; client/server APIs; upgrades; cancellation; runtime adapters and hyper-util |
| Tonic | Protobuf/code generation; unary and streaming RPCs; metadata and status; interceptors; transport, TLS, compression and message limits; Tower/Axum interoperability |

The exact documentation-to-lesson map is in [docs/COVERAGE.md](docs/COVERAGE.md). Source policy and version pins are in [docs/SOURCES.md](docs/SOURCES.md).

## Development

```bash
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test --all-features
```

Useful endpoints:

- `GET /api/health`
- `GET /api/curriculum`
- `GET /api/lessons/{id}`
- `POST /api/lessons/{id}/code`
- `POST /api/lessons/{id}/quiz`

## Project layout

```text
src/
  curriculum.rs   # Rust and Axum lesson catalog
  domain.rs       # API-facing learning model
  validation.rs   # safe syntax/concept and Q&A validation
  lib.rs          # Axum router and handlers
  main.rs         # Tokio runtime, tracing, and shutdown
web/              # dependency-free learning interface
docs/             # source policy and coverage audit
```

## Contributing

Curriculum fixes, clearer explanations, better exercises, and missing edge cases are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md). Content is original and links learners to upstream documentation; please do not copy documentation pages verbatim.

## License

MIT. See [LICENSE](LICENSE).
