# Student Course Management Portal

A full-stack MERN (MongoDB, Express, React, Node.js) application tailored for universities or course administrators to manage students, curriculum, and enrollments.

## Features

- **Authentication & Authorization**: Secure JWT-based login and signup with bcrypt password hashing.
- **Role-Based Access**: Separation of concern for `student` and `admin` roles.
  - **Admin**: Has global control over courses (Create, Edit, Delete) and can assign courses to specific students.
  - **Student**: Has a personalized dashboard reflecting enrolled credits and the ability to discover and enroll in new courses.
- **Modern User Interface**: Built with React and Tailwind CSS for a premium, responsive, and accessible experience.

## Getting Started Locally

### Prerequisites
- Node.js
- MongoDB (running locally or a MongoDB Atlas URI)

### Installation
1. Clone or download the repository.
2. Ensure you are in the root directory (`student-management-portal`).
3. Install dependencies across the root, backend, and frontend concurrently:
   ```bash
   npm run install-all
   ```

### Configuration
Create a `.env` file inside the `backend/` directory looking similar to the provided `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/student-portal
JWT_SECRET=supersecretjwtkeythatshouldbechangedinproduction
```

### Running the App
From the root directory, start both the backend Node server and the Vite React frontend:
```bash
npm run dev
```
*(This uses `concurrently` to run both servers. The frontend defaults to http://localhost:5173 and the backend to http://localhost:5000).*

---

## Render Deployment Instructions

The application is configured to be deployed easily as a **Web Service** on [Render](https://render.com).

1. Push your code to a GitHub/GitLab repository.
2. Create a new **Web Service** in your Render Dashboard.
3. Connect the repository.
4. Set the following configuration options during service creation:
   - **Environment**: `Node`
   - **Build Command**: `npm run build` *(Navigates to frontend, runs vite build)*
   - **Start Command**: `npm start` *(Starts the Express server which static-serves the React build)*
5. **Environment Variables**: Add the following under the `Advanced` section in Render:
   - `NODE_ENV` = `production`
   - `MONGO_URI` = `<Your MongoDB Atlas Connection String>`
   - `JWT_SECRET` = `<Generate a secure random string>`
   - `PORT` = (Render auto-injects this, but you can leave it blank)
6. Click **Create Web Service**.

When the build finishes, the application will be live at the provided `.onrender.com` URL.
