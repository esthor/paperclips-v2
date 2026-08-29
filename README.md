# Paperclip game expansion

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/esthor-team/v0-paperclip-game-expansion)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/TczCO9rqKed)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/esthor-team/v0-paperclip-game-expansion](https://vercel.com/esthor-team/v0-paperclip-game-expansion)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/TczCO9rqKed](https://v0.app/chat/projects/TczCO9rqKed)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Development checks

Install the committed dependencies with `pnpm install --frozen-lockfile`.
When running inside another pnpm workspace, add `--ignore-workspace` to keep
this game's dependencies isolated.

Run `pnpm typecheck`, `pnpm test`, and `pnpm build` before proposing a change.
The focused tests cover resource/capability costs, partial crisis effects,
alien benefits, and optional crisis thresholds. They do not establish game
balance or completion of every phase. The production build also checks types;
the existing lint configuration remains separate.
