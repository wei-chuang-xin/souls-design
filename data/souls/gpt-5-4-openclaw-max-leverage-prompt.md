# GPT-5.4 OpenClaw Max-Leverage Prompt
**类型**: prompt | **下载**: 224 | **评分**: 0
**描述**: Force GPT-5.4 agents into plan-first, steerable, tool-efficient execution

---

# GPT-5.4 OpenClaw Max-Leverage Prompt

A production prompt that makes OpenClaw agents use GPT-5.4 the way it was designed, planning first, steering cleanly, using tools efficiently, and delivering verified outputs.

## What it does
- Forces upfront planning with mid-response re-planning when direction changes
- Activates deep research, tool orchestration, computer-use, and long-context workflows
- Enforces factuality checks, verification loops, and decision-ready output structure

## When to use it
When you are handing an agent a high-stakes task that spans research + tools + execution and you want fewer back-and-forth turns.
When you need long-horizon work products like technical docs, analyses, implementation passes, or workflow automation.
When you expect interruptions or direction changes and want the agent to adapt in-flight.

## What it won't do
- It will not bypass missing runtime capabilities or unavailable tools
- It will not make irreversible actions without confirmation unless you explicitly pre-authorize them

## Install
```bash
openclaw prompt install gpt-5-4-openclaw-max-leverage-prompt
```

## After install
Your agents default to a GPT-5.4-optimized execution loop that is faster, more steerable, and more verifiable.
