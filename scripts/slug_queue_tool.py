#!/usr/bin/env python3
"""Валидация и пересчёт статистики docs/SLUG_OPTIMIZATION_QUEUE.json.

Режимы:
  python scripts/slug_queue_tool.py        # линт: exit 1 при нарушениях
  python scripts/slug_queue_tool.py --fix  # пересчитать statistics и перезаписать файл
"""
import json
import sys
from collections import Counter
from datetime import datetime, timezone

PATH = "docs/SLUG_OPTIMIZATION_QUEUE.json"
DOMAINS_PATH = "config/verification.json"
ALLOWED_STATUS = {"pending", "optimized", "failed"}
ALLOWED_PRIORITY = {"critical", "high", "medium", "low"}


def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def words(slug):
    return [w for w in str(slug).split("-") if w]


def compute_stats(data):
    c = Counter(i["status"] for i in data["queue"])
    st = data["statistics"]
    return {
        "scope_total": st["scope_total"],
        "optimized_total": st["optimized_total"],
        "failed_total": st["failed_total"],
        "remaining": st["scope_total"] - st["optimized_total"] - st["failed_total"],
        "queue": {
            "total": len(data["queue"]),
            "pending": c.get("pending", 0),
            "optimized": c.get("optimized", 0),
            "failed": c.get("failed", 0),
        },
        "semantics": st.get("semantics", ""),
    }


def lint(data):
    errors = []
    rules = data["optimization_rules"]
    forbidden = set(rules["forbidden_words"])
    domains = set(load(DOMAINS_PATH)["domains"])

    for item in data["queue"]:
        iid = item.get("id", "?")
        for field in ("id", "site_id", "original_slug", "optimized_slug", "status", "priority", "created_at"):
            if field not in item:
                errors.append(f"{iid}: нет поля {field}")
        if item.get("site_id") not in domains:
            errors.append(f"{iid}: site_id '{item.get('site_id')}' отсутствует в матрице доменов")
        if item.get("status") not in ALLOWED_STATUS:
            errors.append(f"{iid}: недопустимый status '{item.get('status')}'")
        if item.get("priority") not in ALLOWED_PRIORITY:
            errors.append(f"{iid}: недопустимый priority '{item.get('priority')}'")
        opt = words(item.get("optimized_slug", ""))
        if not (rules["min_words"] <= len(opt) <= rules["max_words"]):
            errors.append(f"{iid}: в optimized_slug {len(opt)} слов (допустимо {rules['min_words']}–{rules['max_words']})")
        bad = forbidden & set(opt)
        if bad:
            errors.append(f"{iid}: запретные слова в optimized_slug: {sorted(bad)}")

    expected = compute_stats(data)
    actual = data["statistics"]
    if actual.get("remaining") != expected["remaining"]:
        errors.append(f"statistics.remaining: в файле {actual.get('remaining')}, должно быть {expected['remaining']}")
    for key in ("total", "pending", "optimized", "failed"):
        if actual.get("queue", {}).get(key) != expected["queue"][key]:
            errors.append(f"statistics.queue.{key}: в файле {actual.get('queue', {}).get(key)}, должно быть {expected['queue'][key]}")
    return errors


def main():
    fix = "--fix" in sys.argv
    data = load(PATH)
    errors = lint(data)

    if fix:
        data["statistics"] = compute_stats(data)
        data["updated"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        with open(PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write("\n")
        # после пересчёта статистики структурные ошибки всё равно валим
        errors = [e for e in lint(data) if not e.startswith("statistics")]
        print("✅ Статистика пересчитана")

    if errors:
        for e in errors:
            print("❌", e)
        sys.exit(1)
    print("✅ Очередь слаго валидна")


if __name__ == "__main__":
    main()
