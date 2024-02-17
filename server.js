/********************************************************************************
* WEB322 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Sarthak Bhalla Student ID: 137872222 Date: 16th february 2024
*
********************************************************************************/



const path = require('path');

const legoData = require("./modules/legoSets");
const express = require('express');
const app = express();
const port = 3000;


legoData.initialize();



// Setting up a static folder for Express.js to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Handling GET requests to the root path ("/")
app.get('/', async (req, res) => {
    try {
        // Constructing the file path for the home.html file
        const filePath = path.join(__dirname, 'views', 'home.html');
        
        // Sending the home.html file as the response
        res.sendFile(filePath);
    } catch (error) 
    {
        // Logging errors and sending a 404 response if the home.html file is not found
        console.error(error);
        res.status(404).send('Home not found');
    }
});


// Route: GET "/lego/sets"
// Handling GET requests to the "/lego/sets" endpoint
app.get('/lego/sets', async (req, res) => {
  try {
      // Extracting the 'theme' query parameter from the request URL
      const theme = req.query.theme;

      // Checking if a 'theme' parameter is provided
      if (theme) {
          // If a theme is specified, retrieve sets based on the theme
          const setsByTheme = await legoData.getSetsByTheme(theme);
          
          // Sending the sets as a JSON response
          res.json(setsByTheme);
      } else {
          // If no theme is specified, retrieve all sets
          const allSets = await legoData.getAllSets();
          
          // Sending all sets as a JSON response
          res.json(allSets);
      }
  } catch (error) {
      // If an error occurs during the process, send a 404 response with an error message
      res.status(404).send('404 Error retrieving Lego sets: ' + error);
  }
});


// Route: GET "/lego/sets/:code"
app.get('/lego/sets/:code', async (req, res) => {
    try {
        const setCode = req.params.code;
        const setByNum = await legoData.getSetsByNum(setCode);
        res.json(setByNum);
    } catch (error) {
        res.status(404).send('Error getting set by number: ' + error);
    }
});

// Handling GET requests to the "/about" endpoint
app.get('/about', async (req, res) => {
  try {
      // Constructing the file path for the about.html file
      const filePath = path.join(__dirname, 'views', 'about.html');
      
      // Sending the about.html file as the response
      res.sendFile(filePath);
  } catch (error) {
      // Logging errors and sending a 404 response if the about.html file is not found
      console.error(error);
      res.status(404).send('about.html Not found');
  }
});



app.use((req, res, next) => {
    const filePath = path.join(__dirname, 'views', '404.html');
    res.status(404).sendFile(filePath);
  });


// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

