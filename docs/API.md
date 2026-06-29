# REST API

Base: `/api/v1`. Auth: Bearer JWT.

## Auth
- `POST /auth/register` — email+password
- `POST /auth/login` — returns access+refresh
- `POST /auth/google`, `POST /auth/apple` — id_token
- `POST /auth/refresh`

## Companies
- `GET /companies?query=&sort=name` — search
- `POST /watchlist/{companyId}` — follow
- `DELETE /watchlist/{companyId}` — unfollow
- `GET /watchlist`

## Reports (feed)
- `GET /reports?watchedOnly=&type=ESPI|EBI&from=&to=&q=&cursor=&size=20` — infinite scroll
- `GET /reports/{id}`
- `POST /reports/{id}/read`
- `GET /reports/read` — history

## Profile / Notifications
- `GET /me`
- `PUT /me/notifications` — `{ mode: IMMEDIATE|DAILY, fcmToken, keywords:[] }`
