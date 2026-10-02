Production: https://redline-checkpoint.vercel.app

# Redline

Paste a terms of service, a subscription, a gym membership or an offer letter, and
Redline tells you what signing it costs you. Every clause it flags quotes the exact
sentence it came from.

## Production settings

The app needs four settings. Values are never committed: they live in `.env.local`
(gitignored) on your machine and in the Vercel project's Production environment.

| Name | Vercel (Production) | `.env.local` |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | set | set |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | set | set |
| `OPENROUTER_API_KEY` | not set yet | not set yet |
| `OPENROUTER_MODEL` | not set yet | not set yet |

`NEXT_PUBLIC_SUPABASE_ANON_KEY` holds the project's publishable key
(`sb_publishable_…`). Until both OpenRouter settings are added in both places,
analysis cannot run.

Supabase setup, including the sign-in URLs, is in `supabase/README.md`.
