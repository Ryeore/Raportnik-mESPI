---
description: "Use when committing, branching, writing commit messages, or opening pull requests in the Raportnik repo. Covers Conventional Commits, branch naming, sprint/US linking, and PR rules."
name: "Git Workflow"
---

# Git Workflow

## Branches
- `main` is protected; never push directly. Always branch and open a PR.
- Branch names: `<type>/<short-kebab-desc>` — e.g. `feat/watchlist-toggle`, `fix/feed-pagination`, `chore/ci-cache`.
- Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`.
- Link work to user stories/sprints from [docs/BACKLOG.md](../../docs/BACKLOG.md) when relevant (e.g. `feat/us3-feed-infinite-scroll`).

## Commits (Conventional Commits)
- Format: `type(scope): summary` — scopes: `backend`, `mobile`, `infra`, `docs`, `ci`.
- Summary in English, imperative, ≤72 chars. Examples:
  - `feat(backend): add cursor pagination to report feed`
  - `fix(mobile): debounce company search input`
- Keep commits focused; one logical change each. Reference US (`US3`) in the body when it maps to a backlog item.

## Pull Requests
- PR title mirrors the primary commit. Describe what and why, list testing done.
- CI (`./mvnw -B verify`, `npm test`) must pass — see [.github/workflows/ci.yml](../workflows/ci.yml).
- Never commit secrets or `.env`. Confirm credentials come from env vars only.
- Squash-merge to keep `main` history linear.

## Safety
- Do not force-push shared branches, amend published commits, or `reset --hard` without explicit confirmation.
- Run tests locally before pushing.
