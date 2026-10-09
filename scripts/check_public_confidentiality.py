#!/usr/bin/env python3
"""Fail closed when internal governance material enters the public repository."""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SELF = Path(__file__).resolve()
TEXT_SUFFIXES = {
    ".cjs", ".css", ".html", ".js", ".json", ".jsx", ".md", ".mjs",
    ".py", ".sh", ".toml", ".ts", ".tsx", ".txt", ".yaml", ".yml",
}
PRIVATE_REPO = "aion" + "-governance"
PRIVATE_REVIEWER = "Gem" + "AION"
PATTERNS = [
    ("private governance repository", re.compile(rf"(?:github\.com/[^/]+/)?{re.escape(PRIVATE_REPO)}", re.I)),
    ("internal reviewer identity", re.compile(re.escape(PRIVATE_REVIEWER), re.I)),
    ("internal authority role", re.compile(r"\bMonarch\b", re.I)),
    ("internal issue-comment receipt", re.compile(r"issuecomment-[0-9]+", re.I)),
    ("internal owner gate", re.compile(r"\bowner[- ](?:gate|decision|authorization|acceptance)\b", re.I)),
    ("internal review receipt", re.compile(r"\breview (?:id|session)\b", re.I)),
    ("internal authorization field", re.compile(r"\bauthorizationRef\b")),
    ("internal runbook", re.compile(r"\brunbook\b", re.I)),
]
PATH_PATTERN = re.compile(r"(?:^|/)(?:[^/]*runbook|legal-[^/]*approval|[^/]*approval-packet)(?:\.|/|$)", re.I)


def tracked_files() -> list[Path]:
    output = subprocess.check_output(["git", "ls-files", "-z"], cwd=ROOT)
    return [ROOT / item.decode() for item in output.split(b"\0") if item]


def inspect(label: str, text: str, failures: list[str]) -> None:
    for description, pattern in PATTERNS:
        match = pattern.search(text)
        if match:
            line = text.count("\n", 0, match.start()) + 1
            failures.append(f"{label}:{line}: {description}")


def event_text() -> str:
    event_path = os.environ.get("GITHUB_EVENT_PATH")
    if not event_path:
        return ""
    try:
        event = json.loads(Path(event_path).read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return ""
    values: list[str] = []
    for key in ("pull_request", "issue", "comment"):
        item = event.get(key)
        if isinstance(item, dict):
            for field in ("title", "body"):
                value = item.get(field)
                if isinstance(value, str):
                    values.append(value)
    return "\n".join(values)


def main() -> int:
    failures: list[str] = []
    for path in tracked_files():
        relative = path.relative_to(ROOT).as_posix()
        if path == SELF:
            continue
        if PATH_PATTERN.search(relative):
            failures.append(f"{relative}: internal-only filename")
        if path.suffix.lower() not in TEXT_SUFFIXES or not path.is_file() or path.stat().st_size > 2_000_000:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        inspect(relative, text, failures)
    inspect("event-metadata", event_text(), failures)
    if failures:
        print("Public confidentiality guard failed:", file=sys.stderr)
        for failure in sorted(set(failures)):
            print(f"- {failure}", file=sys.stderr)
        return 1
    print("Public confidentiality guard passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
