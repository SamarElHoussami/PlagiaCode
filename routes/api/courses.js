const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");


// Load User model
const Course = require("../../models/Course");
const User = require("../../models/User");
const Posting = require("../../models/Posting")

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

// @route POST api/courses/{code}/new-post
// @desc Create new post in course
// @access Public
// @req user id, posting: name, desc, due-date, course code
router.post("/:code/new-post", async (req, res) => {
    const { courseCode } = req.params;

    Course.findOne({ courseCode }).then(course => {
        
        if (!course) {
            return res.status(400).json({error: "Course does not exists"});
        } else {
            //only allow teacher of course to add posting
            if(req.body.user != course.teacher._id) {
                return res.status(400).json({error: "User not permitted to add posting to course"});
            }
  
            //create new posting
            const newPost = new Posting({
                name: req.body.name,
                description: req.body.description,
                course: course._id,
                due_date: new Date(req.body.year, req.body.month-1, req.body.day)
            })
            .save().then(newPost => {
                console.log(newPost + " haha");
                course.postings.push(newPost._id);
                course.save();
                res.json({course: course});
            });
        }

        return res;
    }).catch(err => console.log(err));
});


module.exports = router;