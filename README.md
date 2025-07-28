# Timebox

## Overview

This project is a timekeeping mobile app designed for employees. It enables users to clock in and out seamlessly, ensuring accurate tracking of work hours. Both employers and employees can access time records, while employers also have the ability to send hiring requests directly through the app.

## Table of Contents

- [Built With](#built-with)
- [Project Setup](#project-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Database Setup](#database-setup)
- [Running the Project](#running-the-project)
  - [Running the Backend](#running-the-backend)
  - [Running the Frontend](#running-the-frontend)

## Built With

- ![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
- ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
- ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

## Project Setup

**Clone the repository:**

  ```sh
  git clone https://github.com/Yui1002/timebox
  cd timebox
  ```

### Backend Setup

1. **Install dependencies:**

    ```sh
    cd clinclon_server
    npm install
    ```

2. **Set up configuration:**

    Create a `.env` file in the `clinclon_server` directory and add the necessary environment variables:

    ```env
    DB_NAME=your_db_name
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_HOST=your_db_host
    DB_PORT=your_db_port
    ```

### Frontend Setup
1. **Install dependencies:**

    ```sh
    cd mobile
    npm install
    ```   

2. **Set up configuration:**

  Create the `config.js` file in the `mobile` directory with the appropriate backend URL and password rules:

  ```javascript
  export const LOCAL_HOST_URL = `YOUR_LOCAL_HOST_URL`
  export const PASSWORD_RULES = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  };
  ```
3. **Set up React Native environment:**

    Follow the [React Native CLI Quickstart](https://reactnative.dev/docs/environment-setup) guide to set up the development environment for React Native.

### Database Setup

1. **Create the database:**

    Connect to your PostgreSQL server and create the database:

    ```sql
    CREATE DATABASE your_db_name;
    ```

2. **Import the schema using CLI:**

    Use the following command to import the `schema.sql` file into your PostgreSQL database:

    ```sh
    psql -h your_db_host -U your_db_user -d your_db_name -f /path/to/clinclon_server/schema.sql
    ```

    Replace `/path/to/clinclon_server/schema.sql` with the actual path to the `schema.sql` file.

    You will be prompted to enter the password for the database user.

## Running the Project

### Running the Backend

1. **Generate OpenAPI specification and routes:**

    ```sh
    npm run build
    npm run routes-gen
    npm run swagger-gen
    ```

2. **Start the backend server:**

    ```sh
    npm start
    ```

    The server will start on `YOUR_LOCAL_HOST_URL`.

### Running the Frontend (React Native)

1. **Navigate to the mobile directory:**

    ```sh
    cd mobile
    ```

2. **Start the React Native development server:**

    ```sh
    npm start
    ```

3. **Run the app on an Android emulator or device:**

    ```sh
    npm run android
    ```

4. **Run the app on an iOS simulator or device:**

    ```sh
    npm run ios
    ```