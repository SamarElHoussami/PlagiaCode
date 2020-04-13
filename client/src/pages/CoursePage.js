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
            postDate: new Date(),
            toCompare: [],
            submissions: null

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
        let joined = this.state.toCompare.concat(event.name);
        this.setState({
            toCompare: joined
        })
    }

    handleClose() {
        this.setState({
            show: false,
            modalFor: null,
            selectId: null,
            submissions: null
        })
    }
    viewSubmissions(curPosting) {
        let subs = null;
        
        if(this.state.submissions !== null) {
            {console.log(this.state.submissions)}
            return subs = this.state.submissions.map((element) => 
                <div key={element.studentName}>
                    <p>Student: {element.studentName}<br/>Assignment: <a href={element.filePath}>{element.name}</a></p><br/>
                    <p>Grade: {element.grade === -1 ? "not graded" : element.grade}</p><br/>
                    <p>Submitted: {element.date} {this.isLate(element.date, curPosting.due_date)}</p>
                    <label>
                        <input
                            type="checkbox"
                            name={element.filePath}
                            onChange={this.handleCompare}
                        />
                    </label>
                    
                </div>
            ); 
        } else { return null}
    }

    isLate(subDate, dueDate) {
        return(
            <b style={{ color:"red" }}>LATE</b>
        )
    }

    renderDetailModal() {
        if(this.state.modalFor === "postings") {
            console.log(this.state.postings);
            let curPosting = null;
            for (let i in this.state.postings) {
                if(this.state.postings[i]._id == this.state.selectId) {
                    curPosting = this.state.postings[i];
                    console.log(this.state.postings[i]);
                    break;
                }
            }

            if(this.state.user.type == "Teacher" && this.state.submissions === null) this.getSubmissions(curPosting._id);

            return (
                <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={this.state.show && this.state.modalFor === "postings"} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Posting details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                    <div>
        
                        <h3>Posting name:</h3><br/>
                        <p>{curPosting.name}</p><br/>
        
                        <h3>Posting description:</h3><br/>
                        <p>{curPosting.description}</p><br/>
                    
                        <h3>Posting due date:</h3><br/>
                        <p>{curPosting.due_date}</p><br/>
                        
                        {this.state.user.type === "Student" ? 
                            <Fragment>
                            <h3>Submit assignment:</h3><br/>
                            <form onSubmit={this.handleSubmit}>
                                <label>Upload file:  </label>
                                <input type="file" name="file" onChange={this.fileChange} ref={this.fileInput} />
                                <button type="submit">Submit</button>
                            </form><br/>
                            </Fragment>
                        : null }
                        <hr/>
                        {this.state.user.type === "Teacher" ? this.viewSubmissions(curPosting) : null }
                    </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            );
        }
    }

    renderCreateModal() {
        if(this.state.modalFor === "newPost") {
            return(
                <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={this.state.show && this.state.modalFor === "newPost"} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Posting details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
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
            )
        }
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
    

    /**************************************************
    
                           RENDER
    
    ************************************************** */

    render() {
        if(this.state.course !== null && this.state.loading == 5) {
            return (
                <Fragment>
                    <div>
                        <h1>Course: {this.state.courseName}</h1>
                        <h1>Course Code: {this.state.course.code}</h1>
                        <h1>Teacher: {this.renderNames("teacher")}</h1>
                        <h1>Postings: <br/><ul>{this.renderNames("postings")}</ul></h1>
                        <h1>Students: <br/><ul>{this.renderNames("students")}</ul></h1>
                        <h1>Ta: <br/><ul>{this.renderNames("ta")}</ul></h1>
                    </div>    

                    {this.state.user.type === "Teacher" ? this.renderCreatePostButton() : null}
                    {this.renderDetailModal()}
                    {this.renderCreateModal()}

                </Fragment>
            );
        } else {
            return (
                <h1>Loading...</h1>
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
    
        return fetch('http://localhost:5000/api/courses/find', {
            method: "POST",
            body: JSON.stringify(course),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        }).then(response => {
            response.json().then(data => {
                console.log("Successful" + JSON.stringify(data));
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
        console.log(this.state.course[user]);
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

            console.log(JSON.stringify(list));

            fetch('http://localhost:5000/api/users/find-user', {
                method: "POST",
                body: JSON.stringify(list),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            }).then(response => {
                response.json().then(data => {
                    console.log("Successful" + JSON.stringify(data));
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
            console.log("before api request " + JSON.stringify(coursePostings));
            fetch('http://localhost:5000/api/postings/course-postings', {
                method: "POST",
                body: JSON.stringify(coursePostings),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            }).then(response => {
                response.json().then(data => {
                    console.log("Successful" + JSON.stringify(data));
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

    //create a new post given name, description, and date
    createPost() {
        if(this.state.postName !== '' && this.state.postDesc !== '' && this.state.postDate !== null) {
            let newPost = {
                name: this.state.postName,
                course: this.state.course._id,
                description: this.state.postDesc,
                date: this.state.postDate
            }

            fetch('http://localhost:5000/api/postings/new', {
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

        const data = new FormData()
        data.append('file', this.state.selectedFile);
        data.append('student_id', this.state.user._id);
        data.append('student_name', this.state.user.name);
        data.append('posting_id', this.state.selectId);

        console.log(data);

        axios.post("http://localhost:5000/api/postings/submit", data, { 
        }).then(res => { 
            console.log(res.statusText);
            this.handleClose();
        }).catch(err => alert("An error occured. Please make to select a file before uploading."));
    }

    //get submissions of course we're trying to load
    getSubmissions(curPosting) { 
        console.log(curPosting);
        return fetch(`http://localhost:5000/api/postings/submissions/${curPosting}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        }).then(response => {
            response.json().then(data => {
                console.log("Successful" + JSON.stringify(data));
                this.setState({
                    submissions: data
                })
            })
        }).catch(err => {
            console.log('caught it!',err);
            return null;
        });
    }
}

export default withRouter(CoursePage);
