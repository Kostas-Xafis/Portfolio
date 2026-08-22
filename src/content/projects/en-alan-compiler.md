---
slug: alan-compiler
lang: en
title: Alan Compiler
summary: A complete compiler for the Alan language — JFlex lexer, CUP LALR parser, typed AST with symbol tables, and direct JVM bytecode emission via ASM. A hard, technical project from start to finish.
category: compilers
stack: [Java, JFlex, CUP, ASM, Maven]
status: academic
year: 2024
featured: true
links:
  repo: https://github.com/Kostas-Xafis/AlanCompiler
---

## Overview

Alan is a small imperative teaching language: `byte`/`int`/`reference`/`proc` types, functions, `if/else`, `while`, strings, and a runtime library of built-ins. This project is a complete compiler for it — from source text to executable JVM bytecode.

The hardest decision was also the most satisfying: instead of emitting Java source and letting javac finish the job, the compiler emits **JVM bytecode directly** with the ASM tree API (`ClassNode`, `MethodNode`, `InsnList`). That means every phase of a real compiler had to work.

## What I built

A classic three-stage pipeline:

1. **Lexing** — a JFlex grammar (`lexer.jflex`) covering keywords, hex and string literals, `--` comments, with line/column tracking.
2. **Parsing** — a CUP LALR grammar (`parser.cup`) with operator-precedence declarations, building a typed AST (`Program`, `FuncDef`, `Expr`, `IfStmt`, `WhileStmt`, `Assignment`…).
3. **Semantics and code generation** — a `SymbolTable`/`SymbolEntry` stack with full type checking (`SemanticException`, `TypeException`), then `IRGen`/`CompileContext` walking the AST into ASM bytecode. A `MemHeap` manages memory layout and a `library/` package provides runtime intrinsics (`ReadInteger`, `WriteString`, `Strcmp`, `StringToArrayList`).

The delivery includes Maven build scripts and shell tools for syntax check, semantic check, compile and execute — with working example programs: `hello_world`, bubble sort, Hanoi towers, primes, string reversal.

## Technical highlights

- Complete pipeline: lexer, parser, typed AST and JVM bytecode, nothing stubbed
- Direct bytecode emission via ASM — no source-level round trip
- Symbol tables, type checking and runtime library for a full language

## Outcome

Real Alan programs compile and run on the JVM. Of all the technical work I have done, this one gave me the most: it is demanding, precise, and deeply enjoyable.
