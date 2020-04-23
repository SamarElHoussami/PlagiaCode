import React, {Fragment} from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Modal, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import ReactLoading from 'react-loading';
import DateTimePicker from 'react-datetime-picker';

//style import 
import styles from '../styles/coursepageStyle.module.css';

class CoursePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: JSON.parse(localStorage.getItem('user')),
            courseName: props.history.location.state === undefined ? null : props.history.location.state.courseName,
            courseId: props.history.location.state === undefined ? null : props.history.location.state.courseId,
            course: null,
            teacher: null,
            postings: null,
            ta: null,
            loading: 0,
            show: false,
            modalFor: null,
            selectId: null,
            selectedFile: null,
            students: null,
            postName: '',
            postDesc: '',
            postDate: new Date(),
            toCompare: [],
            submissions: null,
            removeCourse: null

        }
        this.getUser = this.getUser.bind(this);
        this.getPostings = this.getPostings.bind(this);
        this.getCourse = this.getCourse.bind(this);
        this.renderNames = this.renderNames.bind(this);
        this.renderDetailModal = this.renderDetailModal.bind(this);
        this.renderCreateModal = this.renderCreateModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.fileInput = React.createRef();
        this.fileChange = this.fileChange.bind(this);
        this.renderCreatePostButton = this.renderCreatePostButton.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.createPost = this.createPost.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.loadPage = this.loadPage.bind(this);
        this.viewSubmissions = this.viewSubmissions.bind(this);
        this.getSubmissions = this.getSubmissions.bind(this);
        this.handleCompare = this.handleCompare.bind(this);
        this.isLate = this.isLate.bind(this);
        this.renderCompareButton = this.renderCompareButton.bind(this);
        this.handleSubmitCompare = this.handleSubmitCompare.bind(this);
        this.hasCourse = this.hasCourse.bind(this);
        this.confirmRemoveCourse = this.confirmRemoveCourse.bind(this);
        this.removeCourse = this.removeCourse.bind(this);
        this.removeCourse = this.removeCourse.bind(this);
        this.addCourse = this.addCourse.bind(this);

    }

    /**************************************************
    
                        LIFECYCLE
    
    ************************************************** */

    componentWillMount() {
        if(this.state.courseId !== null) {
            this.getCourse();
        } else {
            alert("The course could not be loaded. Please refresh the page to try again.")
        }
    }

    /**************************************************
    
                    HELPER FUNCTIONS
    
    ************************************************** */

    loadPage() {
        
        this.getUser("teacher");
        this.getUser("students");
        this.getUser("ta");
        this.getPostings();
    }

    handleChange(e){
        let name = e.target.name;
        let value = e.target.value;

        this.setState({ [name]: value });
    }

    fileChange(event) {
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
        })
    }

    onChangeDate = date => this.setState({ postDate: date })

    handleCompare(event) {
        if(this.state.toCompare.includes(event.target.name)) {
            let removed = this.state.toCompare.filter(function(e) { if(e.localeCompare(event.target.name) !== 0) {return e} })
            this.setState({
                toCompare: removed
            })
        } else {
            let joined = this.state.toCompare.concat(event.target.name);
            this.setState({
                toCompare: joined
            })
        }
    }

    handleClose() {
        this.setState({
            show: false,
            modalFor: null,
            selectId: null,
            submissions: null,
            toCompare: [],
            removeCourse: null
        })
    }

    dateToText(date) {
        var dateText = date.substring(0, 10);
        var timeText = date.substring(11, 19);

        return {date: dateText, time: timeText}
    }

    isTa(courseTa, student) {
        if(courseTa) return courseTa[0]._id.localeCompare(student._id) === 0; 
        return false;
    }

    hasCourse() {
        let hasCourse = false;
        this.state.user.courses.forEach(course_id => {
            //console.log(course_id + " " + this.state.courseId);
            if(course_id.localeCompare(this.state.courseId) === 0) {
                hasCourse = true;
                return hasCourse;
            }
        });
        if(hasCourse) {
            return true;
        } else {
            return false;
        }
    }

    viewSubmissions(curPosting) {
        let subs = null;
        
        if(this.state.submissions !== null) {
            return subs = this.state.submissions.map((element) => 
                <div key={element.studentName}>
                    <hr className={styles.separator}/>
                    <p style={{display:"inline"}}><b>Student:</b> {element.studentName}</p>
                    <label className={styles.studentCheck}>
                        <input
                            type="checkbox"
                            name={element._id}
                            onChange={this.handleCompare}
                        />
                    </label>
                    <p style={{paddingLeft: "20px", margin: "3px"}}><b>Assignment:</b> <a href="">{element.name}</a></p>
                    <p style={{paddingLeft: "20px", margin: "3px"}}><b>Grade:</b> {element.grade === -1 ? "not graded" : element.grade}</p>
                    <p style={{paddingLeft: "20px", margin: "3px"}}><b>Submitted:</b> {this.dateToText(element.date).date} {this.dateToText(element.date).time} {this.isLate(element.date, curPosting.due_date)}</p>
                    
                </div>
            ); 
        } else { return null}
    }

    getFile(assignment_id, filename) {
        fetch(`/api/postings/getFile/${assignment_id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        }).then(response => {
            response.json().then(data => {
                
                //return 'data:text/plain;charset=utf-8,' + data;
            })
            
        }).catch(err => {
            console.log('caught it!',err);
            return null
        });
    }

    isLate(subDate, dueDate) {
        let sub = new Date(subDate.substr(0,16))
        let due = new Date(dueDate.substr(0,16))


        if(sub.getFullYear() <= due.getFullYear() && sub.getMonth() <= due.getMonth() && sub.getDate() < due.getDate()) {
            return(
                <b style={{ color:"green" }}>ON TIME</b>
            )
        }
        else if(sub.getFullYear() == due.getFullYear() && sub.getMonth() == due.getMonth() && sub.getDate() == due.getDate() && sub.getHours() <= due.getHours() && sub.getMinutes() < due.getMinutes()) {
            return(
                <b style={{ color:"green" }}>ON TIME</b>
            )
        }

        else {
            return(
            <b style={{ color:"red" }}>LATE</b>
            )
        }
    }

    renderCompareButton(toCompare) {
        if(toCompare.length === 2 || toCompare.length === 1) {
            return (
                <Fragment>
                    <p className={styles.note}>*check 2 students to compare, check one student to find best match</p>
                    <Button style={{float:"right", width: "100%"}} variant="primary" onClick={this.handleSubmitCompare}>Check Plagiarism</Button> 
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <p className={styles.note}>*check 2 students to compare, check one student to find best match</p>
                    <Button style={{float:"right", width: "100%"}} variant="primary" disabled>Check Plagiarism</Button> 
                </Fragment>
            );
        }
    }

    isInClass(studentId, allStudents) {
        if(allStudents && allStudents.length !== 0) {
            return allStudents.includes(studentId);
        } else {
            return false;
        }
    }

    renderDetailModal() {
        if(this.state.modalFor === "postings") {
            let curPosting = null;
            for (let i in this.state.postings) {
                if(this.state.postings[i]._id == this.state.selectId) {
                    curPosting = this.state.postings[i];
                    break;
                }
            }

            if((this.state.user.type == "Teacher" || this.isTa(this.state.ta, this.state.user)) && this.state.submissions === null) this.getSubmissions(curPosting._id);

            return (
                <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={this.state.show && this.state.modalFor === "postings"} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title className={styles.modalTitle}>Assignment Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <div>
        
                        <p style={{textAlign: "center"}}><b>Name</b><br/>{curPosting.name}</p>
        
                        <p style={{textAlign: "center"}}><b>Description</b><br/>{curPosting.description}</p>
                    
                        <p style={{textAlign: "center"}}><b>Due Date:</b><br/>{this.dateToText(curPosting.due_date).date} {this.dateToText(curPosting.due_date).time}</p>
                        
                        {this.state.user.type === "Student" && !this.isTa(this.state.ta, this.state.user) && this.isInClass(this.state.user._id, this.state.course.students)? 
                            <Fragment>
                            <hr/>
                            <p style={{margin: "20px 0"}}> <b>Submit Assignment</b></p>
                            <form>
                                <label className={styles.formLabel}>Upload file:  </label>
                                <input className={styles.inputText}type="file" name="file" onChange={this.fileChange} ref={this.fileInput} />
                            </form><br/>
                            </Fragment>
                        : null }
                        {this.state.user.type === "Teacher" || this.isTa(this.state.ta, this.state.user)? <Fragment><hr/><h1 className={styles.modalTitle}>Student Submissions</h1>{this.viewSubmissions(curPosting)}</Fragment> : null}
                    </div>
                    </Modal.Body>
                    <Modal.Footer className={styles.modalFooter}>
                        {this.state.user.type === "Teacher" || this.isTa(this.state.ta, this.state.user)? this.renderCompareButton(this.state.toCompare) : this.renderSubmit(this.isInClass(this.state.user._id, this.state.course.students))} 
                    </Modal.Footer>
                </Modal>
            );
        }
    }

    renderSubmit(isInClass) {
        return isInClass ? <Button style={{width: "100%"}} variant="primary" onClick={this.handleSubmit}>Submit</Button> : <Button style={{width: "100%"}} variant="primary" disabled>Add Class to Submit</Button>
    }

    renderCreateModal() {
        if(this.state.modalFor === "newPost") {
            return(
                <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={this.state.show && this.state.modalFor === "newPost"} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title className={styles.modalTitle}>Create Assignment</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        <Col>
                            <Row>
                                <input className={styles.inputText} placeholder="Assignment Name*" type="text" name="postName" value={this.state.postName} onChange={this.handleChange} />
                            </Row>
                            <Row>
                                <input className={styles.inputText} placeholder="Assignment Description" type="text" name="postDesc" value={this.state.postDesc} onChange={this.handleChange} />
                            </Row>
                            <Row>
                                <label className={styles.formLabel}>Assignment Due Date:</label><br/>
                                <DateTimePicker
                                name="postDate"
                                onChange={this.onChangeDate}
                                value={this.state.postDate}
                                />
                            </Row>
                        </Col>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.createPost}>
                            Create
                        </Button>
                    </Modal.Footer>
                </Modal>
            )
        }
    }

    renderNames(object) {
        let listItems = null;
        if(this.state[object] !== null && this.state[object] != undefined) {
            return listItems = this.state[object].map((item) => 
                <li key={item._id}>
                    <a onClick={event => {
                        this.setState({
                            show: true,
                            modalFor: object,
                            selectId: item._id
                        })
                    }}>{item.name}</a></li>
            )
        } else {
            return <li>No TA</li>;
        }
    }

    renderCreatePostButton() {
        return (
            <Fragment>
                <Button className={styles.addBtn}
                 onClick={event => {
                        this.setState({
                            show: true,
                            modalFor: "newPost"
                        })
                    }}>+</Button>
            </Fragment>
        )
    }
    
    confirmRemoveCourse() {
        let course = this.state.removeCourse;

        if(course !== null) return(
        <Modal size="lg" aria-labelledby="contained-modal-title-vcenter"centered show={course !== null} onHide={this.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title className={styles.modalTitle}>Are you sure you want to remove the following course?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><b>Course name:</b> {course.name}</p>
                <p><b>Course Code:</b> {course.code}</p>
            </Modal.Body>
            
            <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={this.removeCourse.bind(this, course)}>
                    Remove
                </Button>
            </Modal.Footer>
        </Modal>
        );
    }

    /**************************************************
    
                           RENDER
    
    ************************************************** */

    render() {
        if(this.state.course !== null && this.state.loading == 5) {
            return (
                <Fragment>
                    <div className={styles.bgHeader}>
                        <div className={styles.courseInfo}>
                            <h3 className={styles.courseName}>{this.state.courseName}</h3>
                            <h5 className={styles.courseCode}><b>Code:</b> {this.state.course.code}</h5>
                        </div>
                    </div>
                    <Container>
                        <Row xs={12}>
                            <Col xs={6}>
                                <p><b>Teacher:</b></p> <ul>{this.renderNames("teacher")}</ul>
                                <p><b>Ta:</b></p><ul>{this.renderNames("ta")}</ul>
                                <p><b>Students:</b></p><ul>{this.renderNames("students")}</ul>
                            </Col> 
                            <Col xs={6}>
                                <p><b>Assignments:</b> {this.state.user.type === "Teacher" && this.hasCourse()? this.renderCreatePostButton() : null}</p>
                                <ul className={styles.listItem}>{this.renderNames("postings")}</ul>
                            </Col>
                        </Row>
                        <Row xs={12}>{this.state.user.type === "Student" ? 
                            (this.hasCourse() && <Button style={{margin: "auto"}} variant="danger" onClick={event => this.setState({removeCourse: this.state.course})}>Remove Course</Button>) ||
                            (!this.hasCourse() && <Button style={{margin: "auto"}} variant="primary" onClick={event => this.addCourse(this.state.course)}>Add Course</Button>) :
                            this.hasCourse() && <Button style={{margin: "auto"}} variant="danger" onClick={event => this.setState({removeCourse: this.state.course})}>Delete Course</Button>
                        }</Row>
                    </Container>  

                    {this.renderDetailModal()}
                    {this.renderCreateModal()}
                    {this.confirmRemoveCourse()}

                </Fragment>
            );
        } else {
            return (
                <div className={styles.loading}>
                    <ReactLoading type={"bubbles"} color={"#f3abcb"} height={'20%'} width={'20%'} />
                </div>
            )
        }
    }

    /**************************************************
    
                           API CALLS
    
    ************************************************** */

    //get course we're trying to load
    getCourse() {
        let course = {
            id: this.state.courseId
        }
    
        return fetch('/api/courses/find', {
            method: "POST",
            body: JSON.stringify(course),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        }).then(response => {
            response.json().then(data => {
                this.setState({
                    course: data,
                    loading: this.state.loading + 1
                })
                this.loadPage();
            })
        }).catch(err => {
            console.log('caught it!',err);
        });
    }

    //get users from IDs references in this course
    getUser(user) {
        if(this.state.course[user] !== null) {
            let list = null;
            if(this.state.course[user].length <= 2) {
                list = {
                    user_ids: this.state.course[user]
                }
            } else {
                list = {
                    user_ids: [this.state.course[user]]
                }
            }

            fetch('/api/users/find-user', {
                method: "POST",
                body: JSON.stringify(list),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            }).then(response => {
                response.json().then(data => {
                    this.setState({
                        [user]: data,
                        loading: this.state.loading + 1
                    });
                })
            }).catch(err => {
                console.log('caught it!',err);
            })
        } else {
            this.setState({
                teacher: "Unassigned",
                loading: this.state.loading + 1
            })
        }
    }

    //get postings from IDs referenced in this course
    getPostings() {
        if(this.state.course.postings !== null) {
            let coursePostings = {
                posting_ids: this.state.course.postings
            }
            fetch('/api/postings/course-postings', {
                method: "POST",
                body: JSON.stringify(coursePostings),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            }).then(response => {
                response.json().then(data => {
                    this.setState({
                        postings: data,
                        loading: this.state.loading + 1
                    })
                })
                
            }).catch(err => {
                console.log('caught it!',err);
            });
        } else {
            this.setState({
                postings: "No postings yet",
                loading: this.state.loading + 1
            })
        }
    }

        //adds course to user's list of courses
    addCourse(course) {
        if(!this.state.user.courses.includes(this.state.courseId)) {
            let addedCourse = {
                name: course.name,
                user: this.state.user
            } 

            fetch('/api/courses/add', {
                method: "POST",
                body: JSON.stringify(addedCourse),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            }).then(response => {
                if(!response.ok) {
                    console.log("error: " + response.data);
                } else {
                    response.json().then(data => {
                        this.props.handleUpdate(data.user);
                        window.location.reload(false);
                    })
                }
            }).catch(err => {
                console.log('caught it!',err);
                this.handleClose();
            });
        } else {
            alert("course already added")
            this.handleClose();
        }
    }


    //create a new post given name, description, and date
    createPost() {
        if(this.state.postName !== '' && this.state.postDesc !== '' && this.state.postDate !== null) {
            let month = this.state.postDate.getMonth() < 10 ? "0"+ (this.state.postDate.getMonth()+1) : (this.state.postDate.getMonth()+1);
            let day = this.state.postDate.getDate() < 10 ? "0"+this.state.postDate.getDate() : this.state.postDate.getDate();
            let hours = this.state.postDate.getHours() < 10 ? "0"+this.state.postDate.getHours() : this.state.postDate.getHours();
            let minutes = this.state.postDate.getMinutes() < 10 ? "0"+this.state.postDate.getMinutes() : this.state.postDate.getMinutes();

            let postDate = this.state.postDate.getFullYear() + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":00Z";

            let newPost = {
                name: this.state.postName,
                course: this.state.course._id,
                description: this.state.postDesc,
                date: postDate
            }

            fetch('/api/postings/new', {
                method: "POST",
                body: JSON.stringify(newPost),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            }).then(response => {
                response.json().then(data => {
                    var join = this.state.postings.concat(data.post);
                    this.setState({
                        course: data.course,
                        postings: join
                    })
                    this.handleClose();
                })
            }).catch(err => {
                console.log('caught it!',err);
            });
        } else {
            alert("missing field")
        }
    }

    //submit file
    handleSubmit(event) {
        event.preventDefault();

        const data = new FormData();
        data.append('file', this.state.selectedFile);
        data.append('student_id', this.state.user._id);
        data.append('student_name', this.state.user.name);
        data.append('posting_id', this.state.selectId);

        fetch('/api/postings/submit', {
                method: "POST",
                body: data,

            }).then(response => {
                if(response.ok) {
                    alert("Assignment successfully uploaded");
                    this.handleClose();
                } else {
                    alert(response);
                    this.handleClose();
                }   
            }).catch(err => {
                console.log('caught it!',err);
                alert("An error occured. Please make to select a file before uploading.");
            }); 
    }

    //get submissions of course we're trying to load
    getSubmissions(curPosting) { 
        return fetch(`/api/postings/submissions/${curPosting}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        }).then(response => {
            response.json().then(data => {
                this.setState({
                    submissions: data
                })
            })
        }).catch(err => {
            console.log('caught it!',err);
            return null;
        });
    }

    handleSubmitCompare() {
        //console.log(JSON.stringify(this.state.submissions) + " " + this.state.submissions.length);
        if(!(this.state.submissions.length === 1 && this.state.toCompare.length === 1)) {
            let files = {};
            if(this.state.toCompare.length == 2) {
                files = {
                    first: this.state.toCompare[0],
                    second: this.state.toCompare[1]
                }
            } else if(this.state.submissions.length == 2) {
                files = {
                    first: this.state.submissions[0]._id,
                    second: this.state.submissions[1]._id
                }
            } else{
                files = {
                    first: this.state.toCompare[0],
                    second: this.state.submissions
                }
            }

            fetch('/api/postings/plagiarism-check', {
                    method: "POST",
                    body: JSON.stringify(files),
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    }
                }).then(response => {
                    response.json().then(data => {
                        alert(data.message)
                    })
                }).catch(err => {
                    console.log('caught it!',err);
                }); 
        } else {
            alert("Error: Cannot check for plagiarism with only one submission");
        }
    }

    //removes course
     removeCourse(course) {
        let data = {
            course: course,
            user: this.state.user
        }
         fetch('/api/courses/remove', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        }).then(response => {
            if(!response.ok) {
                console.log("error: " + response.data);
            } else {
                response.json().then(data => {
                    
                    if(this.state.user.type === "Teacher") {
                        var updatedCourses = this.state.user.courses.filter(function(e) {if(e.toString().localeCompare(course._id) !== 0) {return e}})
                        var updatedUser = this.state.user;
                        updatedUser.courses = updatedCourses;
                        this.props.handleUpdate(updatedUser);
                        this.props.history.push({
                            pathname: '/dashboard'
                        });
                    } else {
                        var updatedCourses = this.state.user.courses.filter(function(e) {if(e.toString().localeCompare(course._id) !== 0) {return e}})
                        var updatedUser = this.state.user;
                        updatedUser.courses = updatedCourses;
                        this.props.handleUpdate(updatedUser);
                        window.location.reload(false);
                    }
                })
            }
        }).catch(err => {
            console.log('caught it!',err);
        });

    }
}

export default withRouter(CoursePage);
