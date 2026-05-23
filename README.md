# Chat App

A real-time chat application built with Node.js/Express backend and React frontend, featuring user authentication, WebSocket support for instant messaging, and Redis caching.

## Features

- **Real-time Messaging**: Instant message delivery using WebSocket (Socket.IO)
- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **MongoDB Integration**: Persistent data storage for users and messages
- **Redis Caching**: Performance optimization with Redis cache
- **Rate Limiting**: Built-in rate limiting to prevent abuse
- **Responsive UI**: React-based frontend with responsive design

## Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Redis** (v6 or higher) - [Download](https://redis.io/download)
- **npm** (comes with Node.js)

## Project Structure

```
chat_app/
├── app.js                    # Main Express application
├── package.json              # Backend dependencies
├── config/
│   ├── db.js                # Database configuration
│   ├── redis.js             # Redis configuration
│   └── rateLimiter.js       # Rate limiting setup
├── controllers/
│   └── authController.js    # Authentication logic
├── models/
│   ├── User.js              # User schema
│   └── Message.js           # Message schema
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   └── messageRoutes.js     # Message routes
├── socket/
│   └── socket.js            # WebSocket configuration
└── chat-ui/                 # React frontend
    ├── package.json
    ├── public/
    └── src/
        ├── App.js
        ├── pages/
        │   ├── Chat.js      # Chat page
        │   └── Login.js     # Login page
        └── ...
```

## Installation & Setup

### 1. Clone or Download the Project

```bash
cd chat_app
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd chat-ui
npm install
cd ..
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Copy from .env.example
cp .env.example .env
```

Edit `.env` and set your configuration:

```env
# JWT Secret for authentication
JWT_SECRET=your_secret_key_here

# MongoDB connection URI
MONGO_URI=mongodb://localhost:27017/chat_app

# Redis connection URL
REDIS_URL=redis://localhost:6379

# Port for backend server (optional, defaults to 3000)
PORT=3000
```

### 5. Start MongoDB and Redis

**MongoDB:**

```bash
# On Windows
mongod

# On Mac
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

**Redis:**

```bash
# On Windows
redis-server

# On Mac
brew services start redis

# On Linux
sudo systemctl start redis-server
```

## Running the Application

### Option 1: Run Backend and Frontend Separately (Recommended for Development)

**Terminal 1 - Start Backend Server:**

```bash
npm start
```

The backend server will run on `http://localhost:3000`

**Terminal 2 - Start Frontend Development Server:**

```bash
cd chat-ui
npm start
```

The frontend will run on `http://localhost:3001`

### Option 2: Run Both Simultaneously (Using npm concurrently)

First, install `concurrently` in the root directory:

```bash
npm install --save-dev concurrently
```

Then add this script to your root `package.json`:

```json
"scripts": {
  "dev": "concurrently \"npm start\" \"cd chat-ui && npm start\""
}
```

Run both:

```bash
npm run dev
```

## Usage

1. **Access the Application**: Open your browser and navigate to `http://localhost:3001`

2. **Create an Account**:
   - Click on the registration/signup option
   - Enter your username and password
   - Click register

3. **Login**:
   - Enter your credentials
   - Click login

4. **Send Messages**:
   - Once logged in, you'll be taken to the chat page
   - Type your message in the input field
   - Messages will be delivered in real-time to all connected users

## API Endpoints

### Authentication Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Message Routes

- `GET /api/messages` - Get all messages
- `POST /api/messages` - Send a new message
- `DELETE /api/messages/:id` - Delete a message (with authentication)

## Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running: `mongod`
- Check `MONGO_URI` in `.env` file
- Verify MongoDB is listening on the default port (27017)

### Redis Connection Error

- Ensure Redis is running: `redis-server`
- Check `REDIS_URL` in `.env` file
- Verify Redis is listening on the default port (6379)

### Frontend Cannot Connect to Backend

- Ensure backend is running on port 3000
- Check that `proxy` in `chat-ui/package.json` is set to `http://localhost:3000`
- Clear browser cache and refresh

### Port Already in Use

- Backend (3000): `netstat -ano | findstr :3000` (Windows) or `lsof -i :3000` (Mac/Linux)
- Frontend (3001): `netstat -ano | findstr :3001` (Windows) or `lsof -i :3001` (Mac/Linux)

## Environment Variables Reference

| Variable     | Description                         | Example                              |
| ------------ | ----------------------------------- | ------------------------------------ |
| `JWT_SECRET` | Secret key for JWT token generation | `your_secret_key`                    |
| `MONGO_URI`  | MongoDB connection string           | `mongodb://localhost:27017/chat_app` |
| `REDIS_URL`  | Redis connection URL                | `redis://localhost:6379`             |
| `PORT`       | Backend server port                 | `3000`                               |

## Technologies Used

### Backend

- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Redis** - Caching
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend

- **React** - UI library
- **Socket.IO Client** - WebSocket client
- **Axios** - HTTP client
- **React Scripts** - Build tool

## Contributing

Feel free to submit issues and enhancement requests!

## License

ISC

## Support

For issues, questions, or suggestions, please open an issue in the repository or contact the development team.

---

**Happy Chatting! 💬**
