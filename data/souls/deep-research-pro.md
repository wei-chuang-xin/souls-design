# Deep Research Pro
**类型**: skill | **下载**: 3 | **评分**: 0
**描述**: Multi-source deep research agent with web search and cited reports.

---

# Deep Research Pro

> **Version:** 1.1.0 | [Changelog](../CHANGELOG.md)

A multi-source deep research skill that searches the web, synthesizes findings, and delivers cited reports. Uses OpenClaw's built-in `web_search` and `web_fetch` tools. No API keys required.

**Price:** Free
**Type:** Skill (universal)

## What's Included

- `SKILL.md` - The complete research workflow (6 steps: understand, plan, search, deep-read, synthesize, deliver)

## How It Works

Give your agent a research topic. It breaks it into 3-5 sub-questions, runs multiple searches per question, deep-reads the best sources, cross-references claims, and delivers a structured report with inline citations and a full source list.

### Quality Rules

- Every claim has a source. No unsourced assertions.
- Single-source claims flagged as unverified.
- Recent sources preferred (last 12 months).
- Gaps acknowledged honestly.
- Zero hallucination: "insufficient data found" when appropriate.

## Install

### 1. Copy into your agent's workspace

```bash
cp -r deep-research-pro/ ~/.openclaw/workspace-{agent-id}/skills/deep-research-pro/
```

Skills must live inside the agent's workspace. Do not copy to a global skills directory.

### 2. Add to your agent config

In `openclaw.json`, add the skill to that agent's skills list:

```json
{
  "id": "{agent-id}",
  "skills": [
    "deep-research-pro"
  ]
}
```

### 3. Use it

Ask your agent to research any topic:
- "Research the current state of nuclear fusion energy"
- "Deep dive into Rust vs Go for backend services"

## Requirements

- OpenClaw with `web_search` and `web_fetch` tools enabled
- No external API keys needed

## Recommended Model

- **Best:** Opus (deepest synthesis and cross-referencing)
- **Good:** Sonnet (solid for most research tasks)
