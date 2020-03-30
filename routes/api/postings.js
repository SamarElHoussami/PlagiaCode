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
const Posting = require("../../models/Posting");

// @route GET api/postings/find
// @desc Get postings by ID
// @access Public
router.get("/find", (req, res) => {
    // Form validation
    const posting_id = body.req.posting_id;
    
    Posting.findById(posting_id).then(posting => {
        if(!user) {
            return res.status(400).json({error: "posting does not exist"});
        } else {
            return res.json(user);
        }
    }).catch(err => console.log(err));
});

// @route POST api/postings/course-postings
// @desc Get postings names from list of posting ids
// @access Public
router.post("/course-postings", async (req, res) => {
    
    console.log(JSON.stringify(req.body));
    let posting_ids = new Array();

    //if there's only one posting, make it so you don't iterate through posting id string
    if(req.body.posting_ids.length > 5) {
        posting_ids.push(req.body.posting_ids);
    } else {
        posting_ids = req.body.posting_ids;
    }
    
    const postings = new Array();

    for (var i = 0; i < posting_ids.length; i++) {
        console.log("ID: " + posting_ids[i]);
        await Posting.findById( posting_ids[i] ).then(posting => {
            if (posting) {
                postings.push(posting);
            } else {
                postings.push("invalid");
            }
        }).catch(err => console.log(err));
    };
    
    //console.log("names: "+courseNames);
    return res.json(postings);    
});


module.exports = router;