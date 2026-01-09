# 🕵️‍♂️ Spy Cats Dashboard (Frontend)

This project is a simple frontend dashboard for the **Spy Cat Agency (SCA)**, built as part of a full-stack engineer test assignment.

The application allows SCA agents to manage spy cats through a clean and minimal UI, communicating with the backend REST API.

---

## 🚀 Features

- View a list of all spy cats
- Add a new spy cat
- Update a spy cat’s salary
- Delete a spy cat
- Display backend validation errors per field
- Show success and error notifications

---

## 🛠 Tech Stack

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **TailwindCSS**
- Native `fetch` for API communication

---

## 📦 Prerequisites

- **Node.js** ≥ 18
- **npm** or **pnpm**
- Running backend service (`spy-cats-api`)

---

## ⚙️ Setup & Run

### 1️⃣ Install dependencies

```bash
npm install
```

## 2️⃣ Start the development server
```bash
npm run dev
```

## The application will be available at:
```bash
http://localhost:3000
```

## 🔗 Backend API
By default, the frontend expects the backend API to be running at:
```bash
http://127.0.0.1:8000
```

## The API base URL is defined in app/page.tsx:
```javascript
const API_URL = "http://127.0.0.1:8000";
```

# Make sure CORS is enabled on the backend.