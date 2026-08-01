FROM rust:1.88-slim-bookworm AS builder

WORKDIR /build
COPY Cargo.toml Cargo.lock ./
COPY src ./src
RUN cargo build --locked --release

FROM debian:bookworm-slim AS runtime

RUN apt-get update \
    && apt-get install --yes --no-install-recommends ca-certificates curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --gid 10001 recode \
    && useradd --uid 10001 --gid recode --no-create-home --home-dir /app \
      --shell /usr/sbin/nologin recode

WORKDIR /app
COPY --from=builder /build/target/release/recode-rust /usr/local/bin/recode-rust
COPY --chown=recode:recode web ./web

ENV RECODE_ADDR=0.0.0.0:3000
ENV RUST_LOG=recode_rust=info,tower_http=info

EXPOSE 3000
USER recode

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl --fail --silent --show-error http://127.0.0.1:3000/api/health >/dev/null || exit 1

ENTRYPOINT ["recode-rust"]
