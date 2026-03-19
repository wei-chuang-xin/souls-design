# Proposal Maker
**类型**: skill | **下载**: 126 | **评分**: 0
**描述**: Turn client meetings into deployed proposal websites

---

# Proposal Maker

Generate premium, deployed proposal websites for client engagements. The deployed site serves as both the proposal and proof of capability.

Includes a bundled **frontend-design** skill that elevates every proposal's visual quality with interaction patterns, typography systems, and design philosophy.

## What It Does

Takes client context (meeting notes, a brief, or just a name and idea), runs market research and competitive analysis, derives visual direction from the client's brand, builds a responsive single-page proposal site, deploys it, and iterates based on feedback.

**3-tier deployment:** gui.new for instant zero-config previews, Vercel/Netlify for production, or HTML file delivery as fallback.

## Install

Copy the `proposal-maker-skill` folder into your agent's workspace skills directory:

```bash
cp -r proposal-maker-skill ~/.openclaw/workspace-{your-agent-id}/skills/
```

Add the skill to your agent's config in `openclaw.json`:

```json
{
  "agents": {
    "{your-agent-id}": {
      "skills": [
        "proposal-maker-skill"
      ]
    }
  }
}
```

Restart OpenClaw.

## Requirements

- `web_search` and `web_fetch` tools (required)
- Browser tool for screenshots (recommended)
- No deployment accounts needed (gui.new works with zero config)

## What's Inside

```
proposal-maker-skill/
├── SKILL.md                          # Core workflow
├── frontend-design/
│   └── SKILL.md                      # Visual design system (bundled)
└── references/
    ├── context-schema.md             # Client context template
    ├── pricing-framework.md          # Research-driven pricing
    ├── page-structure.md             # Section ordering and guidance
    ├── industry-styles.md            # Visual direction starting points
    ├── iteration-guide.md            # Round-by-round refinement
    ├── multi-stakeholder.md          # Multi-decision-maker proposals
    └── error-handling.md             # Common problems and fixes
```

## Try It

Tell your agent: "Make a proposal for [client name] - they need [what you're offering]."

The agent will ask for any missing context, research the market, and build the site.
