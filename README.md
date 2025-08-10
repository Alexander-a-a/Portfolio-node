The Cake Master — Bakery Portfolio (Node + Express + EJS)

A simple bakery portfolio site built with Express, EJS and Bootstrap.
includes a Google Maps Embed in the contact section (and on the main page).

# Features

- Responsive layout with Bootstrap & Bootstrap Icons
- Reusable EJS partials (navbar, contact, etc.)
- Google Maps Embed API with a pinned location
- Login wiring via Passport Local + express-session (User and password can be found in /data/user.json)

# Tech Stack

- Node.js, Express, EJS
- Bootstrap 5, Bootstrap icons, jQuery
- typed.js
- Passport + sessions

# Getting Started

- Install dependencies

npm install

- Create your env file from the example

- cp .env.example .env

- then open .env and set:

- GOOGLE_MAPS_API_KEY=your_restricted_key_here

- Run

npm start

# App: http://localhost:3000

- Run the image server

node bin/imagesServer

# serves images at: http://localhost:8080/images/<filename>

# example: http://localhost:8080/images/wedding_cake.jpg
