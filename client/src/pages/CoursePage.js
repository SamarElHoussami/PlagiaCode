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
        this.renderCompareButton = this.renderCompareButton.bind(this);

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

    dateToText(date) {
        var dateText = date.substring(0, 10);
        var timeText = date.substring(11, 19);

        return {date: dateText, time: timeText}
    }

    viewSubmissions(curPosting) {
        let subs = null;
        
        if(this.state.submissions !== null) {
            {console.log(this.state.submissions)}
            return subs = this.state.submissions.map((element) => 
                <div key={element.studentName}>
                    <hr className={styles.separator}/>
                    <p style={{display:"inline"}}><b>Student:</b> {element.studentName}</p>
                    <label className={styles.studentCheck}>
                        <input
                            type="checkbox"
                            name={element.filePath}
                            onChange={this.handleCompare}
                        />
                    </label>
                    <p><b>Assignment:</b> <a href={element.filePath}>{element.name}</a></p>
                    <p><b>Grade:</b> {element.grade === -1 ? "not graded" : element.grade}</p>
                    <p><b>Submitted:</b> {this.dateToText(element.date).date} {this.dateToText(element.date).time} {this.isLate(element.date, curPosting.due_date)}</p>
                    
                </div>
            ); 
        } else { return null}
    }

    isLate(subDate, dueDate) {
        return(
            <b style={{ color:"red" }}>LATE</b>
        )
    }

    renderCompareButton(toCompare) {
        if(toCompare.length === 2) {
            return (
                <Fragment>
                    <p className={styles.note}>*check 2 students to enable</p>
                    <Button style={{float:"right"}} variant="primary" onClick={this.handleSubmitCompare}>Check Plagiarism</Button> 
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <p className={styles.note}>*check 2 students to enable</p>
                    <Button style={{float:"right"}} variant="primary" disabled>Check Plagiarism</Button> 
                </Fragment>
            );
        }
    }

    handleSubmitCompare() {

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
                        <Modal.Title className={styles.modalTitle}>Assignment Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <div>
        
                        <p><b>Assignmet Name:</b> {curPosting.name}</p>
        
                        <p><b>Assignment Description:</b><br/>{curPosting.description}</p>
                    
                        <p><b>Assignment Due Date:</b><br/>{this.dateToText(curPosting.due_date).date} {this.dateToText(curPosting.due_date).time}</p>
                        
                        {this.state.user.type === "Student" ? 
                            <Fragment>
                            <p><b>Submit Assignment</b></p>
                            <form onSubmit={this.handleSubmit}>
                                <label className={styles.formLabel}>Upload file:  </label>
                                <input className={styles.inputText}type="file" name="file" onChange={this.fileChange} ref={this.fileInput} />
                                <button type="submit">Submit</button>
                            </form><br/>
                            </Fragment>
                        : null }
                        <hr/>
                        {this.state.user.type === "Teacher" ? <Fragment><h1 className={styles.modalTitle}>Student Submissions</h1>{this.viewSubmissions(curPosting)}</Fragment> : null }
                    </div>
                    </Modal.Body>
                    <Modal.Footer className={styles.modalFooter}>
                        {this.state.user.type === "Teacher" ? this.renderCompareButton(this.state.toCompare) : null} 
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
    

    /**************************************************
    
                           RENDER
    
    ************************************************** */

    render() {
        if(this.state.course !== null && this.state.loading == 5) {
            return (
                <Fragment>
                    <Container>
                        <Row xs={12}>
                            <h1 className={styles.pageTitle}>Course Info</h1>
                        </Row>
                        <hr/>
                        <Row xs={12}>
                        <Col xs={6}>
                        
                            <p><b>Course Name:</b> {this.state.courseName}</p>
                            <p><b>Course Code:</b> {this.state.course.code}</p>
                            <p><b>Teacher:</b></p> {this.renderNames("teacher")}
                            <p><b>Students:</b></p><ul>{this.renderNames("students")}</ul>
                            <p><b>Ta:</b></p><ul>{this.renderNames("ta")}</ul>
                        </Col> 
                        <Col xs={6}>
                            <p><b>Assignments:</b> {this.state.user.type === "Teacher" ? this.renderCreatePostButton() : null}</p>
                            <ul className={styles.listItem}>{this.renderNames("postings")}</ul>
                        </Col>
                        </Row>

                    </Container>  

                    {this.renderDetailModal()}
                    {this.renderCreateModal()}

                </Fragment>
            );
        } else {
            return (
                <div className={styles.loading}>
                    <ReactLoading type={"bars"} color={"#333a41"} height={'20%'} width={'20%'} />
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
