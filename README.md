<<<<<<< HEAD
# 30-Days of C++ — Project-based Larning

A 30-day, project-based C++ curriculum built to take me from fundamentals to
class-based, multi-file C++ projects. Can be used to contribute to your team's
codebase by September and to support the PID implementation work integrated
into the back end of this sprint.

Most learn-to-code repos show finished solutions and hide the struggle. This
one doesn't — every commit message names exactly what was shaky that day, and
every `dayN_blank.cpp` file is a cold-recall test I have to pass a week later
or it gets flagged for re-study. The last three days build toward a
`PIDController` class tuned against a real robotics subsystem, using a
tuning-intuition approach rather than a textbook derivation. If you want to
see whether the retrieval discipline actually holds up, the commit history is
the place to check — not just the final `dayN_solved.cpp` files.

# Goals

- Reach a level of C++ fluency where I can read and modify our team's existing
  code without hand-holding.
- Build every core concept needed for a from-scratch PID controller class:
  functions, control flow, arrays/pointers/references, classes, and
  multi-file project structure.
- Retain what I learn — not just finish lessons. Every day produces working,
  tested code, not notes.

# Structure

Each day has two files:

- **`dayN_solved.cpp`** — the actual challenge for that day, fully
  implemented and working. This is the "did I learn it today" artifact.
- **`dayN_blank.cpp`** — the same file with function bodies stripped and
  signatures/asserts left in. Revisited ~1 week later as a cold-recall test:
  if I can't rebuild the logic from scratch and pass the asserts, I didn't
  retain it, and it gets re-studied.

Commit messages note what was shaky that day (e.g. `Day 19: pointer swap,
still slow on dereferencing syntax`) so the commit history doubles as a
retrieval log.

# PID Integration — Decided

Watched at Day 28 (Brian Douglas video, see Resources), after class syntax is
solid but before the sprint's own class capstones.

- **Day 28–29:** build `PIDController` as the class project — constructor,
  member functions, encapsulation of gains and error state — instead of a
  generic Bank Account class.
- **Day 30:** tune it against a real robotics subsystem if possible, or a
  simulated setpoint if not. The tuning log becomes the retrieval artifact for
  this unit, the same way commit messages serve that role for the rest of the
  sprint.

# Resources

- **PID intuition:** Brian Douglas, *"PID Control – A brief introduction"*
  (YouTube, *Control System Lectures*) — watched at Day 28, once class syntax
  is solid enough to build a `PIDController` class around it. Chosen over a
  written derivation: PID is 90% tuning intuition — watching the response
  curve overshoot and oscillate as gains change — and that's exactly what
  bench-tuning is. Reading the equations first would make me good at the math
  and bad at the actual skill.

# Daily Curriculum

| Day | Project | Core Concept |
|-----|---------|---------------|
| 1 | Temperature Converter | functions, variables, I/O |
| 2 | Rectangle Calculator | multiple variables, function passing |
| 3 | Shopping Calculator | operator precedence, expressions |
| 4 | Basic Calculator | many small functions, if/else |
| 5 | Multi-file Calculator | project organization (.h/.cpp split) |
| 6 | Debugging Challenge | syntax/logic/runtime error diagnosis |
| 7 | BMI Calculator | multiple data types |
| 8 | Username Validator | strings, conditionals |
| 9 | Movie Ticket System | if/else logic |
| 10 | Rock Paper Scissors | decision making |
| 11 | Guess the Number | while loops |
| 12 | Multiplication Table | for loops |
| 13 | Pattern Generator | nested loops |
| 14 | FizzBuzz | loops + conditions |
| 15 | Dice Simulator | random numbers |
| 16 | Function Overloading | overloaded functions |
| 17 | Array Statistics | arrays |
| 18 | Reverse Array | manual array manipulation |
| 19 | Pointer Swap | pointers |
| 20 | Pointer Traversal | pointer arithmetic |
| 21 | References | references vs. pointers |
| 22 | Student Record System | structs |
| 23 | Restaurant Ordering System | enums |
| 24 | Project Refactor | scope & linkage |
| 25 | Password Strength Checker | advanced string manipulation |
| 26 | Gradebook | vectors |
| 27 | Search & Sort | vectors + algorithms |
| 28 | PID Controller Class (Part 1) | first class, member functions |
| 29 | PID Controller Class (Part 2) | constructors, encapsulation, validation |
| 30 | PID Tuning & Integration | full integration, multi-file OOP project |

