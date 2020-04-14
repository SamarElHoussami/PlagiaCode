const express = require("express");
var bodyParser = require('body-parser');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");


// Load User model
const Course = require("../../models/Course");
const User = require("../../models/User");
const Posting = require("../../models/Posting")

// @route GET api/courses/find
// @desc Find course from course id
// @access Public
router.post("/find", (req, res) => {
    
    const courseId = req.body.id;
    
    Course.findById( courseId ).then(course => {
        
        if (course) {
            return res.json(course);
        } else {
            return res.status(400).json({ error: "Course does not exist" });
        }
    }).catch(err => console.log(err));
});

//read array
/*router.post("/my-array", async (req, res) => {
    
    console.log(req.body.array);
    console.log(JSON.stringify(req.body));
    let arr = req.body.array;
    console.log(arr);
    const newArr = new Array();

    for (const e of arr) {
        console.log("element: " + e);
        newArr.push(e);
    }
    
    //console.log("names: "+courseNames);
    return res.json(newArr);    
});*/

// @route POST api/courses/my-courses
// @desc Get course names from course codes
// @access Public
router.post("/my-courses", async (req, res) => {
    
    console.log(JSON.stringify(req.body));
    let courseIds = new Array();

    //if there's only one course, make it so you don't iterate through course id string
    if(req.body.courses.length > 5) {
        courseIds.push(req.body.courses);
    } else {
        courseIds = req.body.courses;
    }
    
    const courseNames = new Array();

    for (var i = 0; i < courseIds.length; i++) {
        console.log("ID: " + courseIds[i]);
        await Course.findById( courseIds[i] ).then(course => {
            if (course) {
                courseNames.push(course.name);
            } else {
                courseNames.push("invalid");
            }
        }).catch(err => console.log(err));
    };
    
    //console.log("names: "+courseNames);
    return res.json(courseNames);    
});

// @route POST api/courses/new
// @desc Create new course
// @access Public
router.post("/new", (req, res) => {
    let courseTa = req.body.ta == '' ? null : req.body.ta;
    Course.findOne({ code: req.body.code }).then(course => {
        
        if (course) {
            return res.status(400).json({error: "Course already exists"});
        } else {
            
            const newCourse = new Course({
                name: req.body.name,
                code: req.body.code,
                teacher: req.body.teacher,
                ta: courseTa
            })
            .save()
            .then(course => {
                User.findById(req.body.teacher).then(user => {
                    user.courses.push(course._id);
                    user.save();
                    res.json({course: course, user: user});
                });
                if(courseTa !== null) {
                    User.findById(courseTa).then(user => {
                    user.ta.push(course._id);
                    user.save();
                    })
                }
            })
            .catch(err => console.log(err));
        }

        return res;
    });
});

// @route GET api/courses/all
// @desc Get all courses
// @access Public
router.get("/all", async (req, res) => {
    try {
        console.log("finding all courses");
        const courses = await Course.find();
        res.send(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route POST api/courses/add
// @desc Add new course
// @access Public
router.post("/add", (req, res) => {
    console.log(JSON.stringify(req.body))
    Course.findOne({ name: req.body.name }).then(course => {
        
        if (!course) {
            return res.status(400).json({error: "Course not found"});
        } else {
            course.students.push(req.body.user._id);
            course.save()
            .then(course => {
                User.findById(req.body.user).then(user => {
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