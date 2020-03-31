import React, {Fragment} from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Modal, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import DateTimePicker from 'react-datetime-picker';

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
            postDate: new Date()

        }

        this.getTeacher = this.getTeacher.bind(this);
        this.getPostings = this.getPostings.bind(this);
        this.getStudents = this.getStudents.bind(this);
        this.getTa = this.getTa.bind(this);
        this.getCourse = this.getCourse.bind(this);
        this.renderNames = this.renderNames.bind(this);
        this.renderModalBody = this.renderModalBody.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.fileInput = React.createRef();
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.renderCreatePostButton = this.renderCreatePostButton.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.createPost = this.createPost.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.setUp = this.setUp.bind(this);

    }

    componentWillMount() {
        if(this.state.courseId !== null && this.state.courseId !== undefined) {
            this.getCourse();
        } else {
            console.log("course is null");
        }
    }

    setUp() {
        this.getTeacher();
        this.getPostings();
        this.getStudents();
        this.getTa();
    }

    getCourse() {
        if(this.state.courseId !== null) {
            let course = {
                id: this.state.courseId
            }
        
            fetch('http://localhost:5000/api/courses/find', {
                method: "POST",
                body: JSON.stringify(course),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            }).then(response => {
                if(!response.ok) {
                    console.log("AFTER API CALL FOR COURSES: " + response.data);
                    return false;
                } else {
                    response.json().then(data => {
                        console.log("Successful" + JSON.stringify(data));
                        this.setState({
                            course: data,
                            loading: this.state.loading + 1
                        })

                        this.setUp();
                    })
                    return true;
                }
            }).catch(err => {
                console.log('caught it!',err);
            });
        } else {
            this.setState({
                course: "Unassigned",
                loading: this.state.loading + 1
            })
        }
    }

    getTeacher() {
        if(this.state.course.teacher !== null) {
            let courseTeacher = {
                user_ids: [this.state.course.teacher]
            }
        
            fetch('http://localhost:5000/api/users/find-user', {
                method: "POST",
                body: JSON.stringify(courseTeacher),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            }).then(response => {
                if(!response.ok) {
                    console.log("AFTER API CALL FOR COURSES: " + response.data);
                    return false;
                } else {
                    response.json().then(data => {
                        console.log("Successful" + JSON.stringify(data));
                        this.setState({
                            teacher: data[0],
                            loading: this.state.loading + 1
                        })
                    })
                    return true;
                }
            }).catch(err => {
                console.log('caught it!',err);
            });
        } else {
            this.setState({
                teacher: "Unassigned",
                loading: this.state.loading + 1
            })
        }
    }

    handleChange(e){
        let name = e.target.name;
        let value = e.target.value;

        this.setState({ [name]: value });
    }

    getPostings() {
        console.log("getting posts",this.state.course.postings);
        if(this.state.course.postings !== null) {
            let coursePostings = {
                posting_ids: this.state.course.postings
            }
            console.log("before api request " + JSON.stringify(coursePostings));
            fetch('http://localhost:5000/api/postings/course-postings', {
                method: "POST",
                body: JSON.stringify(coursePostings),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            }).then(response => {
                if(!response.ok) {
                    console.log("AFTER API CALL FOR COURSES: " + response.data);
                    return false;
                } else {
                    response.json().then(data => {
                        console.log("Successful" + JSON.stringify(data));
                        this.setState({
                            postings: data,
                            loading: this.state.loading + 1
                        })
                    })
                    return true;
                }
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

    getStudents() {
        if(this.state.course.students !== null) {
            let courseStudents = {
                user_ids: this.state.course.students
            }
            console.log("before api request " + JSON.stringify(courseStudents));
            fetch('http://localhost:5000/api/users/find-user', {
                method: "POST",
                body: JSON.stringify(courseStudents),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            }).then(response => {
                if(!response.ok) {
                    console.log("AFTER API CALL FOR COURSES: " + response.data);
                    return false;
                } else {
                    response.json().then(data => {
                        console.log("Successful" + JSON.stringify(data));
                        this.setState({
                            students: data,
                            loading: this.state.loading + 1
                        })
                    })
                    return true;
                }
            }).catch(err => {
                console.log('caught it!',err);
            });
        } else {
            this.setState({
                students: "No students yet",
                loading: this.state.loading + 1
            })
        }
    }

    getTa() {
        if(this.state.course.ta !== null) {
            let courseTas = {
                user_ids: this.state.course.ta
            }
            console.log("before api request " + JSON.stringify(courseTas));
            fetch('http://localhost:5000/api/users/find-user', {
                method: "POST",
                body: JSON.stringify(courseTas),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            }).then(response => {
                if(!response.ok) {
                    console.log("AFTER API CALL FOR COURSES: " + response.data);
                    return false;
                } else {
                    response.json().then(data => {
                        console.log("Successful" + JSON.stringify(data));
                        this.setState({
                            ta: data,
                            loading: this.state.loading + 1
                        })
                    })
                    return true;
                }
            }).catch(err => {
                console.log('caught it!',err);
            });
        } else {
            this.setState({
                teacher: "Unassigned",
                loading: this.state.loading + 1
            })
        }
    }

    renderModalBody() {
        console.log("first", this.state.selectId);
        let curPosting = null;
        for (let i in this.state.postings) {
            if(this.state.postings[i]._id == this.state.selectId) {
                curPosting = this.state.postings[i];
                console.log(this.state.postings[i]);
                break;
            }
        }

        if(this.state.modalFor === "postings") {
            return (
                <Col>
                    <Row>
                        <h3>Posting name:</h3>
                        <p>{curPosting.name}</p>
                    </Row>
                    <Row>
                        <h3>Posting description:</h3>
                        <p>{curPosting.description}</p>
                    </Row>
                    <Row>
                        <h3>Posting due date:</h3>
                        <p>{curPosting.due_date}</p>
                    </Row>
                    {this.state.user.type === "student" ? 
                    <Row>
                        <h3>Submit assignment:</h3>
                        <form onSubmit={this.handleSubmit}>
                            <label>
                            Upload file:
                            <input type="file" name="file" onChange={this.onChangeHandler} ref={this.fileInput} />
                            </label>
                            <br />
                            <button type="submit">Submit</button>
                        </form>
                    </Row> 
                    : null }
                </Col>
            );
        } else {
            return (
                <Col>
                    <Row>
                        <label>Posting name: </label>
                        <input type="text" name="postName" value={this.state.postName} onChange={this.handleChange} />
                    </Row>
                    <Row>
                        <label>Posting description: </label>
                        <input type="text" name="postDesc" value={this.state.postDesc} onChange={this.handleChange} />
                    </Row>
                    <Row>
                        <label>Posting due date:</label>
                        <DateTimePicker
                        name="postDate"
                        onChange={this.onChangeDate}
                        value={this.state.postDate}
                        />
                    </Row>
                </Col>
            )
        }
    }

    onChangeHandler(event) {
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        alert(
            this.fileInput.current.files[0].name
        );

        const data = new FormData()
        data.append('file', this.state.selectedFile);
        data.append('student_id', this.state.user._id);
        data.append('student_name', this.state.user.name);
        data.append('posting_id', this.state.selectId);

        console.log(data);

        axios.post("http://localhost:5000/api/postings/submit", data, { 
        })
        .then(res => { 
            console.log(res.statusText)
        })
    }

    renderNames(object) {
        console.log("rendering " + object + ": " +  this.state[object])
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
            return listItems = <h1>This course does not have any {object} yet!</h1>;
        }
    }

    renderCreatePostButton() {
        return (
            <Fragment>
                <Button onClick={event => {
                        this.setState({
                            show: true,
                            modalFor: "newPost"
                        })
                    }}>Create New Posting</Button>
            </Fragment>
        )
    }

    handleClose() {
        this.setState({
            show: false,
            modalFor: null,
            selectId: null
        })
    }

    createPost() {
        if(this.state.postName !== '' && this.state.postDesc !== '' && this.state.postDate !== null) {
            let newPost = {
                name: this.state.postName,
                course: this.state.course._id,
                description: this.state.postDesc,
                date: this.state.postDate
            }
            console.log("before api request " + JSON.stringify(newPost));
            fetch('http://localhost:5000/api/postings/new', {
                method: "POST",
                body: JSON.stringify(newPost),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            }).then(response => {
                if(!response.ok) {
                    console.log("AFTER API CALL FOR COURSES: " + response.data);
                    return false;
                } else {
                    response.json().then(data => {
                        console.log("Successful" + JSON.stringify(data));

                        var join = this.state.postings.concat(data.post);
                        this.setState({
                            course: data.course,
                            postings: join
                        })

                        this.handleClose();
                    })
                    return true;
                }
            }).catch(err => {
                console.log('caught it!',err);
            });
        } else {
            alert("missing field")
        }
    }

    onChangeDate = date => this.setState({ postDate: date })
    
    render() {
        {console.log("course page: ",JSON.stringify(this.state.loading))}
        if(this.state.course !== null && this.state.loading == 5) {
            return (
                <Fragment>
                    <div>
                        <h1>Course: {this.state.courseName}</h1>
                        <h1>Course Code: {this.state.course.code}</h1>
                        <h1>Teacher: {this.state.teacher.name}</h1>
                        <h1>Postings: <br/><ul>{this.renderNames("postings")}</ul></h1>
                        <h1>Students: <br/><ul>{this.renderNames("students")}</ul></h1>
                        <h1>Ta: <br/><ul>{this.renderNames("ta")}</ul></h1>
                    </div>    

                    {this.state.user.type === "Teacher" ? this.renderCreatePostButton() : null}

                     <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={this.state.show && this.state.modalFor === "postings"} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Posting details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-center">
                            {this.state.show && this.renderModalBody()}
                        </Modal.Body>
                        
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={this.state.show && this.state.modalFor === "newPost"} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Posting details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-center">
                            {this.state.show && this.renderModalBody()}
                        </Modal.Body>
                        
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.createPost}>
                                Create
                            </Button>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                </Fragment>
            );
        } else if(this.state.course === null) {
            return (
                <h1>The course could not be loaded</h1>
            );
        } else {
            return (
                <h1>Loading...</h1>
            )
        }
    }
}

export default withRouter(CoursePage);
