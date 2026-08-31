# Claude Code Instructions for MSU Slides Repository

## Overview

This is a RevealJS presentation repository for Michigan State University course slides. Slides are
tightly coupled with Obsidian vaults under `/Users/jesseflores/vaults/courses/`. Always maintain
bi-directional linking between slides and vault content.

## Current State (updated 2026-08-31)

| Course dir | Course | Semester | Vault | Status |
|---|---|---|---|---|
| `ssc-490/` | SSC 490-005 | **Fall 2026** | `~/vaults/courses/msu/msu-ssc490-fall2026/` | **ACTIVE** |
| `ssc-493/` | SSC 493 | Spring 2026 | `~/vaults/courses/msu/msu-ai-course/` | Frozen pilot — do not edit |

**Work in `ssc-490/`.** It was cloned from `ssc-493/` on 2026-08-31 and rebranded; all 23 pilot
decks are present as source material. The Fall arc is still being designed, so session filenames
still carry the *pilot's* numbering and the HTML wrappers say "session mapping pending" instead of
a date. When the Fall arc lands, remap sessions to the 28-slot Fall grid in the vault's
`course-calendar.md` (authoritative) and update `ssc-490/index.html`.

`ssc-493/` is the honest record of what was actually taught in the pilot — and it is a *better*
record than the pilot vault's lesson plans, which stop before Session 21. Read it; don't change it.

> [!important] Frontmatter convention below is aspirational, not actual
> The YAML front matter documented in "Create Markdown Content File" is **not present in any
> existing deck**. Every `ssc-493/markdown/*.md` and `ssc-490/markdown/*.md` file starts directly
> with slide content. Metadata lives in the HTML wrapper's title slide instead. Either adopt the
> frontmatter deliberately going forward or ignore it — but don't assume it's there.

## Directory Structure

**Pattern:** `course-id/lesson-name`

- **No unit folders** - Course may be reorganized, so keep structure flat
- **One Markdown file per lesson** - Preferred format for presentations
- **HTML wrapper per lesson** - References the markdown file
- **Course-level index** - Each course has an `index.html` listing all lessons
- **Root index** - Repository root has master index linking to all courses

Example:
```
ssc-490/
├── index.html                          # course-level index
├── session-01-course-framework.html    # HTML wrapper
├── session-02-prompts-language-models.html
├── assets/                             # course-specific images, SVGs, QR codes
└── markdown/                           # slide content
    ├── session-01-course-framework.md
    └── session-02-prompts-language-models.md
```

## Creating New Lesson Slides

### 1. Create Markdown Content File

Location: `[course-id]/markdown/[lesson-name].md`

Use this format with YAML front matter:
```markdown
---
title: "Session 1: Understand AI Models"
course: "ssc-490"
week: 1
session: 1
date: "2026-01-13"
duration: 80
obsidian_vault_link: "/Users/jesseflores/vaults/courses/msu/msu-ssc490-fall2026/course-calendar.md#Session 1"
published_slide_url: "https://msu-slides.superwebpros.com/ssc-490/session-01-course-framework.html"
learning_objectives:
  - Understand what AI models are
  - How tokens, training, and inference work
  - Why models perform differently
---

# Session 1: Understand AI Models

## Learning Objectives

- Understanding what AI models are
- How they work (tokens, training, inference)
- Why different models perform differently

---

## What is AI? Mini-Lecture

Content here

---

## Live Demo: LibreChat

Demo content

;;;

### Vertical Slide Example

Sub-content here

---

## Hands-On Activity

Activity instructions

Note:
Speaker notes go here after "Note:"
- Point 1
- Point 2
```

**Slide separators:**
- `---` = Horizontal slide (new section)
- `;;;` = Vertical slide (sub-topic)
- `Note:` = Speaker notes (visible in presenter view)

### 2. Create HTML Wrapper

Location: `[course-id]/[lesson-name].html`

Template:
```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Session 1: Understand AI Models - MSU AI Course</title>

    <link rel="stylesheet" href="../dist/reset.css">
    <link rel="stylesheet" href="../dist/reveal.css">
    <link rel="stylesheet" href="../dist/theme/white.css" id="theme">
    <link rel="stylesheet" href="../plugin/highlight/monokai.css">
</head>
<body>
    <div class="reveal">
        <div class="slides">
            <!-- Title slide -->
            <section>
                <h2>MSU AI Course</h2>
                <h3>Session 1: Understand AI Models</h3>
                <p>Week 1 - January 13, 2026</p>
            </section>

            <!-- Load markdown content -->
            <section data-markdown="markdown/session-01-ai-fundamentals.md"
                     data-separator="^\r?\n---\r?\n$"
                     data-separator-vertical="^\r?\n;;;\r?\n$"
                     data-separator-notes="^Note:">
            </section>
        </div>
    </div>

    <script src="../dist/reveal.js"></script>
    <script src="../plugin/markdown/markdown.js"></script>
    <script src="../plugin/highlight/highlight.js"></script>
    <script src="../plugin/notes/notes.js"></script>

    <script>
        Reveal.initialize({
            hash: true,
            pdfSeparateFragments: false,
            plugins: [ RevealMarkdown, RevealHighlight, RevealNotes ]
        });
    </script>
</body>
</html>
```

### 3. Update Obsidian Vault

