# Security policy

## Reporting

Please report vulnerabilities privately through GitHub's security advisory flow rather than opening a public issue.

## Submission safety

recode-rust does **not** compile or execute learner submissions. The server parses submitted text with `syn` and checks lesson-specific concepts. This intentionally trades full semantic validation for a much safer local learning loop.

The application is designed for local, single-user learning. It has no accounts and stores completion data only in browser local storage. If you expose it to a network, place it behind normal TLS, authentication, request-size, rate, and concurrency controls appropriate to your deployment.
