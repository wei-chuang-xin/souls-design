# Creative Thinking Skill
**类型**: skill | **下载**: 564 | **评分**: 4
**描述**: Structured creative thinking protocol with semantic temperature control.

---

# Creative Thinking

> **Version:** 1.1.0 | [Changelog](../CHANGELOG.md)

A structured protocol that shifts an agent's cognitive mode mid-task using semantic temperature control. Three phases: Ground (surface assumptions), Explode (5-level Depth Ladder for escalating creativity), Forge (stress-test and synthesize). Works with any soul.

**Price:** Free
**Type:** Skill (universal)

## What's Included

- `SKILL.md` - The complete 3-phase creative thinking protocol with Depth Ladder

## How It Works

The protocol uses specific language patterns to widen and narrow the token probability distribution at targeted moments. Phase 2's language ("forget constraints," "surprise yourself") functions as a semantic temperature increase. Phase 3's language ("eliminate ruthlessly," "stress test") narrows it back. The agent's soul determines the flavor of creativity. This skill provides the structure.

### The Depth Ladder

Five escalating levels:

1. **Obvious variations** - conventional alternatives (warm-up)
2. **Assumption destroyers** - violate each assumption from Phase 1
3. **Cross-domain theft** - steal solutions from unrelated fields
4. **The inversion** - flip the worst possible approach
5. **The absurd leap** - the idea you'd normally filter out

## Install

### 1. Copy into your agent's workspace

```bash
cp -r creative-thinking/ ~/.openclaw/workspace-{agent-id}/skills/creative-thinking/
```

Skills must live inside the agent's workspace. Do not copy to a global skills directory.

### 2. Add to your agent config

In `openclaw.json`, add the skill to that agent's skills list:

```json
{
  "id": "{agent-id}",
  "skills": [
    "creative-thinking"
  ]
}
```

### 3. Use it

Ask your agent to "brainstorm," "think creatively," "explore options," or "think outside the box." The protocol activates automatically.

## Recommended Model

Works with any model. Opus produces the widest creative range. Sonnet is solid and cost-effective.
