
---

### Файл A.5: `docs/SOCIAL_COMMUNITY_MANAGEMENT.md`

```markdown
# 👥 Руководство по управлению сообществами

> **Протоколы**: SUMKA-2607-001, SAN-2607-001
> **Версия**: 1.0 | **Дата**: 01.08.2026

---

## 1. Добавление группы

### Через админ-панель
1. Перейти в `/admin/social/communities`
2. Нажать «Добавить сообщество»
3. Заполнить:
   - Платформа (VK/Telegram/OK/Facebook)
   - ID группы
   - Название
   - Тематики (smallint[])
   - Флаг `is_owned`

### Через ИИ-агента `seo_outreach`
1. Агент сканирует соцсети
2. Формирует предложения в `social_community_suggestions`
3. Администратор утверждает вручную (Этап 0)

---

## 2. Удаление группы

1. Перейти в `/admin/social/communities`
2. Найти группу
3. Нажать «Деактивировать»

---

## 3. Ручная пауза

```sql
UPDATE social_communities
SET paused_until = NOW() + INTERVAL '60 days'
WHERE id = '...';

4. Работа с логами
Просмотр публикаций

SELECT * FROM social_posts_log
WHERE community_id = '...'
ORDER BY published_at DESC
LIMIT 100;

Анализ ошибок

SELECT error_message, COUNT(*)
FROM social_posts_log
WHERE status = 2
GROUP BY error_message;

5. Утверждение предложений ИИ
Перейти в /admin/social/suggestions
Просмотреть предложения
Оценить relevance_score
Утвердить или отклонить
Связанные документы:
СУМКа v1.5 п. 12.2
Манифест САН V21.4 п. 11.29
