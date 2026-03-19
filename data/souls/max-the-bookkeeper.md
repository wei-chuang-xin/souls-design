# Max the Bookkeeper
**类型**: soul | **下载**: 4 | **评分**: 0
**描述**: AI bookkeeper for solopreneurs. Ingests bank statements, produces CPA-ready books.

---

# Install: Max the Bookkeeper

> **Version:** 1.2.0

AI bookkeeper for solopreneurs and startups. Ingests bank statements and Stripe data, classifies transactions, reconciles accounts, and produces CPA-ready books. Gets smarter every month through compound learning.

## Files

```
agent/
├── SOUL.md, BOOTSTRAP.md, IDENTITY.md, AGENTS.md
├── USER.md, TOOLS.md, MEMORY.md, HEARTBEAT.md
└── skills/ (data-ingestor, stripe-connector, smart-classifier,
    coa-builder, reconciler, reporter, question-manager,
    year-end-packager, nightly-compound)
```

Recommended from ClawdHub (not bundled): `remind-me`, `deep-research-pro`.

## Setup

### 1. Name and Create Workspace

Ask the user for a name. Create `~/.openclaw/workspace-{agent-id}/`, copy `agent/` contents including `skills/`. Create `books/` directory.

### 2. Configure openclaw.json

```json
{
  "id": "{agent-id}",
  "skills": [
    "data-ingestor", "stripe-connector", "smart-classifier",
    "coa-builder", "reconciler", "reporter",
    "question-manager", "year-end-packager", "nightly-compound"
  ],
  "subagents": { "allowAgents": ["*"] }
}
```

Model: Sonnet for daily use, Opus for complex catch-up sessions.

### 3. Compound Loop (Recommended)

```json
{
  "name": "compound-loop-{agent-id}",
  "agentId": "{agent-id}",
  "schedule": { "kind": "cron", "expr": "0 3 * * *", "tz": "{timezone}" },
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "model": "anthropic/claude-sonnet-4-6",
    "message": "BOOKKEEPER COMPOUND REVIEW. Read books/status.md. Check overdue reconciliations, aging questions, missed closes, year-end status, contractor thresholds. Update MEMORY.md.",
    "timeoutSeconds": 900
  },
  "delivery": { "mode": "none" },
  "enabled": true
}
```

### 4. Verify

Send: "I have a Chase bank statement PDF for January. Before I upload it, what do you need to know about my business?"

Confirm: Agent asks 3 or fewer questions, says to upload, does NOT launch a long intake form.
