# Bug Tracker System

A simple bug tracking system built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- Dashboard with bug statistics
- Bug reporting form
- Bug management interface
- Status tracking
- Priority levels
- Project categorization

## Project Structure

```
bug-tracker/
├── client/          # React frontend
└── server/          # Express backend
```

## Setup Instructions

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/bug-tracker
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Bugs

- `POST /api/bugs` - Create a new bug
- `GET /api/bugs` - Get all bugs
- `PUT /api/bugs/:id` - Update a bug
- `DELETE /api/bugs/:id` - Delete a bug

## Sample API Requests

### Create Bug
```bash
curl -X POST http://localhost:5000/api/bugs \
-H "Content-Type: application/json" \
-d '{
  "title": "Login Button Not Working",
  "description": "The login button does not respond when clicked",
  "priority": "High",
  "project": "Website"
}'
```

### Get All Bugs
```bash
curl http://localhost:5000/api/bugs
```

### Update Bug
```bash
curl -X PUT http://localhost:5000/api/bugs/:id \
-H "Content-Type: application/json" \
-d '{
  "status": "In Progress",
  "assignedTo": "John Doe"
}'
```

## Technologies Used

- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- API Testing: Postman/cURL 