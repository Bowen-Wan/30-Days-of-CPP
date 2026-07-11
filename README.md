# 30 Days of C++ — Project-Based Learning

A 30-day, project-based C++ curriculum built to take me from fundamentals to class-based, multi-file C++ projects.

The goal is to reach a level where I can contribute to my team's codebase by September and support the PID implementation work integrated into the backend of our sprint.

---

## Philosophy

Most learn-to-code repositories show only the finished solution and hide the learning process.

This repository does the opposite.

Every commit message records exactly what I struggled with that day, and every `dayN_blank.cpp` file is a cold-recall test I revisit about a week later. If I can't rebuild the solution from memory and pass the provided assertions, the topic gets flagged for re-study.

The final three days build toward a `PIDController` class tuned against a real robotics subsystem (or simulation), emphasizing tuning intuition rather than textbook derivations.

If you want to evaluate whether the retrieval practice actually works, the commit history is more meaningful than the finished solutions.

---

# Goals

- Reach a level of C++ fluency where I can confidently read and modify my team's existing code.
- Build every core concept needed to implement a PID controller from scratch:
  - Functions
  - Control flow
  - Arrays
  - Pointers
  - References
  - Classes
  - Multi-file project organization
- Retain what I learn through retrieval practice instead of simply completing lessons.
- Produce working, tested code every day.

---

# Repository Structure

Each day contains two files.

### `dayN_solved.cpp`

The completed implementation for that day's project.

This answers:

> "Did I learn it today?"

### `dayN_blank.cpp`

The same project with the implementation removed.

Only the function signatures, comments, and assertions remain.

Approximately one week later, I rebuild the solution entirely from memory.

If I can't pass the tests without looking at the solved version, the topic is scheduled for review.

---

# PID Integration

Rather than building a generic "Bank Account" class, the final project applies object-oriented programming to a real control systems problem.

### Schedule

**Day 28**

- Watch Brian Douglas' PID introduction
- Begin `PIDController`
- Member functions
- Class design

**Day 29**

- Constructors
- Encapsulation
- Validation
- Finish the controller implementation

**Day 30**

- Tune the controller against a robotics subsystem (or simulation)
- Record observations in `tuning_log.md`

The tuning log becomes the retrieval artifact for this unit in the same way commit messages document learning throughout the sprint.

---

# Resources

### PID Control

Brian Douglas

**PID Control – A Brief Introduction**

Watched on Day 28 after class syntax is comfortable enough to build a real `PIDController`.

I intentionally chose a video over a mathematical derivation because PID control is largely about developing tuning intuition. Watching overshoot, oscillation, and settling behavior while adjusting gains more closely reflects real-world controller tuning than beginning with the equations.

---

# Daily Curriculum

| Day | Project | Core Concept |
|----:|---------|--------------|
| 1 | Temperature Converter | Functions, variables, I/O |
| 2 | Rectangle Calculator | Multiple variables, function parameters |
| 3 | Shopping Calculator | Expressions, operator precedence |
| 4 | Basic Calculator | Small functions, if/else |
| 5 | Multi-file Calculator | Project organization (.h/.cpp split) |
| 6 | Debugging Challenge | Syntax, logic, runtime errors |
| 7 | BMI Calculator | Multiple data types |
| 8 | Username Validator | Strings, conditionals |
| 9 | Movie Ticket System | If/else logic |
| 10 | Rock Paper Scissors | Decision making |
| 11 | Guess the Number | While loops |
| 12 | Multiplication Table | For loops |
| 13 | Pattern Generator | Nested loops |
| 14 | FizzBuzz | Loops + conditions |
| 15 | Dice Simulator | Random numbers |
| 16 | Function Overloading | Function overloading |
| 17 | Array Statistics | Arrays |
| 18 | Reverse Array | Manual array manipulation |
| 19 | Pointer Swap | Pointers |
| 20 | Pointer Traversal | Pointer arithmetic |
| 21 | References | References vs. pointers |
| 22 | Student Record System | Structs |
| 23 | Restaurant Ordering System | Enums |
| 24 | Project Refactor | Scope and linkage |
| 25 | Password Strength Checker | Advanced string manipulation |
| 26 | Gradebook | Vectors |
| 27 | Search & Sort | Vectors and algorithms |
| 28 | PID Controller (Part 1) | First class, member functions |
| 29 | PID Controller (Part 2) | Constructors, encapsulation, validation |
| 30 | PID Tuning & Integration | Multi-file OOP project |

By Day 30, this curriculum covers the core C++ toolkit required to understand and contribute to real-world codebases while culminating in a working, tuned `PIDController`.

---

# Repository Layout

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
├── day28_solved.cpp
├── day29_solved.cpp
└── day30_solved.cpp
```

---

# Status

🚧 **In Progress**

**Current Day:** 4 / 30
