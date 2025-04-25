## 📬 Private‐Messaging & Notifications API

| # | Endpoint | HTTP Method | Description | Query params (examples) | Auth |
|---|----------|------------|-------------|-------------------------|------|
| 1 | `{{BASE_URL}}messages/` | **POST** | Send a private message | — | ✅ |
|   |   | **GET** | List *current* user’s messages | `?type=sent` — only messages you sent  <br>`?sender=<user_id>` — messages from a specific sender <br>`?is_read=false` — only unread messages | ✅ |
| 2 | `{{BASE_URL}}messages/unread-count/` | **GET** | Return `{"unread_count": N}` for the logged-in user | — | ✅ |
| 3 | `{{BASE_URL}}messages/mark-all-read/` | **POST** | Mark **all** of the user’s messages as read | — | ✅ |
| 4 | `{{BASE_URL}}user/notifications/` | **GET** | List notifications for current user | `?is_read=true` / `false` | ✅ |
| 5 | `{{BASE_URL}}user/notifications/<pk>/` | **PATCH** | Update one notification (e.g. `{"is_read": true}`) | — | ✅ |
