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

## AI Coach

### Prerequisites

Install Ollama and use inference model as llama3.2

1) CD into 'coach' directory.
2) Make venv `python -m venv .venv`
3) Install dependencies `pip install`
4) In the .env file, fill in 'OLLAMA_API_URL' as the localhost ollama API host url + port number.
5) In the .env file, fill in 'REDIS_URL' as the local or remote Redis Base URL.
6) In the .env file, fill in 'REDIS_TOKEN' as token / password used to authenticate to Redis.
7) Run with `python main.py`

Deploy Docker Locally

1) `docker build -t ollama-service .`
2) `docker run -p 11434:11434 ollama-service`

Finished.