# AirBNC
# Airbnb Style Application Backend

This project is an Express.js server that connects to a PostgreSQL database to handle user interactions for an Airbnb-style application. Users can manage properties, reviews, and interact with a booking system. The application is thoroughly tested with Jest and Supertest, following Test-Driven Development (TDD) principles.

## Features

- **User Management**: Create, retrieve, update, and delete users.
- **Property Management**: Add, view, update, and delete property listings.
- **Reviews**: Allow users to add, view, and delete reviews for properties.
- **Booking System (Extended Task)**: Manage property bookings (without payment integration).
- **Error Handling**: Implements happy and sad path handling for robust API responses.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **ORM/Database Integration**: node-postgres (pg)
- **Testing**: Jest, Supertest
- **Architecture**: MVC (Model-Controller-Route)