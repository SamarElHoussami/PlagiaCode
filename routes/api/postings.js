const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
var fs = require('fs');
var multer = require('multer')

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");
const Posting = require("../../models/Posting");
const Assignment = require("../../models/Assignment");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'client/public/assignments')
    },
    filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
    }
})  

var upload = multer({ storage: storage }).single('file')

// @route GET api/postings/find
// @desc Get postings by ID
// @access Public
router.get("/find", (req, res) => {
    // Form validation
    const posting_id = req.body.posting_id;
    
    Posting.findById(posting_id).then(posting => {
        if(!user) {
            return res.status(400).json({error: "posting does not exist"});
        } else {
            return res.json(user);
        }
    }).catch(err => console.log(err));
});

// @route GET api/postings/submissions/:id
// @desc Get all submissions for posting
// @access Public
router.get("/submissions/:id", async (req, res) => {
    const posting_id = req.params.id;
    
    let submissions = await Assignment.find({ posting: posting_id }).catch(err => console.log(err));
    //console.log(submissions);

    let finalSubmissions = [];

    submissions.forEach(element => {
        //console.log(element.studentName);
        finalSubmissions.push(element);
    });

    return res.json(finalSubmissions);
});

// @route POST api/postings/course-postings
// @desc Get postings names from list of posting ids
// @access Public
router.post("/course-postings", async (req, res) => {
    
    console.log(JSON.stringify(req.body));
    let posting_ids = req.body.posting_ids;//new Array();

    //if there's only one posting, make it so you don't iterate through posting id string
    /*if(req.body.posting_ids.length > 5) {
        posting_ids.push(req.body.posting_ids);
    } else {
        posting_ids = req.body.posting_ids;
    }*/
    
    const postings = new Array();

    for (var i = 0; i < posting_ids.length; i++) {
        console.log("ID: " + posting_ids[i]);
        await Posting.findById( posting_ids[i] ).then(posting => {
            if (posting) {
                postings.push(posting);
            } 
        }).catch(err => console.log(err));
    };
    
    //console.log("names: "+courseNames);
    return res.json(postings);    
});

// @route POST api/postings/course-postings
// @desc Get postings names from list of posting ids
// @access Public
router.post("/submit", async (req, res) => {
    
    //first, check for existing submission
    Assignment.findOne({ studentID: req.body.student_id }).then(assignment => {
        if(assignment && assignment.posting.toString().localeCompare(req.body.posting_id) === 0 ) {
            console.log("FOUND ASSIGNMENT: " + JSON.stringify(assignment));
            
            //remove existing assignment from student assignments array
            User.findById(assignment.studentId, function (err, user) {
                var removedAssign = user.assignments.filter(function(e) { if(e.toString().localeCompare(assignment._id.toString()) !== 0) { return e; } });
                console.log(removedAssign  + " not working?")
                user.assignments = removedAssign;
                user.save(function (err) {
                    if(err) {
                        console.error('ERROR!' + err);
                    }
                });
            });

            //remove existing assignment from posting submissions array
            Posting.findById(assignment.posting, function (err, post) {
                var removedAssign = post.submissions.filter(function(e) { if(e.toString().localeCompare(assignment._id.toString()) !== 0) { return e; } });
                post.submissions = removedAssign;

                post.save(function (err) {
                    if(err) {
                        console.error('ERROR!' + err);
                    }
                });
            });

            //delete file from folder
            try {
                fs.unlinkSync("client/public" + assignment.filePath)
            } catch(err) {
                console.error(err)
            }
            
            //delete existing assignment from database
            assignment.remove();
        } 
    }).catch(err => console.log(err));

    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        try {
            const file = req.file;
           
            if (!file) {
                return res.status(400).send({msg: 'Please upload a file'});
            }

            const assign = fs.readFileSync(req.file.path, 'utf8');
            /*console.log(assign); extracts text from file*/
           
            const finalAssignment = new Assignment({
                name: req.file.originalname,
                studentId: req.body.student_id,
                studentName: req.body.student_name,
                posting: req.body.posting_id,
                filePath: req.file.path.substr(13)
            }).save().then(assignment => {
                    User.findById(req.body.student_id).then(user => {
                        user.assignments.push(assignment._id);
                        user.save();
                    }).catch(err => {console.error(err.message); res.status(500).send("Couldn't find User for assignment")})

                    Posting.findById(req.body.posting_id).then(posting => {
                        posting.submissions.push(assignment);
                        posting.save();
                    }).catch(err => {console.error(err.message); res.status(500).send("Couldn't find posting for assignment")})
                }
            );
            res.send({assignment: finalAssignment, file: req.file});

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    })
});

// @route POST api/postings/new
// @desc Create new post
// @access Public
router.post("/new", (req, res) => {
    console.log(Date(req.body.date));
    Course.findById(req.body.course).then(course => {
        
        if (!course) {
            return res.status(400).json({error: "Course does not exists"});
        } else {
            
            const newPost = new Posting({
                name: req.body.name,
                course: req.body.course,
                description: req.body.description,
                due_date: req.body.date
            })
            .save()
            .then(post => {
                course.postings.push(post._id);
                course.save().then(
                    course => {res.json({course: course, post: post})}
                );
                
            })
            .catch(err => console.log(err));
        }

        return res;
    });
});

module.exports = router;