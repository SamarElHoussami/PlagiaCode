## Project description

PlagiaCode is a web application designed to allow professors to check for plagiarism in source code files. <br/> 
Features include:

### `creating student or teacher account`

Each type of user has specific features

### `adding a course`

For teachers: these are courses they teach<br/> 
For students: these are courses they are enrolled in<br/> 

### `adding/uploading an assignment`

Teachers can upload assignments with a due date for a specific course.<br/> 
Students can submit the completed assignment 

### `checking for plagiarism`

Teachers can select two assignments, compare them, and get a final <br/>
"percentage of plagiarism" 

**Note: the actual plagiarism check will be done using an external API**

### `adding a ta`
Teachers can add TAs to a course, giving them the ability to check for plagiarism and assign grades <br/>
to assignments

**Note: this project is in progress and is not yet competed**

## 499 Final Project Course


## Installation Instructions
````javascript
// Clone this repo 
git clone https://github.com/solidsnacks/Picfolio.git

// Change to Picfolio directory
cd Picfolio

// Install server dependencies in Picfolio root directory
npm install

// Change into client folder
cd client

// Install client dependencies
npm install

// Go back to root directory
cd ..

// In the /config/keys.js file
// Note: mongoURI can be for remote database or local mongoDB instance
// Note: tokenSecret can be any string, like "secret"
{
  mongoURI: 'YOUR_MONGO_URI',
  secretOrKey: 'SOME_TOKEN_SECRET'
}

// Run server and client concurrently
// server will run on http://localhost:5000
// client will run on http://localhost:3000
npm run dev
````
