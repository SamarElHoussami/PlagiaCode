const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");


// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);
    
    // Check validation
    if (!isValid) {
        console.log(errors);
        return res.status(400).json(errors);
    }
    
    User.findOne({ email: req.body.email }).then(user => {
        
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                type: req.body.type
            });
                
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                    .save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
                });
            });
        }
    });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    
    const email = req.body.email;
    const password = req.body.password;
    
    // Find user by email
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }
        
        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name
                };
            // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json(user)
                        /*res.json({
                            success: true,
                            token: "Bearer " + token,
                            user: user
                        });*/
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" });
            }
        });
    });
});

// @route GET api/users/find
// @desc Get user by ID or list of IDs
// @access Public
router.post("/find-user", async (req, res) => {
    let user_ids = new Array();

    //if there's only one user, make it so you don't iterate through user id string
    if(req.body.user_ids.length> 5) {
        user_ids.push(req.body.user_ids);
    } else {
        user_ids = req.body.user_ids;
    }
    
    const users = new Array();

    for (var i = 0; i < user_ids.length; i++) {
        //console.log("ID: " + user_ids[i]);
        await User.findById( user_ids[i] ).then(user => {
            if (user) {
                users.push(user);
            } else {
                users.push("invalid");
            }
        }).catch(err => console.log(err));
    };
    
    //console.log("names: "+courseNames);
    return res.json(users);    
});

// @route GET api/users/find
// @desc Get all users of type student
// @access Public
router.get("/students", async (req, res) => {
     
    let students = await User.find({ type: "student" }).catch(err => {return res.json("error getting all students")})
    return res.json(students);    
});

module.exports = router;