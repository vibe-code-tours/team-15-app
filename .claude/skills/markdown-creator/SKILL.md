---
name: markdown-creator
description: >-
  Create, draft, and format well-structured Markdown documents — READMEs,
  CHANGELOGs, architecture decision records (ADRs), and how-to guides. Use
  when the user asks to write, draft, generate, scaffold, or format a Markdown
  file, doc, README, changelog, ADR, or guide, or wants existing Markdown
  cleaned up to a consistent house style.
---

# Markdown Creator

Produces clean, consistent Markdown documents from a small set of proven
templates, applies a house style, and (optionally) lints the result.

All paths below are relative to this skill directory
(`.claude/skills/markdown-creator/`).

## When to use

Trigger this skill when the request is to **author or reshape a Markdown
document**, e.g.:

- "Write a README for this project"
- "Draft a CHANGELOG entry for the 1.2.0 release"
- "Record this decision as an ADR"
- "Turn these notes into a how-to guide"
- "Clean up this Markdown to match our style"

Do **not** use it for editing code, prose unrelated to docs, or non-Markdown
formats.

## Workflow

1. **Pick the document type.** Match the request to a template in
   `templates/`. If none fits, start from the closest one and adapt.

   | Want | Template |
   |------|----------|
   | Project overview / setup | `templates/readme.md` |
   | Release notes | `templates/changelog.md` |
   | Why-we-chose-X record | `templates/adr.md` |
   | Task walkthrough | `templates/how-to.md` |

2. **Fill the template.** Replace every `{{PLACEHOLDER}}`. Delete sections
   that don't apply rather than leaving them empty. Never ship a `{{...}}`
   token in the final file.

3. **Apply house style.** Read `references/style.md` and conform to it
   (one sentence per line is *not* required; the concrete rules are). For
   syntax you're unsure about, check `references/syntax.md`.

4. **Write the file** with the standard file tools to the location the user
   wants (default: repo root for `README.md`, `docs/` otherwise).

5. **Validate (optional but recommended).** Run the linter:

   ```bash
   bash .claude/skills/markdown-creator/scripts/lint.sh path/to/file.md
   ```

   Fix anything it flags, then re-run until clean.

## House style (summary)

Full rules in `references/style.md`. The essentials:

- One `#` H1 per document, as the first line.
- Sentence-case headings; no trailing punctuation.
- Fenced code blocks always carry a language tag (` ```bash `, ` ```js `).
- Bullet lists use `-`; ordered lists use `1.` and let Markdown renumber.
- Wrap bare URLs in `<...>` or use `[text](url)`.
- Tables get a header row and an alignment row.
- Leave one blank line around headings, lists, and code fences.

## Templates

Read the template file before filling it — they carry inline guidance in
HTML comments (`<!-- ... -->`) that you should remove from the final doc.

## Validate

`scripts/lint.sh` wraps `markdownlint-cli2` via `npx` (downloaded on first
run; no global install needed). Config lives in
`scripts/.markdownlint-cli2.jsonc`. Exit code `0` = clean.
