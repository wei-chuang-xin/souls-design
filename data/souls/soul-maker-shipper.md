# Soul Maker + Shipper
**类型**: skill | **下载**: 2 | **评分**: 0
**描述**: Create agent souls that produce judgment, not compliance. Then ship them.

---

# Soul Maker + Soul Shipper Bundle

> **Version:** 1.1.0 | [Changelog](../CHANGELOG.md)

Create agent souls that produce judgment, not compliance. Then package them for distribution.

**Price:** $19

## What's Inside

### Soul Maker

The complete soul creation framework. Not a template generator. An extraction methodology that produces agents with real decision-making fingerprints.

**The process:**
1. Gather responsibilities (the skeleton)
2. Extraction interview (the decision-making fingerprint)
3. Define beliefs as lived experience (not rules to follow)
4. Build the 6-section soul (Core Identity, Decision Principles, Quality Signature, Anti-Patterns, Operating Awareness, Hard Rules)
5. Add anti-patterns specific enough to block generic output
6. Wire the metacognitive insert (the compound loop that prevents quality drift)
7. Wire up teams (8 delegation patterns, team AGENTS.md, spawn templates, model tiering)

**Includes reference files:**
- `soul-template.md` - The 6-section architecture with field-by-field guidance
- `texture-patterns.md` - 12 texture techniques that make souls feel lived-in
- `extraction-questions.md` - Question bank organized by domain
- `metacognitive-insert.md` - The universal compound loop insert

**Key insight:** A mediocre skill with a great soul outperforms a great skill with no soul. The soul resolves ambiguity the same way the skill's author would have.

### Soul Shipper

Takes a working agent and packages it for distribution. Sanitizes personal data, bundles skills, generates install instructions, produces a ready-to-ship zip.

**The process:**
1. Inventory source workspace
2. Copy and sanitize (scrub personal data, org references, credentials)
3. Bundle skills with the agent
4. Generate README with install config
5. Quality gate (7-point checklist)
6. Zip and deliver

**Includes reference files:**
- `readme-template.md` - Install guide template with config snippet structure
- `bootstrap-template.md` - Onboarding template for new users
- `agents-template.md` - Team delegation template

## Install

### 1. Copy into your agent's workspace

```bash
cp -r soul-maker/ ~/.openclaw/workspace-{agent-id}/skills/soul-maker/
cp -r soul-shipper/ ~/.openclaw/workspace-{agent-id}/skills/soul-shipper/
```

Skills must live inside the agent's workspace. Do not copy to a global skills directory.

### 2. Add to your agent config

In `openclaw.json`, add both skills to that agent's skills list:

```json
{
  "id": "{agent-id}",
  "skills": [
    "soul-maker",
    "soul-shipper"
  ]
}
```

### 3. Restart Your Agent

Restart your agent's session so it picks up the newly installed skills. If running OpenClaw as a gateway service:

```bash
openclaw gateway restart
```

Or close and reopen the agent's chat session.

### 4. Verify

Ask your agent: "I want to create a new agent for [role]. Walk me through it."

The agent should:
- Start with the extraction interview (not jump to writing a soul)
- Ask about decision-making patterns, not just responsibilities
- Produce a soul with beliefs encoded as experience
- Include delegation boundaries and anti-patterns

Then ask: "Package this agent for distribution."

The agent should:
- Inventory the workspace files
- Sanitize personal data
- Generate a README with install config
- Produce a zip

## What Makes This Different

Most "agent creator" tools generate templates. Fill in name, role, done. That produces compliance, not judgment.

This skill extracts the decision-making fingerprint: what does this role check first? What shortcuts does an expert take that a junior wouldn't dare? What trade-offs get made automatically?

The answers become beliefs encoded as lived experience. Not rules to follow.

The difference shows up in ambiguous situations. A template agent asks for clarification. A soul-built agent makes the call the same way the role's expert would, then explains why.

## File Inventory

```
soul-maker-bundle/
├── README.md                                  # This file
├── soul-maker/
│   ├── SKILL.md                              # Creation methodology
│   └── references/
│       ├── soul-template.md                  # 6-section architecture
│       ├── texture-patterns.md               # 12 texture techniques
│       ├── extraction-questions.md           # Domain question bank
│       └── metacognitive-insert.md           # Compound loop insert
└── soul-shipper/
    ├── SKILL.md                              # Packaging pipeline
    └── references/
        ├── readme-template.md                # Install guide template
        ├── bootstrap-template.md             # Onboarding template
        ├── agents-template.md                # Delegation template
        ├── image-generation.md               # PFP generation system (400 lines)
        └── images/
            ├── reference-base-bear.jpg       # Base bear reference
            ├── reference-single-agents.jpg   # Single agent style reference
            ├── reference-team-duo.jpg        # Team duo layout reference
            └── reference-team-group.jpg      # Team group layout reference
```

15 files total. Everything you need to create souls and ship them.
