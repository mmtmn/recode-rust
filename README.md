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

Or run the continuously delivered container:

```bash
docker run --rm -p 3000:3000 ghcr.io/mmtmn/recode-rust:latest
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
cargo test --all-targets --all-features --locked
npm ci
npm run check:js
npx playwright install chromium
npm run test:e2e
```

The automated test pyramid covers:

- **Unit tests** for curriculum invariants, public-domain serialization, safe code validation, and quiz grading.
- **Integration tests** for every API family, rejection paths, response contracts, request IDs, answer secrecy, and static/SPA delivery.
- **End-to-end tests** in real Chromium for loading, search/filter/deep links, code and quiz completion, feedback recovery, persisted progress, and the mobile navigation drawer.

Playwright starts an isolated Axum server on `127.0.0.1:3100`; a separately running development server is not required.

## CI/CD

GitHub Actions runs formatting, strict Clippy, all Rust tests, documentation checks, and Chromium E2E tests on every pull request and `main` push. Pull requests also prove that the production container builds. A successful `main` pipeline publishes immutable commit tags and `latest` to `ghcr.io/mmtmn/recode-rust` with provenance and an SBOM.

Dependabot groups weekly Rust, Playwright, GitHub Actions, and base-image updates so each update is validated by the same pipeline.

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
tests/            # black-box Axum API integration tests
e2e/              # Playwright browser journeys
docs/             # source policy and coverage audit
.github/           # CI/CD and dependency automation
```

## Contributing

Curriculum fixes, clearer explanations, better exercises, and missing edge cases are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md). Content is original and links learners to upstream documentation; please do not copy documentation pages verbatim.

## License

MIT. See [LICENSE](LICENSE).
