# 🎯 Руководство по распределению лидов

> **Протокол**: SAN-2607-001
> **Версия**: 1.0 | **Дата**: 01.08.2026

---

## 1. Назначение

Автоматическое распределение клиентских запросов на парсерные объекты с учётом географии, рейтинга и нагрузки.

---

## 2. Таблица нераспределённых лидов

```sql
CREATE TABLE pending_leads (
  id uuid PRIMARY KEY,
  property_id uuid REFERENCES properties(id),
  status smallint DEFAULT 1,  -- 1=Pending, 2=Offering, 3=Accepted
  offered_to_agent_ids uuid[],
  current_batch integer DEFAULT 1,
  accepted_by_agent_id uuid
);
