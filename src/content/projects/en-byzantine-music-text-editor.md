---
slug: byzantine-music-text-editor
lang: en
cover: byzantine-music-text-editor.webp
title: Byzantine Music Text Editor
summary: A Microsoft Word add-in that turns an on-screen neume keyboard into a Byzantine music notation editor, exporting valid Word OOXML.
category: fullstack
stack: [TypeScript, Office Add-in, OOXML, opentype.js, webpack, Clerk]
status: archived
year: 2022
featured: false
links:
  repo: https://github.com/Kostas-Xafis/Byzantine-Music-Text-Editor
---

## Overview

Byzantine chant notation (neumes) is not supported by standard word processors. This Word add-in provides an on-screen neume keyboard inside the Word taskpane, maps physical Greek and English keyboard layouts to chant glyphs, and inserts the result as valid WordprocessingML into the document.

## What I built

A custom grid-based text editor in the taskpane, with rows and columns of chant characters and cursor handling for composition. `fontMaps.ts` maps each named neume (Ison, Oligon, Petasti, Apostrofos, Yporroi, Diesi, Gorgon, Klasma…) to its Unicode code point in the SERAFIM+ font — mostly on the astral or private-use plane — and `keyboard.ts` provides the Greek/English keyboard synthesis layout.

`sendOOXML.ts` serializes the grid into WordprocessingML via xmlbuilder2 with unit-conversion helpers (`PxToDxa`, `CmToDxa`) for A4/A3/Letter/Legal paper. Authentication is embedded via Clerk, and compositions persist locally.

## Technical highlights

- Full neume-to-Unicode mapping with layout abstraction over the font
- Grid editor with cursor and composition state
- Valid OOXML emission with precise unit conversions
- Embedded Clerk auth in a taskpane

## Outcome

A functional notation editor for Word; superseded by later school tooling.
