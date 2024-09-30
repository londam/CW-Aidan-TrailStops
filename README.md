# TrailStops

TrailStops is a desktop based web application to plan out your long distance hikes, how long you'll walk each day and where you'll stop.

## Project Description

### Technologies

React - Easy to setup and customize. A bunch of relevant libraries are available that work with react and do what I needed.
Express - Could of picked any backend framework but was happy with Express.
Mongoose - No SQL based server was first choice due to users being able to generate any number of stops.
Material UI - Used for basic user interface elements as I suck at CSS.
Leaflet Maps - Library used to render map on screen. Free, open-source, and relatively pain free to work with.
Leaflet-gpx - Library to convert GPX file route data to be useable format.
react-router-dom - Used for client side routing and state management.
Google Places API - Used for performing nearby search for relevant hotels/ campsites as well as to get general details and images. Their image fetching docs could really use some work though.

### Main Features

- User Registration and Login
- Interactable map
- Stop placement along pre-defined route.
- Accommodation search and save based on stop placement.
- Full Details Page and map page detail summary.
- Settings page to change walking speed

### Future Development Points

- More routes
- Show distance/time data before placing marker based on user mouse placement on screen along the route.
- Ability to only click on the route and nothing else to place markers more accurately
- Distance/ walking pace settings
- Accommodation Links
- proper login functionality (authentication, password hashing)

### Install and run app locally

1. cd client, npm i
2. cd server, npm i
3. cd client, npm start
4. cd server, node index.js

### Project structure

/TrailStops
├── client
│ ├── public // imgs & gpx route data
│ │ └── index.html // top level of react app
│ ├── src
│ │ ├── components
│ │ ├── helperFunctions // mainly distance calculations and marker placement functions
│ │ └── services // services to access the backend server API requests
│ ├── app.js
│ ├── index.js
│ └── setupTests // Jest tests
├── server
│ ├── controllers // fetch requests
│ ├── models // Mongoose setup
│ ├── index.js // Express setup
│ └── router.js
└── .env files // API keys

### development notes (issues ive left for later)

- routeData file was a quick fix that can be replaced with WHW.gpx and createGPXArray so.
- closestPoint.js placed markers can sometimes snap to the wrong point on the longitude
- no real login implementation, just hardcoded the same email (aidan@test.com) address everywhere needed so login should always be with this email
- Implemented but ommited way to select kilometers or miles on settings page and have it update the distances but need to also implement the change in what is shown throughout the app (km or mile) after the distance number.
- sometimes get undefined lat or lon errors in from haversine calculation when placing first marker (???)

Server side update:
npm i
.env file looks like this:
GOOGLE_API_KEY=/
PORT=3001
MONGO_URL=mongodb://localhost:27017/TrailStops
npx tsc
node dist/index.js
