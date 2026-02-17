# TaskFlow - MERN Task Management Application

A full-stack task management application built with the MERN stack (MongoDB, Express.js, React, Node.js) with JWT authentication.

## 🚀 Live Demo

**Deployed Application:** [https://taskflow-ten-lime.vercel.app/](https://taskflow-ten-lime.vercel.app/)

- **Frontend:** Deployed on Vercel
- **Backend:** Deployed on Vercel (Serverless Functions)
- **Database:** MongoDB Atlas

## Features

✅ **User Authentication**
- User registration with email validation
- Login with JWT token-based authentication
- Password hashing with bcrypt
- Protected routes

✅ **Task Management**
- Create, read, update, and delete tasks
- Filter tasks by status (To Do, In Progress, Done)
- Filter tasks by priority (Low, Medium, High)
- Search tasks by title and description
- Real-time task statistics

✅ **User Profile**
- View user profile information
- Update profile details
- Display task statistics (Total, To Do, In Progress, Done)

✅ **Responsive Design**
- Clean, modern UI with TailwindCSS
- Blue theme matching the original design
- Mobile-friendly interface

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

### Frontend
- **React** - JavaScript library
- **Vite** - Build tool
- **TailwindCSS** - Utility-first CSS framework
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Lucide React** - Icons

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd App
```

2. **Setup Backend**
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
NODE_ENV=development
```

3. **Setup Frontend**
```bash
cd frontend
npm install
```

### Running the Application

1. **Start MongoDB** (if using local MongoDB)
```bash
mongod
```

2. **Start Backend Server**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

3. **Start Frontend Development Server**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

4. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Tasks (Protected)
- `GET /api/tasks` - Get all user tasks (with filters)
- `GET /api/tasks/stats` - Get task statistics
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Profile (Protected)
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

## Project Structure

```
App/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   └── profile.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx
    │   │   └── TaskModal.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Dashboard.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── postcss.config.cjs
    ├── tailwind.config.js
    └── vite.config.js
```

## Default Users

No default users. Register a new account to get started.

## Deployment

This application is deployed on Vercel:
- **Frontend**: [https://taskflow-ten-lime.vercel.app/](https://taskflow-ten-lime.vercel.app/)
- **Backend**: https://task-flow-backend-psi.vercel.app/
- **Database**: MongoDB Atlas

### Deployment Architecture
- Frontend and backend are deployed as separate Vercel projects
- Backend uses the `/api` folder structure for serverless functions
- Environment variables configured in Vercel dashboard
- Automatic deployments on git push

## License

MIT

## Author

Built with ❤️ using the MERN stack
