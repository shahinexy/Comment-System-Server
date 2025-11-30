# Comment System – MERN Stack (with Real-Time Updates)

This project is a fully functional comment system built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with JWT authentication and real-time updates using Socket.IO.

Users can add comments, edit/delete their own comments, reply to comments, react with like/dislike, sort, paginate, and see updates instantly in real time.

Because most free hosting platforms do not support Socket.IO WebSocket connections, the project should be run locally for full functionality.

**Postman Collection:** https://documenter.getpostman.com/view/40338347/2sB3dLUX3d

## Features

### Authentication & Authorization

- JWT-based login/register
- Only authenticated users can comment
- Users can only edit/delete their own comments

### Comment System

- Add, edit, delete comments
- Reply to comments (nested replies)
- Paginated comment list
- Sort comments by:

  - Newest (by default)
  - Most liked
  - Most disliked

## Real-Time Updates (Socket.IO)

- New comments appear instantly
- Edits, deletes, replies sync live
- Live like/dislike updates

## Frontend

- Built with React + TypeScript
- React Query for API state
- Socket.IO client
- Tailwind CSS UI components
- Clean, reusable components

## Backend

- Node.js + Express REST API
- MongoDB (with Prisma/Mongoose)
- Socket.IO real-time server
- Modular architecture
- Complete validation & error handling

## Tech Stack

**Frontend:** React, TypeScript, React Query, React Router, Aio, Tailwind CSS, Socket.IO Client
**Backend:** Node.js, Express.js, MongoDB, Prisma, TypeScript, Socket.IO
**Authentication:** JWT
**Deployment:** Local (due to WebSocket requirement)

## Project Set-Up Instructions

Note: `.env` files are included in the repository for review.

### Backend Setup

#### 1. Clone the Repository

```
https://github.com/shahinexy/Comment-System-Server.git
```

#### 2. Install Dependencies

```
npm install
```


#### 3. Run the server in development mode

```
npm run dev
```

#### Server URL:

```
http://localhost:2025
```


### Frontend Setup

#### 1. Clone the Repository

```
https://github.com/shahinexy/Comment-System-Client.git
```

#### 2. Install Dependencies

```
npm install
```


#### 3. Run the frontend in development mode

```
npm run dev
```


#### 4. Frontend URL:

```
http://localhost:5173
```


## Server Base URL & Endpoints

```
http://localhost:2025/api/v1
```

#### Auth Routes
| Endpoint                  | Method | Description                       |
|---------------------------|--------|-----------------------------------|
| `/auth/login`             | POST   | Login user and save token         |
| `/auth/forgot-password`   | POST   | Send reset OTP                    |
| `/auth/verify-otp`        | POST   | Verify OTP                        |
| `/auth/resend-otp`        | POST   | Resend OTP                        |
| `/auth/reset-password`    | POST   | Reset password after OTP          |

#### User Routes
| Endpoint             | Method | Auth Required | Description                     |
|----------------------|--------|---------------|---------------------------------|
| `/users`             | POST   | No            | Register new user               |
| `/users`             | GET    | No            | Get all users (paginated)       |
| `/users/profile`     | GET    | Yes           | Get logged-in user profile      |
| `/users/profile`     | PUT    | Yes           | Update profile (name + image)   |

#### Post & Comment System
| Endpoint                          | Method | Auth Required | Description                          |
|-----------------------------------|--------|---------------|--------------------------------------|
| `/posts`                          | POST   | Yes           | Create post (text + optional image)  |
| `/posts`                          | GET    | Yes           | Get all posts (with reactions)       |
| `/posts/for-everyone`             | GET    | No            | Public posts (no auth needed)        |
| `/posts/:id`                      | GET    | Yes           | Get single post                      |
| `/posts/:id/comments`             | GET    | Yes           | Get comments of a post               |
| `/posts/comments/:id`             | GET    | Yes           | Get replies to a specific comment    |


### Post comment, Comment edit, and deleted those API are handled by Socket.Io for real life update.