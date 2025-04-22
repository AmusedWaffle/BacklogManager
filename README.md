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

## Dependencies:
* flask
* flask_sqlalchemy
* flask_cors
* psycopg2

## Backend Setup & Installation
1. Clone the repository
2. Set up a virtual environment (optional but recommended)
3. Install dependencies
4. Set up your PostgreSQL database
5. Run the backend server

## Features
* User registration and login system
* Store and retrieve games in a personalized library
* Game ranking system based on user preferences (playtime, ESRB rating, genres, platforms, and reviews)
* Integration with the RAWG Video Games API for fetching game details

## Coding Standards:
1. We follow PEP 8 coding standards for Python.
2. Code quality is checked using pylint.


[![linting: pylint](https://img.shields.io/badge/linting-pylint-yellowgreen)](https://github.com/pylint-dev/pylint)
