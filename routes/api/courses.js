const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");


// Load User model
const Course = require("../../models/Course");
const User = require("../../models/User");

// @route GET api/courses/{code}
// @desc Get course from course code
// @access Public
router.get("/:code", (req, res) => {
    
    const { courseCode } = req.params;
    
    Course.findOne({ courseCode }).then(course => {
        
        if (course) {
            return res.json(course);
        } else {
            return res.status(400).json({ error: "Course does not exist" });
        }
    }).catch(err => console.log(err));
});

// @route POST api/courses/new
// @desc Create new course
// @access Public
router.post("/new", (req, res) => {
    Course.findOne({ code: req.body.code }).then(course => {
        
        if (course) {
            return res.status(400).json({error: "Course already exists"});
        } else {
            
            const newCourse = new Course({
                name: req.body.name,
                code: req.body.code,
                teacher: req.body.teacher,
            })
            .save()
            .then(course => {
                User.findById(req.body.teacher).then(user => {
                    user.courses.push(course._id);
                    user.save();
                    res.json({course: course, user: user});
                })
            })
            .catch(err => console.log(err));
        }

        return res;
    });
});

module.exports = router;