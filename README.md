# Vacation Manager

A simple Vacation Management app with **Requester** and **Validator** interfaces.

## Tech

- Frontend: Vue 3 + Vite + Vue Router + Axios
- Backend: Node.js + Express + Sequelize (MySQL)
- DB: MySQL 8+
- Tests: Jest + Supertest (backend)

## Quick Start

### MySQL

Create a database and user (example):

```sql
CREATE DATABASE vacation_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'vac_user'@'localhost' IDENTIFIED BY 'vac_pass';
GRANT ALL PRIVILEGES ON vacation_manager.* TO 'vac_user'@'localhost';
FLUSH PRIVILEGES;
```

### Backend

```bash
cd server
# then edit .env to match your local MySQL creds if needed
npm install
node seed.js   # creates tables & seeds users and demo requests
npm run dev    # starts API on http://localhost:3001
npm run test    # starts back-end tests with jest and on-run generated light DB
```

### Frontend

```bash
cd ../frontend
npm install
npm run dev    # http://localhost:5173
```

Open frontend in the browser. Use the profile switcher (top-right) to act as **Requester (Paul)** or **Validator (Bob)**.

## Test Accounts (seeded)

- **Paul Requester**: id=1, role=Requester
- **Bob Validator**: id=2, role=Validator

The app uses a lightweight header-based auth for demo purposes:

- The frontend sends `X-User-Id` with each request.

## Scripts

- `server/node seed.js` – sync DB & seed demo data
- `server/npm test` – run backend tests

## Notes

- The app was designed as a recruitment test project, but it implements real-world functionality with clean architecture,
  reusable UI components, and responsive design.
- Custom-built scenario for priviliged actions e.g. After choosing a user in a role of Validator, clicking Validator button,
  then switching back to previos user wont allow implement actions under current route

## Features

Requester Interface:

1. Submit vacation requests with start date, end date, and optional reason.
2. View a personal list of all requests with statuses (Pending, Approved, Rejected).
3. Delete a request (only if it is still Pending).

Validator Interface (Manager):

1.  Dashboard with all submitted requests.
2.  Filter requests by status (All, Pending, Approved, Rejected).
3.  Approve or Reject requests.
4.  Rejected requests can include a comment (reason for rejection).
5.  Search requests by reason or comment.
6.  Pagination with customizable items per page.
7.  Internationalization (i18n)

    - Multi-language support (English, French).
    - Easy to extend with more languages.

User Experience:

1. Light/Dark theme toggle (using CSS variables).
2. Responsive grid system with breakpoints for desktop, tablet, and mobile.
3. Tables become scrollable or card-like on mobile for better usability.

Reusable UI components:

1. UiInput (text/textarea with ghost mode for empty state).
2. UiSelect (styled select dropdown).
3. Toast system for success/error/info messages.
4. Confirm modal for delete actions.

Backend API:

RESTful endpoints for:

1.  Submitting new vacation requests.
2.  Fetching requests (per user or all requests).
3.  Approving / Rejecting requests with optional comments.
4.  Deleting pending requests.

Validation & overlap checks:

1. A vacation request cannot overlap with an already approved one.
2. Validator cannot approve overlapping requests.

Role enforcement:

1. Endpoints check the current user’s role (Requester vs Validator).

Application Logic:

1. Users are stored with role (Requester / Validator).
2. The app simulates authentication by storing userId in localStorage.

Navigation is role-aware:

1. If you are a Requester, only the Requester interface is accessible.
2. If you are a Validator, only the Validator dashboard is accessible.
3. If someone tries to navigate directly to the wrong route, they are redirected back to the main screen.

Under the Hood:

1. Frontend: Vue 3, Vue Router, Axios, SCSS modules, custom UI library.
2. Backend: Node.js + Express, Sequelize ORM (MySQL in dev/prod, SQLite for testing).

Database:

1. Users: (id, name, role)
2. VacationRequests: (id, user_id, start_date, end_date, reason, status, comments, created_at)
3. Testing: Jest with integration tests (using SQLite).
