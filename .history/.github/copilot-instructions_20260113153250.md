# Copilot Instructions for GigFlow

## Overview
GigFlow is a full-stack application designed for managing gigs and bids, featuring user authentication, real-time updates, and a bidding system. The architecture is divided into a backend (Node.js) and a frontend (React), with clear service boundaries and data flows.

## Architecture
- **Backend**: Handles API requests, user authentication, and database interactions.
  - Key components include:
    - **Controllers**: Manage the logic for handling requests (e.g., `AuthControllers.js`).
    - **Models**: Define the data structure (e.g., `Users.js`, `Gig.js`, `Bid.js`).
    - **Routers**: Define API endpoints (e.g., `Auth.js`, `Bid.js`).
- **Frontend**: Provides the user interface and interacts with the backend.
  - Key components include:
    - **Pages**: Represent different views (e.g., `PostJob.jsx`, `BrowseJobs.jsx`).
    - **Components**: Reusable UI elements (e.g., `Navbar.jsx`, `GoogleLogin.jsx`).

## Developer Workflows
- **Building**: Use `npm run build` in the frontend directory to create a production build.
- **Testing**: Ensure to run tests after making changes. Use `npm test` in both frontend and backend directories.
- **Debugging**: Utilize console logs and React Developer Tools for frontend debugging. For backend, use Node.js debugging tools.

## Project-Specific Conventions
- **API Endpoints**: Follow RESTful conventions. Use plural nouns for resources (e.g., `/api/gigs`, `/api/bids`).
- **Error Handling**: Standardize error responses with appropriate HTTP status codes and messages.
- **Real-time Updates**: Implemented using Socket.io for instant notifications (e.g., hiring notifications).

## Integration Points
- **Database**: MongoDB is used for data persistence. Ensure to follow the schema defined in the models.
- **Authentication**: JWT tokens are used for securing endpoints. Ensure to validate tokens in middleware (e.g., `auth.js`).
- **External Dependencies**: 
  - **Socket.io**: For real-time communication.
  - **Google OAuth**: For user authentication.

## Cross-Component Communication
- **Frontend to Backend**: Use Axios for making API calls. Ensure to handle responses and errors appropriately.
- **Real-time Events**: Listen for events in the frontend (e.g., `socket.on("hired", ...)`) to update the UI dynamically.

## Key Files and Directories
- **Backend**: 
  - [index.js](backend/index.js): Entry point for the backend server.
  - [Controllers/](backend/Controllers/): Contains all controller logic.
  - [Models/](backend/Models/): Contains all data models.
- **Frontend**: 
  - [src/](frontend/src/): Main source directory for React components.
  - [public/](frontend/public/): Static assets.