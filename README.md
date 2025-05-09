 # Team Task Management App

## Overview
This is a full-stack task management application with a React/Next.js frontend and a Node.js/Express backend. The app allows users to register, login, create and manage tasks, assign tasks to other users, and receive notifications about task assignments and updates.

## Use Case
The app is designed for teams to manage their tasks collaboratively. Users can create tasks, assign them to team members, update task status and priority, and track overdue tasks. Notifications keep users informed about new assignments and updates.

## Getting Started

### Registration and Login
- New users must register by providing a username, email, and password.
- Registered users can login using their email and password.
- Upon successful login or registration, users are redirected to the dashboard.

#### Email and Password Format Examples:
- Email: john.doe@gmail.com  


- Email: test.user@company.com  
  Password: SecurePass2024  

*Note: Password length should be at least 8 characters.*
## Dashboard
- The dashboard displays task categories:
  - Your Tasks: Tasks you created or assigned.
  - Assigned Tasks: Tasks you assigned to others.
  - Assigned to You: Tasks assigned to you.
  - Overdue Tasks: Tasks past their due date.
- You can create new tasks using the task form at the top.
- Users can assign any task to registered users using the "Assign To" dropdown in the task form.
- Tasks can be edited or deleted using the buttons in the task list.
- Clicking a task category opens a modal with tasks in that category.
- Task details include title, description, status, priority, assigned user, and due date.
- The priority of each task is clearly indicated in the task list.
- You can view the full task description in a modal by clicking "View Description" on a task.

### Notifications
- Notifications appear as a bell icon with an unread count.
- Clicking the bell opens a notification drawer showing recent notifications.
- Notifications inform users about new task assignments and updates.
- Unread notifications can be marked as read.

## Performing CRUD Operations Through the UI
- **Create Task:** Fill out the task form with title, description, status, priority, assignee, and due date, then submit.
- **Read Tasks:** Click on task categories to view tasks in that category.
- **Update Task:** Click the "Edit" button on a task, modify the details in the form, and submit.
- **Delete Task:** Click the "Delete" button on a task to remove it.

## Notes
- You must be logged in to access the dashboard and perform task operations.
- The app uses JWT tokens stored in localStorage for authentication.
- Backend API endpoints are under `/api` and require authorization headers.

## Technologies Used
- Frontend: React, Next.js, Tailwind CSS, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT

## APP Live Link
(https://team-task-management-app-production-0909.up.railway.app/)
