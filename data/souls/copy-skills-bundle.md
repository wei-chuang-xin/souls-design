# Copy Skills Bundle
**类型**: skill | **下载**: 533 | **评分**: 0
**描述**: Turn any agent into a sharp copywriter. 6 format skills plus humanizer.

---

# Copy Skills Bundle

> **Version:** 1.1.0 | [Changelog](../CHANGELOG.md)

Turn any agent into a sharp copywriter. 6 complete format skills, an anti-AI humanizer, and 8,300+ lines of deep research reference material from studying master creators.

**Price:** $29

## What's Inside

### Master Router (`copy-suite/SKILL.md`)
Automatically routes copy requests to the right format skill. Includes a 6-point quality gate run on every piece.

### 6 Format Skills

| Format | File | What It Covers |
|--------|------|---------------|
| Social Copy | `formats/social-copy.md` | 7 hook types, engagement psychology, platform voice, viral patterns |
| Thread Copy | `formats/thread-copy.md` | Thread architecture (hook/bridge/body/close), 7 thread types, mega-thread strategy |
| Long-Form Social | `formats/long-form.md` | Emotional architecture, 5 post types, Robert Greene readability standard |
| Conversion Copy | `formats/conversion-copy.md` | Schwartz's 5 awareness levels, sales pages, email sequences, ad copy |
| Web Copy | `formats/web-copy.md` | AIDA/PAS/BAB/StoryBrand frameworks, page anatomy, headline principles |
| Articles & Blog | `formats/articles-blog.md` | 3 article architectures, headline formulas, SEO-aware writing |

### Anti-AI Humanizer (`humanizer.md`)
24-category AI pattern detection with before/after examples.

### Deep Reference Library (`references/`)
8,300+ lines of research from master creator analysis.

## Install

### 1. Copy into your agent's workspace

```bash
cp -r copy-suite/ ~/.openclaw/workspace-{agent-id}/skills/copy-suite/
```

Skills must live inside the agent's workspace. Do not copy to a global skills directory.

### 2. Add to your agent config

In `openclaw.json`, add `copy-suite` to that agent's skills list:

```json
{
  "id": "{agent-id}",
  "skills": [
    "copy-suite"
  ]
}
```

### 3. Verify

Ask your agent: "Write a tweet about why most landing pages fail."

It should route to the social-copy format, apply hook selection, run the humanizer pass, and deliver with the quality gate.

## Works With Any Agent

Add it to a marketing agent, brand agent, content strategist, or general assistant. The master router handles format selection automatically.
