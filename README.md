# 🎮 Backlog Manager

Backlog Manager is a web application designed to help users track, manage, and rank games in their library and backlog. The app allows users to store game preferences, browse games, and view rankings based on personalized criteria.

## Tech Stack:
Backend:
* Flask — Web framework for building API routes.

* PostgreSQL — Relational database for storing user data and game libraries.

* SQLAlchemy — ORM to simplify database interactions and model definitions.

* psycopg2 — PostgreSQL adapter for Python.

* flask-cors — For handling Cross-Origin Resource Sharing between frontend and backend.

Frontend:
* NPM - Package manager for JavaScript

* React - JavaScript library for web app development

## Dependencies:
* flask
* flask_sqlalchemy
* flask_cors
* psycopg2

* Node.js
* next
* react
* react-dom
* react-router-dom

## Backend Setup & Installation
1. Clone the repository
2. Set up a virtual environment (optional but recommended)
3. Install dependencies on your machine or virtual environment
4. Set up a PostgreSQL database and connect
   - ```app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://USERNAME:PASSWORD@database_host/database_name'```
6. Change the CORS origin to your frontend URL
   - ```CORS(app, resources={r"/*": {"origins": "http://your_address"}})```
8. Run the backend
   - ```python3 backlogmain.py```

## Frontend Setup & Installation
1. Clone the repository
2. Install dependencies
    - Get Node.js from nodejs.org
    - Run npm install in the backlog-manager folder
3. Change IP address in src/app files to your machine
4. Run npm run build
5. Run npm start

## Features
* User registration and login system
* Store and retrieve games in a personalized library
* Game ranking system based on user preferences (playtime, ESRB rating, genres, platforms, and reviews)
* Integration with the RAWG Video Games API for fetching game details

## Coding Standards:
1. We follow PEP 8 coding standards for Python.
2. Python code quality is checked using pylint.
3. HTML, CSS, and JS code is standardized and checked using Prettier linter with default options.


[![linting: pylint](https://img.shields.io/badge/linting-pylint-yellowgreen)](https://github.com/pylint-dev/pylint)
[![linting: Prettier](https://img.shields.io/badge/linting-prettier-yellowgreen)](https://prettier.io)

