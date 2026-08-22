---
slug: alan-compiler-jvm-bytecode
lang: en
cover: alan-compiler-jvm-bytecode.webp
title: "From lexer to JVM bytecode: writing a compiler for the Alan language"
description: A look inside a complete compiler — JFlex lexer, CUP LALR parser, typed AST with symbol tables, and direct JVM bytecode emission via ASM. The hardest, most technical project I've enjoyed the most.
date: 2026-08-06
tags: [compiler, java, jvm, bytecode, asm, alan]
relatedProjects: [alan-compiler]
---

Every compiler course teaches the same pipeline: lexing, parsing, semantic analysis, code generation. Writing one from scratch makes you realize how much each phase quietly does.

## The language

Alan is a small imperative teaching language. It has `byte`, `int`, `reference` and `proc` types, functions, `if/else`, `while`, strings and chars, and a runtime library of built-ins. Small enough to be tractable, big enough that nothing is a shortcut.

## The three stages

**Lexing.** The JFlex grammar (`lexer.jflex`) recognizes keywords, hex and string literals, and `--` comments, tracking line and column for diagnostics. Lexing looks trivial until you handle string escapes and hex literals correctly.

**Parsing.** The CUP grammar (`parser.cup`) is LALR, with operator-precedence declarations so expressions parse as the language specifies. The output is a typed AST — `Program`, `FuncDef`, `Expr`, `IfStmt`, `WhileStmt`, `Assignment` and friends — which means the parser also validates the shape of declarations.

**Semantics.** A `SymbolTable`/`SymbolEntry` stack scopes declarations and a full type checker walks the AST, raising `SemanticException`/`TypeException`. This is where undeclared variables, type mismatches and wrong arity are caught — before any code is generated.

## The interesting part: bytecode, not source

The most important decision was to emit **JVM bytecode directly** with the ASM tree API (`ClassNode`, `MethodNode`, `InsnList`) rather than generating Java source and letting `javac` finish the job. It is the honest route: every phase of the compiler has to actually work.

The consequences are immediate and unforgiving:

- Control flow (`if`, `while`, short-circuit logic) must be translated to explicit label and jump instructions.
- Function calls need operand-stack discipline — arguments pushed in order, return values accounted for, stack depth consistent at every branch merge.
- Strings and the runtime library need a memory model: a `MemHeap` manages layout, and a `library/` package provides intrinsics like `ReadInteger`, `WriteString`, `Strcmp` and `StringToArrayList`.
- Local variable slots and `byte` vs `int` instructions (`ILOAD` vs `BLOAD`-style semantics) must be tracked through the symbol table.

Each bug manifests as a `VerifyError` at runtime — or worse, silently wrong output. There is no compiler to catch your compiler's mistakes.

## What shipped

- Shell tooling for syntax check, semantic check, compile and execute
- Maven build with a clean package layout
- Working example programs: `hello_world`, bubble sort, Tower of Hanoi, primes, string reversal

## Why it mattered

Writing this compiler was demanding and precise in a way that web development rarely is. The reward comes at the end: a real program in a real language, compiled by software you wrote, running correctly on the JVM. The stack trace from a bug in your own code generator teaches more about the JVM than any tutorial.

It remains the project I am most proud of — and the one I enjoyed the most.
