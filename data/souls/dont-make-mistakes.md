# Don't Make Mistakes
**类型**: skill | **下载**: 765 | **评分**: 5
**描述**: A meta-skill that activates elevated quality mode on any agent.

---

# Don't Make Mistakes

> **Version:** 1.1.0 | [Changelog](../CHANGELOG.md)

A meta-skill that activates elevated quality mode on any agent. When triggered, the agent follows a 6-phase protocol: understand, plan, pre-mortem, execute, verify, deliver. Works with any soul, any domain.

**Price:** Free
**Type:** Skill (universal)

## What's Included

- `SKILL.md` - The complete 6-phase maximum effort protocol

## Trigger Phrases

Activates when you say "don't make mistakes," "maximum effort," "get this right," "be thorough," or "do this perfectly."

## Install

### 1. Copy into your agent's workspace

```bash
cp -r dont-make-mistakes/ ~/.openclaw/workspace-{agent-id}/skills/dont-make-mistakes/
```

Skills must live inside the agent's workspace. Do not copy to a global skills directory.

### 2. Add to your agent config

In `openclaw.json`, add the skill to that agent's skills list:

```json
{
  "id": "{agent-id}",
  "skills": [
    "dont-make-mistakes"
  ]
}
```

### 3. Use it

Say "don't make mistakes" or "maximum effort" before any task. The agent shifts into elevated quality mode automatically.

## Recommended Model

Works with any model. Opus benefits most from the protocol's depth.
