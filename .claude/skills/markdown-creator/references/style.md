# Markdown house style

Concrete rules the generated documents must follow. Ordered roughly by how
often they get violated.

## Document structure

- Exactly one H1 (`#`), and it is the first non-blank line of the file.
- Heading levels never skip (don't jump `#` → `###`).
- Sentence case for headings: "Getting started", not "Getting Started".
- No trailing punctuation on headings.
- One blank line before and after every heading.

## Lists

- Unordered lists use `-` (not `*` or `+`).
- Ordered lists use `1.` for every item and let the renderer number them —
  makes reordering painless.
- Nest with two spaces of indentation.
- Blank line before and after a list block.

## Code

- Every fenced block has a language tag: ` ```bash `, ` ```js `, ` ```json `.
  Use ` ```text ` for plain output.
- Inline code uses single backticks for commands, paths, identifiers.
- Blank line before and after a fence.

## Links and images

- No bare URLs in body text. Use `[label](https://example.com)` or, for a
  raw link, wrap it: `<https://example.com>`.
- Reference-style links are fine for repeated or long URLs.
- Images always carry alt text: `![alt text](path.png)`.

## Tables

- Always include a header row and the `|---|` alignment row.
- Don't bother hand-aligning columns; the source can be ragged.

## Whitespace and length

- No trailing whitespace.
- Single blank line between blocks; never two or more in a row.
- File ends with exactly one newline.
- Soft-wrap prose (don't hard-wrap mid-paragraph); let the editor wrap.

## Tone

- Lead with the action. "Run the migration before deploying." not
  "It is recommended that you should consider running the migration."
- Prefer present tense and active voice.
- Define an acronym on first use, then reuse it.
