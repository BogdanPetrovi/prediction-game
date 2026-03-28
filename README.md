# 🎮 Prediction Game

**Prediction Game** is a full-stack web application designed to automate and scale CS2 match predictions for gaming communities.

Originally managed manually via Discord for small groups (limited to ~20 participants), this platform was developed to allow unlimited number of users. By implementing automated match data synchronization the system now supports real-time matches and results tracking.

### ⚠️ Disclaimer: Non-Gambling Platform

This application is strictly **a point based community engagement tool**. It does not facilitate real-money wagering, betting or any form of gambling. It is designed solely for competitive fun and community interaction!

## 🚀 Key Features

- **Discord Integration:** Effortless authentication using Discord accounts for community consistency
- **Automated Match Syncing:** A dedicated background service ensures match schedules and results are always up to date without manual entry
- **Interactive Predictions:** Users can submit predictions for upcoming professional CS2 matches
- **Dynamic Leaderboards:** Real-time rankings based on prediction accuracy for the current tournament
- **Historical Archive:** Access to standings and results from previous tournaments
- **User Dashboard:** A personalized view of recent performance and predictions history

## 🛠 Tech stack

### Frontend

- **Framework:** Next.js
- **State Management:** TanStack Query
- **Styling:** Tailwind CSS

### Backend

- **Runtime:** Node.js (Express.js)
- **Database:** PostgreSQL (Raw SQL)
- **Caching & Sessions:** Redis
- **Validation:** Zod
- **Data Ingestion:** Custom-built synchronization service

## ⚙️ Setup & Installation

### 1. Database Initialization

Ensure PostgreSQL is running.

```
psql -U your_username -d your_database -f server/src/database/db.sql
```

### 2. Backend Setup

Navigate to the server folder and create a `.env` file with the following variables:

```
PORT=5000
FRONTEND_URL=http://localhost:3000
PGUSER=your_user
PGHOST=localhost
PGPASSWORD=your_password
PGDATABASE=predictions
PGPORT=5432
SESSION_SECRET=your_secret
DISCORD_CLIENT_ID=your_id
DISCORD_SECRET=your_secret
DISCORD_CALLBACK_URL=/auth/discord/callback
```

Run the server:

```
cd server
npm install
npm run dev
```

### 3. Frontend Setup

Navigate to the client folder and create `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Run the frontend:

```
cd client
npm install
npm run dev
```

## 🗺️ Roadmap

- **Push notifications:** Alert users before a match starts so they don't miss their predictions
- **Public profiles:** Explore the prediction history and success rates of other players

## 📄 License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.
