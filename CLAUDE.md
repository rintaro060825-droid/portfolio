@AGENTS.md

# Git workflow

- Work directly on `main`. After every change, commit it and push to `origin/main` — no feature branches or pull requests unless asked.
- Run `git pull --rebase origin main` before pushing.
- If `origin/main` has changes that conflict with the work or undo part of it, stop and ask before merging.