Add slide link to the corresponding session in the ACTIVE course vault's calendar
(`/Users/jesseflores/vaults/courses/msu/msu-ssc490-fall2026/course-calendar.md` for Fall 2026):

```markdown
| Week | Session | Date | Learning Objectives | Slides |
|------|---------|------|---------------------|--------|
| 1 | 1 | 2026-01-13 | Understand AI Models | [View Slides](../../Sites/msu/msu-slides/ssc-490/session-01-course-framework.html) |
```

### 4. Update Course Index

Add entry to `[course-id]/index.html`:
```html
<li><a href="session-01-ai-fundamentals.html">Session 1: Understand AI Models</a></li>
```

### 5. Update Root Index

Add course to `/index.html` if it's a new course.

## Obsidian Coupling Pattern

**Bi-directional linking:**
1. Slide markdown front matter includes `obsidian_vault_link` pointing to course calendar entry
2. Slide markdown front matter includes `published_slide_url` for the live/deployed version
3. Obsidian course calendar includes link to local slide HTML file
4. When slides are published, update Obsidian with the published URL

**Workflow:**
- Course content planned in Obsidian first
- Slides created from course calendar structure
- Links maintained in both directions
- Published URL added after deployment

## Common Bash Commands

Start development server (live reload on port 8000):
```bash
npm start
```

Build production assets:
```bash
npm run build
```

Build only CSS themes:
```bash
gulp css-themes
```

Serve from custom directory:
```bash
gulp serve --root ./ssc-490 --port 9000
```

## Code Style Guidelines

**Markdown:**
- Use ATX-style headers (`#`, `##`, `###`)
- Separate slides with `---` (horizontal) or `;;;` (vertical)
- Add speaker notes with `Note:` prefix
- Include YAML front matter for metadata

**HTML:**
- Use semantic HTML5 elements
- Prefer relative paths (`../dist/`) for framework assets
- Include meta viewport for responsive design
- Always initialize reveal.js with required plugins

**Asset paths:**
- Shared assets: `../assets/[filename]`
- Course-specific assets: `./assets/[filename]` within course directory
- Framework assets: `../dist/`, `../plugin/`

## Session Structure Pattern

Each 80-minute session typically includes:
1. **Recap** (5 min) - Previous session review
2. **Learning Objectives** (5 min) - What's new
3. **Mini-Lecture** (20 min) - Core concepts
4. **Live Demo** (optional, integrated or separate)
5. **Hands-On Activity** (40 min) - Applied practice
6. **Wrap-up** (5 min) - Preview next session
7. **Deliverable Reminder** (5 min) - What's due

Map these to slide sections with `---` separators.

## Testing Instructions

**Manual testing:**
1. Run `npm start`
2. Open `http://localhost:8000/[course-id]/[lesson-name].html`
3. Navigate slides with arrow keys
4. Press `S` for speaker notes view
5. Press `ESC` for slide overview
6. Check that markdown renders correctly
7. Verify code highlighting works
8. Test PDF export with `?print-pdf` query parameter

**Before committing:**
- Ensure all relative paths work correctly
- Verify front matter YAML is valid
- Check that Obsidian links point to correct locations
- Confirm index pages are updated

## Repository Conventions

**Branch naming:** Not specified, use descriptive names

**File naming:**
- Lowercase with hyphens: `session-01-ai-fundamentals.md`
- Prefix with session/lesson number for ordering
- Use descriptive names matching learning objectives

**Commits:**
- Clear, descriptive messages
- Group related changes (slide + index updates together)
- Reference course calendar when relevant

**Assets:**
- Place shared assets in `/assets/` (logos, common images)
- Place course-specific assets in `[course-id]/assets/`
- Use descriptive filenames
- Optimize images before committing (reasonable file sizes)

## Project-Specific Quirks

**RevealJS features used:**
- Markdown plugin (primary content format)
- Syntax highlighting (code examples)
- Speaker notes (instructor guidance)
- Vertical slides (sub-topics within sections)

**Not using:**
- Pure HTML slides (prefer markdown)
- Complex build processes (keep it simple)
- Unit folders (intentionally flat structure)

**Important notes:**
- Always check course calendar before creating slides
- Maintain consistency with session structure (80-min format)
- Use front matter for all metadata
- Keep bi-directional links current
- Update indexes when adding new content

## Reference Files

**Obsidian Vault — active course (Fall 2026, SSC 490-005):**
- `~/vaults/courses/msu/msu-ssc490-fall2026/README.md` - start here
- `~/vaults/courses/msu/msu-ssc490-fall2026/course-calendar.md` - **authoritative** dates & session numbering
- `~/vaults/courses/msu/msu-ssc490-fall2026/course-facts.md` - enrollment, staffing, infra, funding
- `~/vaults/courses/msu/msu-ssc490-fall2026/course-arc.md` - semester arc (in design)

**Obsidian Vault — frozen pilot (Spring 2026, SSC 493):**
- `~/vaults/courses/msu/msu-ai-course/` - read-only historical record
- `~/vaults/courses/msu/msu-ai-course/course-proposal.md` - original course overview

**Example Presentations:**
- `/Users/jesseflores/Sites/swp/pro-slides-v2/` - Production multi-presentation repo
- `./examples/markdown.html` and `./examples/markdown.md` - RevealJS markdown examples

**Framework Documentation:**
- `./README.md` - RevealJS documentation
- https://revealjs.com - Official documentation
