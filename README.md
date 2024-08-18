<div align="center">
    <img src="https://raw.githubusercontent.com/Sorok-Dva/sdr-frontend/main/public/img/logo.png" alt="sdr-backend Logo">
  <h1>Le Sentier des Rêves</h1>
  <blockquote>Réveillez le rêveur en vous.</blockquote>
  <img src="https://hits.dwyl.com/Sorok-Dva/sdr-backend.svg?style=flat-square" alt="Views"><br />
  <img src="https://img.shields.io/github/downloads/Sorok-Dva/sdr-backend/total.svg?style=for-the-badge" alt="Total downloads">
  <!--<a href="https://shields.io/community#sponsors" alt="Sponsors">
    <img src="https://img.shields.io/opencollective/sponsors/Sorok-Dva.svg?style=for-the-badge" />
  </a>-->
  <a href="https://github.com/Sorok-Dva/sdr-backend/pulse" alt="Activity">
    <img src="https://img.shields.io/github/commit-activity/m/Sorok-Dva/sdr-backend.svg?style=for-the-badge" />
  </a>
  <br />
  <a href="https://github.com/sponsors/Sorok-Dva">
    <img src="https://img.shields.io/badge/sponsor-30363D?style=for-the-badge&logo=GitHub-Sponsors&logoColor=#EA4AAA" alt="Sponsor Me">
  </a>
  <a href="https://patreon.com/sorokdva">
    <img src="https://img.shields.io/badge/Patreon-F96854?style=for-the-badge&logo=patreon&logoColor=white" alt="Support Me on Patreon">
  </a>
</div>

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

## Technologies Used

![langs](https://skillicons.dev/icons?i=typescript,nodejs,express,ubuntu,linux,docker,sentry&perline=)

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
# APP
NODE_ENV=development
SERVICE_NAME=sdr-api
WEBSITE_URL=https://sentier-des-reves.fr
DEBUG=sdr-api:*
DEBUG_COLORS=true
DEBUG_DEPTH=10

JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3011
PORT=3010

# DB
DB_NAME=oldsdr
DB_USER=root
DB_PASS=root
DB_HOST=localhost

# Mailjet
MJ_APIKEY_PUBLIC=xxxxxxxxxxx
MJ_APIKEY_PRIVATE=xxxxxxxxxxx

# Email options
EMAIL_SENDER_ADDRESS=support@sentier-des-reves.fr
EMAIL_SENDER_NAME="Lisa du Sentier des Rêves"

EMAIL_ERRORS_REPORT=errors-reporting@sentier-des-reves.fr

# Sentry
SENTRY_DSN=xxx
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

### Acknowledgments

- Developed by [Сорок два](https://github.com/Sorok-Dva). All rights reserved.
- Developed with love through ![langs](https://skillicons.dev/icons?i=webstorm&perline=)

### License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International** - see the [LICENSE](LICENSE) file for details.

## Contributors

<a href="https://github.com/sorok-dva/sdr-backend/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=sorok-dva/sdr-backend" />
</a>

## Contact

For any inquiries or feedback, please visit our [GitHub Repository](https://github.com/Sorok-Dva/sdr-backend) or contact the developers directly.
