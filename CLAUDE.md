# PINT FC — PROJECT RULES

- **Secrets**: never print, log or commit a token, key or password. Keys live in `.env.local` (gitignored). Vercel commands use `--token "$VERCEL_TOKEN"`; the Supabase CLI reads `SUPABASE_ACCESS_TOKEN`.
- **Preserve files & git safety**: Never delete files or folders, and never run `git reset --hard`, `git clean` or a force push. If something must go, ask me with the exact path.
- **Fake data only**: no real names, emails or phone numbers.
- **Permissions & approval**: Ask me before creating anything in Supabase or Vercel, before anything that may cost money, and before any production deploy.
- **Tests first**: write the test, run it, show it failing for the right reason, then write the code.
- **Exit gates**: Done means the exit gate ran and its output is shown. Commit only after the test command itself exits 0, never through a pipe.
- **One session at a time**: At the end, append to `PROGRESS.md`: done, proof, decisions, and "Next session needs to know".
