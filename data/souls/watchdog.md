# Watchdog
**类型**: soul | **下载**: 604 | **评分**: 0
**描述**: Security guard dog for your OpenClaw agent system. Patrols your infrastructure.

---

# Watchdog

> **Version:** 1.2.0

Security agent that runs daily patrols, scans for exposed secrets, audits file permissions, and reports only when something needs attention. Silent when clean, loud when not.

## Files

```
agent/
├── SOUL.md
├── BOOTSTRAP.md
├── IDENTITY.md
├── AGENTS.md
├── USER.md
├── TOOLS.md
├── MEMORY.md
├── HEARTBEAT.md
└── skills/
    ├── security-audit/
    ├── permission-sweep/
    ├── secret-scanner/
    └── nightly-compound/
```

## Setup

**New agent.** Create workspace, configure, verify.

### 1. Name

Ask: **"What would you like to name this security agent?"** Use answer as agent ID (kebab-case). Workspace: `~/.openclaw/workspace-{agent-id}/`

### 2. Conflict Check

Read `openclaw.json`. If an agent with security/watchdog/audit role exists, ask: **replace**, **keep both**, or **cancel**.

### 3. Mode

Ask: **"Own chat (Direct) or behind an existing agent (Delegated)?"**

Direct: ask platform, create bot if needed. Delegated: ask which parent agent.

### 4. Create Workspace

Create `~/.openclaw/workspace-{agent-id}/`, copy `agent/` contents including `skills/`.

### 5. Configure

Add to `agents.list` in `openclaw.json`:

```json
{
  "id": "{agent-id}",
  "skills": ["security-audit", "permission-sweep", "secret-scanner", "nightly-compound"],
  "subagents": { "allowAgents": ["*"] }
}
```

Recommended model: **Sonnet**.

If Delegated: add agent ID to parent's `subagents.allowAgents`.

### 6. Cron Setup

Ask user's timezone. Add three crons:

**Daily patrol** (6 AM):
```json
{
  "name": "watchdog-patrol-{agent-id}", "agentId": "{agent-id}",
  "schedule": { "kind": "cron", "expr": "0 6 * * *", "tz": "{tz}" },
  "sessionTarget": "isolated",
  "payload": { "kind": "agentTurn", "model": "anthropic/claude-sonnet-4-6",
    "message": "DAILY PATROL. Run full security audit. Include permission sweep. Deliver report in chat.",
    "timeoutSeconds": 900 },
  "delivery": { "mode": "none" }, "enabled": true
}
```

**Weekly deep scan** (Monday 5 AM):
```json
{
  "name": "watchdog-deep-scan-{agent-id}", "agentId": "{agent-id}",
  "schedule": { "kind": "cron", "expr": "0 5 * * 1", "tz": "{tz}" },
  "sessionTarget": "isolated",
  "payload": { "kind": "agentTurn", "model": "anthropic/claude-sonnet-4-6",
    "message": "WEEKLY DEEP SCAN. Run secret-scanner across all workspaces and configs. Report findings with severity levels.",
    "timeoutSeconds": 900 },
  "delivery": { "mode": "none" }, "enabled": true
}
```

**Nightly compound** (staggered): See `skills/nightly-compound/SKILL.md` for cron config.

### 7. Heartbeat

Add to agent config:
```json
{ "heartbeat": { "prompt": "HEARTBEAT CHECK: Have all scheduled patrols run in the last 24 hours? Any unresolved CRITICAL findings?" } }
```

### 8. Verify

Restart gateway. Send: **"Run a quick security check on my system."** Confirm it scans for real issues, not generic advice.
