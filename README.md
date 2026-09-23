# GhastAi

Official web dashboard and portal for the GhastAI assistant system.

## Features
- Real-time command status and telemetry monitoring
- Interactive web portal for AI interaction
- Firebase Realtime Database integration for real-time synchronization

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Clone the repository and navigate to the directory:
   ```bash
   git clone https://github.com/NAITIK-builds/GhastAi.git
   cd GhastAi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Update `VITE_FIREBASE_DB_URL` with your Firebase Realtime Database URL.

4. Run development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```
