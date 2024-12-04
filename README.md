# Airbnb Style Application Backend

This project is an Express.js server that connects to a PostgreSQL database to handle user interactions for an Airbnb-style application. Users can manage properties, reviews, and interact with a booking system. The application is thoroughly tested with Jest and Supertest, following Test-Driven Development (TDD) principles.

## Features

- **User Management**: Retrieve and update users.
- **Property Management**: View and update property listings.
- **Reviews**: Allow users to add, view, and delete reviews for properties.
- **Booking System (Extended Task)**: Manage property bookings (without payment integration).
- **Error Handling**: Implements happy and sad path handling for robust API responses.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Database Integration**: node-postgres (pg)
- **Testing**: Jest, Supertest
- **Architecture**: MVC (Model-View-Controller)

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Express] (https://expressjs.com/en/starter/installing.html)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- [npm] (https://www.npmjs.com/)
- [dotenv] (https://www.npmjs.com/package/dotenv)

### Installation

1. Clone the repository:
   ``git clone https://github.com/miiswom/pt-be-airbnc.git``
   ``cd pt-be-airbnc.git``

2. Install dependencies:
   `npm install`

3. Initialize the database:
   `npm run setup-dbs`

### Environment Variables

This project uses environment variables, already made available, to securely store database credentials. The `dotenv` package loads these variables into the application, so the connection pool can use them to access the database. 

- Credentials:
`PGDATABASE=airbnc_test`
