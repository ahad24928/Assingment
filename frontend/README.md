# Bulk Email Sender – Frontend Migration

## Project Overview

This project is a migration of the Bulk Email Sender application from a vanilla HTML/CSS/JavaScript frontend to a modern React + Vite frontend while preserving the existing Hono backend and API functionality.

The objective was to improve maintainability, component reusability, and user experience without modifying the backend business logic.

---

## Tech Stack

### Frontend
- React
- Vite
- JSX
- JavaScript (ES6+)
- React Router DOM
- Axios
- Bootstrap 
- CSS

### Backend
- Hono
- Bun
- TypeScript

### Database
- SQLite (existing project)

---

## Features

### Authentication
- User Registration
- User Login
- Session-based Authentication
- Protected Routes
- Logout

### Dashboard
- Dashboard Overview
- Statistics Cards
- Welcome Section

### SMTP Configuration
- Add SMTP Configuration
- Edit SMTP Configuration
- Delete SMTP Configuration
- Set Default SMTP
- Test SMTP Connection

### Email Sending
- Send Bulk Emails
- Upload Recipient List
- Email Preview

### Reports
- Email Reports
- Delivery Status
- Export Reports

---

## Frontend Improvements

- Migrated from Vanilla JavaScript to React
- Component-based Architecture
- Client-side Routing
- API Integration using Axios
- Responsive User Interface
- Improved User Experience
- Better Code Organization
- Reusable Components

---


## Backend Compatibility Updates

The backend was updated to support a modern React frontend while preserving existing business logic.

### Changes Made

- Removed the legacy static frontend (`public/` folder).
- Removed Bun static file serving routes.
- Configured CORS for the React + Vite development server.
- Preserved all existing Hono API endpoints.
- Replaced Bun-specific dependencies with Node.js-compatible alternatives where required.
- Verified backend functionality by testing authentication, SMTP configuration, reports, and email APIs using Postman.


## Project Structure

Frontend

```
frontend/
│
├── src/
│   ├── api/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
```

Backend

```
src/
├── middleware/
├── routes/
├── services/
├── types/
└── app.ts
```

---

## Installation

### Backend

```bash
npm install
npm run dev
```

Backend runs on

```
http://localhost:3000
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

## API Communication

The React frontend communicates with the existing Hono backend using Axios.

Example Flow

```
React UI
     │
     ▼
Axios Requests
     │
     ▼
Hono Backend
     │
     ▼
Database
```

---

## Tested APIs

- Health Check
- User Registration
- User Login
- User Logout
- User Information
- SMTP Configuration
- SMTP CRUD Operations
- SMTP Connection Test
- Dashboard APIs
- Reports APIs

---

## Environment Variables

Example

```
PORT=3000

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

FROM_EMAIL=
FROM_NAME=
```

---

## Notes

- Backend APIs were preserved.
- Existing backend functionality was not modified.
- Frontend was completely rebuilt using React + Vite.
- Authentication and SMTP configuration continue to work with the existing backend.

---

## Author

Abdul Ahad Khan














# React + Vite Frontend Migration Project

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
