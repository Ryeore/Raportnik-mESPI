# REST API

Base: `/api/v1`. Auth: Bearer JWT.

## Auth
- `POST /auth/register` — email+hasło
- `POST /auth/login` — zwraca access+refresh
- `POST /auth/google`, `POST /auth/apple` — id_token
- `POST /auth/refresh`

## Companies
- `GET /companies?query=&sort=name` — wyszukiwarka
- `POST /watchlist/{companyId}` — obserwuj
- `DELETE /watchlist/{companyId}` — przestań obserwować
- `GET /watchlist`

## Reports (feed)
- `GET /reports?watchedOnly=&type=ESPI|EBI&from=&to=&q=&cursor=&size=20` — infinite scroll
- `GET /reports/{id}`
- `POST /reports/{id}/read`
- `GET /reports/read` — historia

## Profile / Notifications
- `GET /me`
- `PUT /me/notifications` — `{ mode: IMMEDIATE|DAILY, fcmToken, keywords:[] }`