By Day 30 this covers functions, control flow, loops, arrays/vectors,
pointers/references, classes, and multi-file project organization — the core
toolkit needed to read and write real C++ codebases, plus a working, tuned
`PIDController` class.

# Repository Structure

```
30-day-cpp-sprint/
├── README.md
├── day01_solved.cpp
├── day01_blank.cpp
├── day02_solved.cpp
├── day02_blank.cpp
├── ...
├── day27_solved.cpp
├── day27_blank.cpp
├── pid/
│   ├── PIDController.h
│   ├── PIDController.cpp
│   └── tuning_log.md
└── day28_solved.cpp ... day30_solved.cpp
```

- The Day 30 tuning log serves the same role for the PID unit.

## Status

🚧 In progress — Day 4 of 30.
=======
# 30-Day C++ Sprint — Portfolio Site

A static site documenting a 30-day project-based C++ curriculum for VEX robotics preparation.

## Stack

- **Eleventy (11ty)** — Static site generator
- **Vanilla CSS/JS** — No framework dependencies
- **Cloudflare Workers + KV** — Progress persistence API
- **GitHub Actions** — Build & deploy
- **GitHub Pages** — Static hosting

## Local Development

```bash
# Install dependencies
npm ci

# Start dev server (with live reload)
npm run dev

# Production build
npm run build
```

## Cloudflare Setup

### 1. Create KV Namespace

```bash
wrangler kv:namespace create "cpp-sprint-progress"
# Note the namespace ID
```

### 2. Set Secrets

```bash
wrangler secret put GH_OAUTH_CLIENT_ID
wrangler secret put GH_OAUTH_CLIENT_SECRET
wrangler secret put GH_ADMIN_TOKEN
```

### 3. Update wrangler.toml

Replace `id` and `preview_id` with your KV namespace IDs.

### 4. Deploy Workers

```bash
wrangler deploy --env production
```

## GitHub Secrets

Required in repo Settings → Secrets → Actions:

| Secret | Description |
|--------|-------------|
| `CF_ACCOUNT_ID` | Cloudflare account ID |
| `CF_API_TOKEN` | API token with Workers KV:Edit |
| `GH_OAUTH_CLIENT_ID` | GitHub OAuth app client ID |
| `GH_OAUTH_CLIENT_SECRET` | GitHub OAuth app client secret |
| `GH_ADMIN_TOKEN` | GitHub PAT with `repo` scope (for admin commits) |

## GitHub OAuth App

1. Settings → Developer settings → OAuth Apps → New OAuth App
2. Homepage: `https://bowen-wan.github.io/30-Days-of-CPP`
3. Callback: `https://bowen-wan.github.io/30-Days-of-CPP/api/auth/callback`
4. Copy Client ID & Secret to GitHub Secrets

## Admin Panel

Visit `/admin` after GitHub OAuth login to update `currentDay` in `curriculum.json`. Triggers rebuild automatically.

## Project Structure

```
src/
├── _includes/
│   ├── layouts/base.njk
│   └── components/
│       ├── hero.njk
│       ├── mission-brief.njk
│       ├── goals.njk
│       ├── architecture.njk
│       ├── pid-integration.njk
│       ├── curriculum-table.njk
│       ├── curriculum-cards.njk
│       ├── slide-panel.njk
│       ├── review-process.njk
│       └── footer.njk
├── _data/curriculum.json          # Source of truth
├── assets/
│   ├── css/styles.css
│   ├── js/app.js                  # Main logic
│   └── js/curriculum-data.js.njk  # Generated at build
├── index.njk                      # Main page
└── admin.njk                      # Admin panel
functions/
├── api/
│   ├── _middleware.js
│   ├── progress.js                # GET/POST progress
│   └── admin/index.js             # OAuth + update-day
.github/workflows/deploy.yml       # Build & deploy
wrangler.toml                      # Workers config
```

## Curriculum Data

Edit `src/_data/curriculum.json` to update:
- `currentDay` — single source of truth
- `days[]` — project, concept, requirements, commit hash

## Fonts

`IBM Plex Mono` subset (Latin) self-hosted in `src/assets/fonts/`. Download from Google Fonts.

## License

MIT — Use freely for your own curriculum tracking.
>>>>>>> 49d7c98 (feat: initial 30-day C++ sprint portfolio site)
