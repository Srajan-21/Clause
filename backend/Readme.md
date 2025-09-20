
# ClauseAI Backend

## Overview

This backend is built with **Express.js** and **MongoDB** (via Mongoose). It provides user authentication and profile management, including registration, login, profile retrieval, and logout. JWT tokens are used for authentication, and blacklisted tokens are stored to prevent reuse after logout.

---

## How It Works

1. **Environment Setup**: Loads environment variables from `.env`.
2. **Database Connection**: Connects to MongoDB using `connectDB`.
3. **Express App**: Configures middleware for CORS, JSON parsing, cookies, and routes.
4. **User Model**: Defines user schema, password hashing, and JWT token generation.
5. **Token Blacklisting**: Stores blacklisted tokens to prevent reuse.
6. **Authentication Middleware**: Verifies JWT tokens and checks blacklist.
7. **Error Handling**: Uses `ApiError` and `asyncHandler` for consistent error responses.

---

## API Endpoints

All endpoints are prefixed with `/api/v1/users`.

### 1. Register User

- **URL**: `/api/v1/users/registerUser`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Response**:
  - `201 Created` on success:
    ```json
    {
      "statusCode": 200,
      "data": {
        "user": { "fullName": "...", "email": "...", "_id": "..." },
        "token": "JWT_TOKEN"
      },
      "message": "User Registered Successfully",
      "success": true
    }
    ```
  - Errors:
    - `400`: All fields required
    - `409`: User already exists

---

### 2. Login User

- **URL**: `/api/v1/users/loginUser`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Response**:
  - `200 OK` on success (sets HTTP-only cookie `token`):
    ```json
    {
      "statusCode": 200,
      "data": {
        "user": { "fullName": "...", "email": "...", "_id": "..." },
        "token": "JWT_TOKEN"
      },
      "message": "User Logged In Successfully",
      "success": true
    }
    ```
  - Errors:
    - `400`: All fields required
    - `404`: User not found
    - `401`: Invalid credentials

---

### 3. Get User Profile

- **URL**: `/api/v1/users/profileUser`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer JWT_TOKEN`
  - Or via cookie: `token=JWT_TOKEN`
- **Response**:
  - `200 OK`:
    ```json
    {
      "statusCode": 200,
      "data": { "fullName": "...", "email": "...", "_id": "..." },
      "message": "User Profile fetched Successfully",
      "success": true
    }
    ```
  - Errors:
    - `401`: Unauthorized or invalid token

---

### 4. Logout User

- **URL**: `/api/v1/users/logoutUser`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer JWT_TOKEN`
  - Or via cookie: `token=JWT_TOKEN`
- **Response**:
  - `200 OK`:
    ```json
    {
      "statusCode": 200,
      "data": null,
      "message": "User logged out Successfully",
      "success": true
    }
    ```
  - Token is blacklisted and cookie is cleared.

---

## Authentication

- JWT tokens are generated on registration/login and sent in response.
- Tokens can be sent via HTTP-only cookies or `Authorization` header.
- Protected endpoints (`/profileUser`, `/logoutUser`) require a valid token.
- Blacklisted tokens (after logout) are denied access.

---

## Error Handling

- All errors are returned in a consistent format using `ApiError`.
- Async errors are handled by `asyncHandler`.

---

## Example Usage

**Register:**
```sh
curl -X POST http://localhost:8000/api/v1/users/registerUser \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","email":"john@example.com","password":"yourpassword"}'
```

**Login:**
```sh
curl -X POST http://localhost:8000/api/v1/users/loginUser \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"yourpassword"}'
```

**Get Profile:**
```sh
curl -X GET http://localhost:8000/api/v1/users/profileUser \
  -H "Authorization: Bearer JWT_TOKEN"
```

**Logout:**
```sh
curl -X GET http://localhost:8000/api/v1/users/logoutUser \
  -H "Authorization: Bearer JWT_TOKEN"
```

---

## Key Files

- `src/app.js`: Express app setup and route registration.
- `src/controllers/user.controllers.js`: User endpoint logic.
- `src/models/user.models.js`: User schema and methods.
- `src/models/blacklistToken.models.js`: Blacklist schema.
- `src/middlewares/auth.middlewares.js`: Authentication middleware.
- `src/routes/user.routes.js`: Route definitions.

---
