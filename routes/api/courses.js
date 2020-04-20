const express = require("express");
var bodyParser = require('body-parser');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var ObjectId = require('mongoose').Types.ObjectId; 
const keys = require("../../config/keys");
var mongoose = require('mongoose');//.set('debug', true);
var fs = require('fs');


// Load User model
const Assignment = require("../../models/Assignment");
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
    if(!Array.isArray(req.body.courses)) {
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

// @route POST api/courses/remove
// @desc Remove course
// @access Public
router.post("/remove", async (req, res) => {
    let user = req.body.user;
    let course = req.body.course;
    let updatedUser = null;
    let updatedCourse = null;

    //if user is teacher, delete course from everywhere
    if(user.type == "Teacher") {
        console.log("deleting a whole course");

        //delete course from students taking the course
        User.find({ courses: ObjectId(course._id) }).then(users => {
            if(users) {
                users.forEach(function(user){
                    var removedCourse = user.courses.filter(function(e) { if(e.toString().localeCompare(course._id.toString()) !== 0) { return e; } });
                    //console.log("og: " + user.courses + "\nremoved: " + removedCourse)
                    
                    user.courses = removedCourse;
                    user.save(function (err) {
                        if(err) {
                            console.error('ERROR!' + err);
                            res.status(400).json({ error: "problem deleting course from users" });
                        }
                    });
                    if(user._id.toString().localeCompare(req.body.user._id.toString()) === 0) {
                        res.json({user: user});
                    }
                });
            }
        })

        //delete ta of course
        User.findOne({ ta: ObjectId(course._id) }).then(user => {
            if(user) {
                var removedTa = user.ta.filter(function(e) { if(e.toString().localeCompare(course._id.toString()) !== 0) { return e; } });
                user.ta = removedTa;
                user.save(function (err) {
                    if(err) {
                        console.error('ERROR!' + err);
                        res.status(400).json({ error: "problem deleting course from ta" });
                    }
                });
            }
        })

        //delete postings belonging to course
        Posting.find({ course: ObjectId(course._id )}).then(postings => {
            if(postings) {
                postings.forEach(function(posting){
                    var toDelete = posting.submissions;
                    toDelete.forEach(async function (submission){
                        await Assignment.findById(ObjectId(submission)).then((assignment) => {
                            if(assignment){
                            
                                //delete file from folder
                                try {
                                    fs.unlinkSync("client/public" + assignment.filePath)
                                } catch(err) {
                                    console.error(err)
                                    res.status(400).json({ error: "problem deleting file from folder" });
                                }
                                
                                //delete assignment from database
                                assignment.remove();
                            }
                        });        
                        //assignmentsToDelete.push(submission);
                    });

                    posting.remove();
                })
            }
        })

        Course.findById(ObjectId(course._id)).then(course => {
            if(course) course.remove();
        })
        return res;
    } else {
        if(user.type == "Student") {
            User.findById(ObjectId(user._id)).then(user => {
                if(user) {
                    var removedCourse = user.courses.filter(function(e) { if(e.toString().localeCompare(course._id.toString()) !== 0) { return e; } });
                    user.courses = removedCourse;
                    user.save(function (err) {
                        if(err) {
                            console.error('ERROR!' + err);
                            return res.status(400).json({ error: "problem deleting course from ta" });
                        }
                    })
                }
            })

            //remove student from course
            Course.findById(ObjectId(course._id)).then(course => {
                if(course) {
                    var removedStudent = course.students.filter(function(e) { if(e.toString().localeCompare(user._id.toString()) !== 0) { return e; } });
                    course.students = removedStudent;
                    course.save(function (err) {
                        if(err) {
                            console.error('ERROR!' + err);
                            return res.status(400).json({ error: "problem deleting student from course" });
                        }
                    })
                }
            
            })
            return res.json("successfully removed course");
        }
    }

});



module.exports = router;