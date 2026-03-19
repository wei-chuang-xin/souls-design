# Context Manager
**类型**: skill | **下载**: 509 | **评分**: 4
**描述**: Prevents silent context overflow - monitors, warns, and executes clean handoffs

---

# Context Manager

> **Version:** 1.0.0 | [Changelog](../CHANGELOG.md)

Prevents the #1 cause of agent quality degradation: silent context overflow.

## The Problem

Every AI agent has a context window. When a conversation gets long enough, the middle of the history gets silently dropped. The agent doesn't know what it forgot. It starts contradicting itself, losing track of tasks, and making decisions based on incomplete information.

Most users don't know this is happening until they notice the agent "getting dumber" in long sessions.

## What This Skill Does

- Monitors context usage after every 10+ exchanges
- Warns the user at 80% capacity
- At 90%, executes a clean handoff: saves all state to files, tells the user to start fresh
- On new session, picks up exactly where it left off

## Install

Copy `context-manager/` into your agent's `skills/` directory. No configuration needed.

## Works With

Any OpenClaw agent. No dependencies on other skills or specific soul configurations.

## Version

v1.0.0 (2026-03-04)
