---
title: "Setting Up SeekAPI in 30 Seconds"
date: "2026-03-21T12:00:00Z"
lang: "en"
description: "Minimal OpenAI-compatible integration checklist: key, base URL, model string, and a one-line health check."
slug: "setting-up-seekapi-in-30-seconds"
---

## 1. Create or rotate an API key

Issue a key in the SeekAPI dashboard and store it in your secret manager—never commit keys to source control.

## 2. Point the SDK at the gateway

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_SEEKAPI_KEY",
    base_url="https://api.seekapi.ai/v1",
)
```

## 3. Send a smoke test

Call `chat.completions.create` with a tiny prompt. If you receive `200` and a completion id, routing and authentication are correct.
