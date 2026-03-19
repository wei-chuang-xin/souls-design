# Founder's Growth Stack
**类型**: team | **下载**: 3 | **评分**: 0
**描述**: Two-agent team for founders who build great things but need help selling them.

---

# Install: Founder's Growth Stack

> **Version:** 1.1.0 | [Changelog](../CHANGELOG.md)

**You are creating a team of 2 agents.** Each agent gets its own workspace. The Chief of Staff leads strategy and delegates marketing execution to the CMO. Follow every step below.

> Strategy + marketing duo for founders. Chief of Staff handles priorities, decisions, and delegation. CMO handles marketing strategy, content, brand voice, and copy. The CoS coordinates via spawn templates.

## Team Members

| Agent | Role | Recommended Model |
|-------|------|-------------------|
| Chief of Staff | Strategic operations, priorities, delegation, decisions | Opus |
| The CMO | Marketing strategy, content planning, brand voice, copy | Sonnet |

## Files

```
agents/
├── chief-of-staff/agent/       # Lead agent
│   ├── (7 core files)
│   └── skills/
│       ├── strategic-planning/
│       ├── team-coordination/   # Spawn templates for CMO delegation
│       └── nightly-compound/
└── the-cmo/agent/
    ├── (7 core files)
    └── skills/
        ├── marketing-strategy/
        ├── content-planning/
        ├── brand-voice-dev/
        ├── copy-suite/          # 6 format skills + humanizer + research
        ├── creative-thinking/
        └── nightly-compound/
```

## Setup Instructions (For the Installing Agent)

### 1. Name the Team

Ask the user: **"What would you like to name each agent? Or I can use defaults (chief-of-staff, cmo)."**

### 2. Check for Conflicts

Read `openclaw.json`. Search `agents.list` for any existing agent with chief of staff, operations, marketing, or cmo in its role. If found, ask per-agent: **replace**, **keep both**, or **cancel**.

### 3. Choose Mode

Ask: **"Should the Chief of Staff be your main contact (Direct), or should it run behind an existing agent (Delegated)?"**

The Chief of Staff gets Direct mode. The CMO is always Delegated (spawned by the CoS). **If Direct:** Ask platform. For Telegram: create bot via @BotFather, paste token.

### 4. Create Workspaces

```bash
cp -r agents/chief-of-staff/agent/* ~/.openclaw/workspace-{cos-id}/
cp -r agents/the-cmo/agent/* ~/.openclaw/workspace-{cmo-id}/
```

OpenClaw auto-discovers skills from each agent's workspace `skills/` directory. The skill names in the config (Step 5) must match the folder names inside `skills/`.

### 5. Configure Both Agents

**Chief of Staff (lead):**
```json
{
  "id": "{cos-id}",
  "skills": ["strategic-planning", "team-coordination", "nightly-compound"],
  "subagents": { "allowAgents": ["{cmo-id}"] }
}
```

**CMO:**
```json
{
  "id": "{cmo-id}",
  "skills": ["marketing-strategy", "content-planning", "brand-voice-dev", "copy-suite", "creative-thinking", "nightly-compound"],
  "subagents": { "allowAgents": ["*"] }
}
```

> The CMO uses `"allowAgents": ["*"]` (wildcard) because it may need to spawn creative sub-agents for research, competitive analysis, or copy work on demand. If you prefer tighter control, replace `"*"` with a scoped list of agent IDs the CMO is allowed to spawn (e.g., `["{cos-id}", "researcher"]`).

### 6. Delegation Wiring

The Chief of Staff's `team-coordination` skill includes a spawn template for delegating to the CMO. The flow:

1. User talks to Chief of Staff about a marketing need
2. CoS frames the strategic context (audience, positioning, constraints)
3. CoS spawns CMO with a structured brief
4. CMO develops strategy/content, runs humanizer check
5. CMO reports back to CoS
6. CoS reviews strategic alignment and presents to user

### 7. Vector Memory (Optional)

Check `openclaw.json` for existing `memorySearch` config. If already configured, skip this step. If not configured, ask: **"Want vector memory search? Requires an OpenAI API key."** Recommended for the Chief of Staff. If yes, add `memorySearch` config. If no, skip.

### 8. Compound Loops

Set up 2 staggered crons. Ask user's timezone:

| Agent | Time | Focus |
|-------|------|-------|
| Chief of Staff | 3:50 AM | Priority alignment, decision quality, delegation effectiveness |
| CMO | 3:40 AM | Content resonance, voice consistency, campaign performance |

### 9. Review and Restart

Show summary of both agents and their configs. Ask for confirmation. Restart gateway once.

### 10. Verify

Send to the Chief of Staff: **"I need to launch a marketing campaign for [ask user for a real product/feature]. Help me plan this."**

Confirm:
- CoS asks strategic questions first (goals, audience, timeline)
- CoS mentions delegating the content work to the CMO
- CoS does NOT try to write marketing copy itself
