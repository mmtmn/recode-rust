# Contributing to recode-rust

Thank you for helping make the route into Rust and Axum clearer.

## Good contributions

- Correct an explanation against current upstream documentation.
- Add a missing edge case or a sharper Q&A distractor.
- Improve a coding task without making its concept check brittle.
- Add an Axum ecosystem topic and update the coverage audit.
- Improve accessibility, keyboard navigation, or responsive behavior.

## Content rules

1. Use the Rust project, docs.rs crate documentation, or the crate's official repository as the primary source. W3Schools is intentionally used only as a supplementary beginner syntax path.
2. Write original summaries and exercises. Link upstream; do not paste documentation prose.
3. Every lesson needs a valid Rust snippet, at least one concept token, one three-choice question, an explanation, and direct source links.
4. Keep examples on the versions listed in `docs/SOURCES.md` and note deliberate older-version material.
5. Prefer one teachable idea per activity. Production caveats belong in the notes or follow-up lessons.

## Local checks

```bash
cargo fmt
cargo clippy --all-targets --all-features -- -D warnings
cargo test --all-targets --all-features --locked
npm ci
npm run check:js
npx playwright install chromium
npm run test:e2e
```

The Playwright command starts its own Axum server and exercises desktop and mobile flows. For exploratory checks, run `cargo run` and open <http://127.0.0.1:3000>.

## Adding a lesson

Add the lesson to `src/curriculum.rs` in dependency/learning order. IDs are permanent kebab-case keys because browser progress is stored against them. Run the tests: they check uniqueness, source URLs, quiz indexes, and solution syntax.

Open a pull request that explains what learning gap the change closes and cites the upstream material used.
