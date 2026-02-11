# University Conference Management Portal (CMP)

A high-performance, modern MERN stack application designed for university conferences. Features a premium UI, role-based access control, and dual-layer security verification.

## 🚀 Key Features

- **Premium UI**: Modern, responsive design with gradient animations and glassmorphism.
- **Dual Verification**: Mandatory Email + Mobile verification for all new accounts.
- **Secure Authentication**: JWT-based session management.
- **Admin Dashboard**: Comprehensive control for chairs and system admins.
- **Auto-Verification**: Real-time code validation (no click required).
- **Auto-Documentation**: Built with collaboration in mind.

## 📁 Project Structure

```text
CMP/
├── server/             # Backend (Node.js + Express + MongoDB)
│   ├── models/         # Database Schemas
│   ├── routes/         # API Endpoints
│   ├── utils/          # Helpers (Email, etc.)
│   └── seedAdmin.js    # Script to setup initial admin
└── client/             # Frontend (React + Vite + Tailwind)
    ├── src/
    │   ├── pages/      # Route Components (Login, Register, Dashboard)
    │   └── components/ # Reusable UI Elements
```

## 🛠️ Installation & Setup

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env  # Configure your MONGODB_URI and JWT_SECRET
npm run dev
```

**Seed Admin Account:**
After setting up `.env`, run:
```bash
npm run admin
```

### 3. Frontend Setup
```bash
cd client
npm install
cp .env.example .env  # Configure VITE_API_URL
npm run dev
```

## 📧 Verification System (Development)
In development mode, if SMTP credentials are not provided:
- **Email Code**: Logged to the **Server Terminal**.
- **Mobile Code**: Shown as a browser **Alert** on signup and logged to console.

---

## 👨‍💻 Contributing
1. Create a feature branch: `git checkout -b feature/cool-new-feature`
2. Commit changes: `git commit -m 'Add some feature'`
3. Push to branch: `git push origin feature/cool-new-feature`
4. Open a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
