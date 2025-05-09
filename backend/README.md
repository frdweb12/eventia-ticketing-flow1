
# Eventia Backend API

A production-ready Express.js backend application for the Eventia event ticketing platform.

## Features

- RESTful API with Express.js and TypeScript
- PostgreSQL database with Knex.js ORM
- JWT-based authentication
- Role-based authorization
- Modular architecture with domain-driven design
- OpenAPI/Swagger documentation
- API versioning
- Centralized error handling
- Structured logging with Winston
- Request validation with Zod
- Security best practices with helmet, cors, rate-limiting
- Docker and docker-compose support
- Unit and integration testing with Jest

## Project Structure

```
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── db/              # Database migrations and seeds
│   ├── docs/            # API documentation
│   ├── middleware/      # Express middleware
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── server.ts        # Main application entry point
├── tests/               # Test files
├── .env.example         # Example environment variables
├── .eslintrc            # ESLint configuration
├── .gitignore           # Git ignore file
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker-compose configuration
├── jest.config.js       # Jest configuration
├── package.json         # NPM dependencies
├── tsconfig.json        # TypeScript configuration
└── README.md            # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- PostgreSQL (or Docker)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Run database migrations:
   ```bash
   npm run migrate
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
   
### Using Docker

To run the application using Docker:

```bash
docker-compose up --build
```

## API Documentation

Once the server is running, you can access the Swagger documentation at:

```
http://localhost:4000/api-docs
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server
- `npm run build` - Build the TypeScript project
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed the database

## Environment Variables

See `.env.example` for all required environment variables.

## Database Migrations

To create a new migration:

```bash
npx knex migrate:make migration_name --knexfile src/config/knexfile.ts
```

To run migrations:

```bash
npm run migrate
```

## Testing

```bash
npm test
```

## Deployment

The application can be deployed using Docker. Make sure to set the appropriate environment variables in production.

## License

ISC
