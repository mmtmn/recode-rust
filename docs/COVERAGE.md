# Curriculum coverage audit

This file answers a practical question: “If I work through recode-rust, which upstream documentation areas have I deliberately touched?”

Coverage is at the **concept and public-module level**, not a promise to duplicate every rustdoc item. A learner gets an ordered mental model, a code task, a Q&A checkpoint, and direct links; rustdoc remains the exhaustive API reference.

## Track 1 — Rust Foundations

| Upstream area | Lessons |
| --- | --- |
| Book 1–3; W3Schools setup and syntax | `rust-toolchain`, `rust-hello`, `rust-bindings`, `rust-scalars`, `rust-compound`, `rust-operators-if`, `rust-match`, `rust-loops`, `rust-functions` |
| Book 4; W3Schools strings, ownership, borrowing | `rust-strings`, `rust-ownership`, `rust-borrowing`, `rust-slices` |
| Book 5–7; W3Schools structs and enums | `rust-structs`, `rust-enums`, `rust-modules` |
| Book 8; W3Schools collections | `rust-vectors`, `rust-utf8`, `rust-hashmaps` |
| Book 9–11 | `rust-errors`, `rust-generics`, `rust-traits`, `rust-lifetimes`, `rust-tests` |
| Book 12–14 | `rust-projects`, `rust-closures`, `rust-iterators`, `rust-cargo` |
| Book 15–17 | `rust-smart-pointers`, `rust-concurrency`, `rust-async` |
| Book 18–20 | `rust-oop`, `rust-patterns`, `rust-advanced` |
| Book 21 and applied architecture | `rust-projects`, followed by the complete Axum track |

W3Schools' while/for/loop split is consolidated into `rust-loops`; its output/comments pages are consolidated into `rust-hello`. Every W3Schools data-structure page is covered before the curriculum advances to the Book's deeper abstraction chapters.

## Track 2 — Axum Mastery

### Axum 0.8

| Rustdoc surface | Lessons |
| --- | --- |
| Crate overview, compatibility, dependency model | `axum-stack`, `axum-hello` |
| `routing`, `Router`, `MethodRouter`, `route_service` | `axum-routing`, `axum-paths` |
| `handler`, `Handler`, `HandlerWithoutStateExt`, `debug_handler` | `axum-handlers` |
| `extract`: Path, Query, Json, Form, Bytes, String, Request, Extension, State | `axum-path-query`, `axum-bodies`, `axum-state` |
| Extractor order, Option/Result, rejection modules | `axum-rejections` |
| `FromRequest`, `FromRequestParts`, custom extraction and body limits | `axum-custom-extractors`, `axum-payloads` |
| `response`, `IntoResponse`, `IntoResponseParts`, Html, Json, Redirect, tuples | `axum-responses` |
| `error_handling`, `HandleError`, `HandleErrorLayer`, boxed errors | `axum-errors` |
| `middleware`: from_fn, from_fn_with_state, map request/response, Next, route layers, custom Tower middleware | `axum-middleware`, `axum-custom-middleware` |
| State patterns: `State`, `FromRef`, extensions, closure capture, task-local context | `axum-state`, `axum-custom-middleware` |
| `serve`, listeners, make services, ConnectInfo, graceful shutdown | `axum-server` |
| Router/Service testing | `axum-testing` |
| `extract::ws` | `axum-websockets` |
| `response::sse` | `axum-sse` |
| Multipart, static/file services, streaming and limits | `axum-payloads` |
| Feature flags, macros, `axum-core`, `axum-extra`, integration boundaries | `axum-features` |
| Production composition | `axum-production` |

### Tower 0.5 and `tower::Service`

| Rustdoc surface | Lessons |
| --- | --- |
| `Service`, associated types, `poll_ready`, `call` | `tower-service` |
| Readiness, backpressure, load, MakeService | `tower-readiness`, `tower-routing` |
| `Layer`, layer modules, `ServiceBuilder`, order | `tower-layer` |
| `util`, `ServiceExt`, `service_fn`, boxing, mapping, oneshot | `tower-ext` |
| `buffer`, `limit`, `load_shed`, `timeout`, `retry`, `filter` | `tower-resilience` |
| `balance`, `discover`, `steer`, `hedge`, `reconnect`, `ready_cache`, `spawn_ready` | `tower-routing` |
| Axum/Tonic integration | `axum-stack`, `tonic-transport`, `axum-production` |

### tower-http 0.7

| Rustdoc modules | Lessons |
| --- | --- |
| `trace`, `classify`, `request_id`, `sensitive_headers`, `propagate_header`, `add_extension` | `tower-http-observability` |
| `cors`, `csrf`, `auth`, `validate_request` | `tower-http-security` |
| `compression`, `decompression`, `limit`, `timeout`, `catch_panic`, body utilities | `tower-http-payload` |
| `services`, `follow_redirect`, `normalize_path`, `map_request_body`, `map_response_body`, `set_header`, `set_status`, `metrics`, `on_early_drop`, extension utilities | `tower-http-utilities` |
| Layering into a real Router | `axum-middleware`, `axum-production` |

### Tokio 1.x

| Rustdoc surface | Lessons |
| --- | --- |
| `runtime`, `task`, spawn/JoinHandle, schedulers, feature flags | `tokio-runtime` |
| `select!`, `join!`, `try_join!`, cancellation, task ownership | `tokio-cancellation` |
| `sync`: mpsc, oneshot, broadcast, watch, Mutex, RwLock, Semaphore, Notify, Barrier | `tokio-sync` |
| `io`, `net`, `fs`, `process`, `signal`, `time`, `spawn_blocking` | `tokio-io` |
| Use in Axum server lifecycle | `axum-hello`, `axum-server`, `axum-websockets`, `axum-sse` |

### Hyper 1.x and hyper-util

| Rustdoc surface | Lessons |
| --- | --- |
| HTTP reexports, Request/Response, body Frames, http-body utilities, runtime traits | `hyper-types` |
| HTTP/1 and HTTP/2 client/server connection APIs, service integration, upgrades, cancellation | `hyper-connections` |
| Tokio I/O/executor adapters, pooled clients, server helpers | `hyper-connections` |
| Relationship to Axum and Tonic | `axum-stack`, `tonic-transport` |

Hyper's unstable FFI module is intentionally not a learning objective for Axum application developers. It remains linked through the crate overview for specialized embedding use cases.

### Tonic 0.14

| Rustdoc surface | Lessons |
| --- | --- |
| Protobuf workflow, generated clients/servers, Request, Response, Status | `tonic-codegen` |
| Unary, client/server/bidirectional streaming, codec concepts, metadata, interceptors | `tonic-streaming` |
| `transport` Channel/Server, router, TLS providers, compression, limits, timeouts, load balancing | `tonic-transport` |
| Tower/Axum/Hyper/Tokio relationship | `axum-stack`, `tonic-transport`, `axum-production` |

## Activity count

The catalog currently contains 74 lessons. Every lesson has exactly two independently completable activities:

- one Rust coding task checked for parseable syntax and lesson-specific concepts;
- one Q&A checkpoint with three plausible choices and a teaching explanation.

That produces **148 activities** without executing learner code.
