# Le Sentier des Rêves - Backend app

This project is the backend of a dream journaling and tutorial platform called "Le Sentier des Rêves".
It is a RESTful API built using Node.js, Express, and Sequelize. 
It provides functionalities to manage users, dream journals, tutorials, comments, and more. 
This API is designed to serve as the backend for a dream journal application that allows users to record, share, and explore their dreams, 
as well as interact with tutorials and community content.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Seeding the Database](#seeding-the-database)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Management**: Register, login, role-based access control, and profile management.
- **Dream Journal**: Create, update, delete, and fetch user dreams with privacy settings.
- **Tutorials**: Manage tutorials with categories, content, and validation by admins.
- **Comments**: Add, update, delete, and upvote comments on tutorials.
- **Reporting**: Users can report inappropriate content.
- **Authentication**: Secure token-based authentication (JWT).

## Technologies

- **Node.js**: TypeScript runtime environment.
- **Express**: Web framework for Node.js.
- **Sequelize**: ORM for database management.
- **MySQL**: Relational database management system.
- **JWT**: JSON Web Tokens for secure authentication.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- MySQL database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Sorok-Dva/sdr-backend
```

2. Navigate to the project directory:

```bash
cd sdr-backend
```

3. Install the dependencies:

```bash
npm install
# or
yarn install
```

4. Set up environment variables:

Create a `.env` file in the root directory and add the following:

```env
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3001
PORT=3000

DB_NAME=sdr
DB_USER=root
DB_PASS=root
DB_HOST=localhost

SENTRY_DSN=your_sentry_dsn
```

5. Create a database and Run the database migrations and seeders:

```bash
$mysql> CREATE DATABASE sdr;
npx sequelize db:migrate
npx sequelize db:seed:all
```

6. Start the development server:

```bash
npm run dev
# or
yarn dev
```

The server should now be running on `http://localhost:3000`.

### Running Tests

To run tests, use the following command:

```bash
npm run test
# or
yarn test
```

### Project Structure

- `src/`: Contains the source code of the application.
- `src/models/`: Sequelize models for the database entities.
- `src/routes/`: Express routes for handling API requests.
- `src/middlewares/`: Custom middlewares for handling authentication, validation, etc.
- `config/`: Configuration files including database setup.

### API Endpoints

#### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Authenticate a user and return a JWT

#### Users
- GET /api/users/:id - Get user profile by ID
- PUT /api/users/:id - Update user profile
- DELETE /api/users/:id - Delete a user

### Dreams
- POST /api/dreams/ - Create a new dream
- GET /api/dreams/my - Get user's dreams
- PUT /api/dreams/:id - Update a dream
- DELETE /api/dreams/:id - Delete a dream

#### Tutorials
- POST /api/tutorials - Create a new tutorial
- GET /api/tutorials - Get all tutorials
- GET /api/tutorials/:id - Get a tutorial by ID
- PUT /api/tutorials/:id - Update a tutorial
- DELETE /api/tutorials/:id - Delete a tutorial

#### Comments
- POST /api/comments/ - Add a comment
- GET /api/comments/:tutorialId - Get comments by tutorial ID
- PUT /api/comments/:id - Update a comment
- DELETE /api/comments/:id - Delete a comment

#### Reporting
- POST /api/reports/ - Report content

### Error Handling

The API uses standard HTTP status codes to indicate the success or failure of API requests:

- `200 OK` - The request was successful.
- `201 Created` - The resource was successfully created.
- `400 Bad Request` - The request was invalid or cannot be served.
- `401 Unauthorized` - Authentication failed.
- `404 Not Found` - The requested resource was not found.
- `500 Internal Server Error` - An error occurred on the server.

### API Documentation

The API documentation is available at `http://localhost:3000/api-docs` once the server is running. It provides detailed information about each endpoint, including request parameters, responses, and examples.

### Contributing

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

### License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International - see the [LICENSE](LICENSE) file for details.
