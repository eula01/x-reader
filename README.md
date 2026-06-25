# x-reader

Plain feed of tweets from three fixed X lists.

## Setup

Copy `.env.local.example` to `.env.local` and set one of:

- `X_BEARER_TOKEN` — app-only bearer token (public lists)
- `X_USER_ACCESS_TOKEN` — OAuth user access token (private lists you own)

```bash
npm install
npm run dev
```

## Lists

- https://x.com/i/lists/2047478346116686143
- https://x.com/i/lists/2063220039365415064
- https://x.com/i/lists/2059974188396351918
