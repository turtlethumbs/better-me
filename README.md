# better-me
Tasking Management with AI as an Accountability Coach

## App

This App allows the users to create and manage tasks.

1) CD into 'app' directory.
2) Install dependencies `npm install`
3) Copy `.env-example` to `.env`
4) In the .env file, fill in 'VUE_APP_API_BASE_URL' as http://localhost:3000 or Vercel API URL.
5) Run locally with `npm run serve`

## API

This API is consumed by the App.

1) CD into 'api' directory.
2) Install dependencies `npm install`
3) Copy `.env-example` to `.env`
4) In the .env file, fill in 'REDIS_URL' as the local or remote Redis Base URL.
5) In the .env file, fill in 'REDIS_TOKEN' as token / password used to authenticate to Redis.
6) In the .env file, fill in 'JWT_SECRET' as a strong JWT sercet.
7) In the .env file, fill in 'ADMIN_USERNAME' as a username of your choice.
8) In the .env file, fill in 'ADMIN_PASSWORD' as a password of your choice.
9) Run locally with `vercel dev`

Note: Username / Password used to login to the app.

## Coach

1) CD into 'coach' directory.
2) Make venv `python -m venv .venv`
3) Install dependencies `pip install`
4) Run with `python main.py`

Finished.