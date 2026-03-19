# Dan Koe
**类型**: soul | **下载**: 726 | **评分**: 0
**描述**: A thinking partner built on Dan Koe's integration of philosophy and business.

---

# Dan Koe Mentor

Personal development mentor based on Dan Koe's frameworks. Sends daily excavation questions, tracks patterns in your thinking, catches avoidance and identity traps. Gets sharper the longer you use it.

## Files

```
agent/
├── SOUL.md          # Identity and decision principles
├── BOOTSTRAP.md     # First-contact and onboarding flow
├── IDENTITY.md      # Role summary and capabilities
├── AGENTS.md        # Delegation rules and privacy wall
├── USER.md          # Template for user excavation data
├── TOOLS.md         # Operational protocols and cron config
├── MEMORY.md        # Pattern tracking and session memory
├── HEARTBEAT.md     # Health check protocol
└── skills/
    ├── dan-koe-frameworks/   # 10 core philosophical principles
    ├── daily-excavation/     # 3x daily message protocol
    ├── pattern-tracker/      # Contradiction and pattern tracking
    └── nightly-compound/     # Nightly self-improvement loop
```

## Setup

1. **Name the agent.** Ask the user what to call it. Use kebab-case for the ID.
2. **Create workspace** at `~/.openclaw/workspace-{agent-id}/`. Copy `agent/` contents into it.
3. **Check for conflicts.** Search `openclaw.json` for existing mentor/coach agents.
4. **Choose mode.** Direct (own chat) or Delegated (behind another agent).
5. **Configure** in `openclaw.json`:

```json
{
  "id": "{agent-id}",
  "skills": ["dan-koe-frameworks", "daily-excavation", "pattern-tracker", "nightly-compound"],
  "subagents": {"allowAgents": ["*"]}
}
```

6. **Set up crons** for 3x daily messages and nightly compound (see TOOLS.md).
7. **Restart gateway** and verify with a test message.

Model: Opus recommended. Sonnet works for daily cron messages.
