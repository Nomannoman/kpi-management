# KPI Management App

A full-stack KPI tracking application built with Django DRF and React.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Django 5.2 + Django REST Framework + SimpleJWT |
| Frontend | React 19 + Vite + Bootstrap 5 + Recharts |
| Database | PostgreSQL |

---

## Prerequisites

Install these on the new PC before anything else:

- **Python 3.12+** — https://python.org
- **Node.js 18+** — https://nodejs.org
- **PostgreSQL** — https://postgresql.org

---

## Project Structure

```
wsp-kpi/
  backend/    # Django backend
  frontend/    # React frontend
  README.md
```

---

## 1. Set Up PostgreSQL

Open pgAdmin or psql and create the database:

```sql
CREATE DATABASE wsp_db;
```

The project expects these default credentials:

| Setting | Value |
|---|---|
| Database | wsp_db |
| User | postgres |
| Password | root |
| Host | localhost |
| Port | 5432 |

If your PostgreSQL installation uses a different password, update it in `backend/config/settings.py` under `DATABASES`.

---

## 2. Set Up the Backend

```bash
cd kpi/backend
```

**Create a virtual environment:**

```bash
python -m venv virtualenv
```

**Activate it:**

virtualenv\Scripts\activate


**Install dependencies:**

pip install -r requirements.txt


**Run migrations** (creates all tables in wsp_db):

python manage.py migrate

**Start the backend server:**

python manage.py runserver 0.0.0.0:8000


## 3. Set Up the Frontend

cd kpi/frontend

**Install dependencies:**

npm install

**Update the backend URL.**

Open `frontend/src/axios.js` and set `baseURL` to your machine's local IP:

const api = axios.create({
  baseURL: "http://<your-ip>:8000",
  ...
});


**Start the frontend:**

npm run dev

Vite will print:

➜  Local:   http://localhost:5173/

## 4. First Login

1. Open `http://localhost:5173` in a browser.
2. Click **Sign Up** and create your first account. It defaults to the `VIEWER` role.

---

## Roles

| Role | Permissions |
|---|---|
| VIEWER | View projects and KPIs, request role change |
| MANAGER | All VIEWER permissions + create projects |
| ADMIN | All permissions + manage users, approve/reject role requests |
