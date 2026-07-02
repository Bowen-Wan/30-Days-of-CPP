# 30-Day C++ Sprint — VEX Robotics Prep

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

## Goals

- Reach a level of C++ fluency where I can read and modify our team's existing
  code without hand-holding.
- Build every core concept needed for a from-scratch PID controller class:
  functions, control flow, arrays/pointers/references, classes, and
  multi-file project structure.
- Retain what I learn — not just finish lessons. Every day produces working,
  tested code, not notes.

## Structure

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

## PID Integration — Decided

Watched at Day 28 (Brian Douglas video, see Resources), after class syntax is
solid but before the sprint's own class capstones.

- **Day 28–29:** build `PIDController` as the class project — constructor,
  member functions, encapsulation of gains and error state — instead of a
  generic Bank Account class.
- **Day 30:** tune it against a real robotics subsystem if possible, or a
  simulated setpoint if not. The tuning log becomes the retrieval artifact for
  this unit, the same way commit messages serve that role for the rest of the
  sprint.

## Resources

- **PID intuition:** Brian Douglas, *"PID Control – A brief introduction"*
  (YouTube, *Control System Lectures*) — watched at Day 28, once class syntax
  is solid enough to build a `PIDController` class around it. Chosen over a
  written derivation: PID is 90% tuning intuition — watching the response
  curve overshoot and oscillate as gains change — and that's exactly what
  bench-tuning is. Reading the equations first would make me good at the math
  and bad at the actual skill.

## Daily Curriculum

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

## Repository Structure

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

🚧 In progress — Day 2 of 30.
