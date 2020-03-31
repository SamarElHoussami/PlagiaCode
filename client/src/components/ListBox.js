import React, {Fragment} from "react";
import { Button, Modal } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class ListBox extends React.Component {
    constructor(props) {
        super(props);

        console.log(JSON.stringify(props));
        this.state = {
            user: JSON.parse(localStorage.getItem('user')),
            type: props.type,
            list: props.type === "courses" ? JSON.parse(localStorage.getItem('user')).courses : JSON.parse(localStorage.getItem('user')).ta, //course IDs
            myCourseNames: null, //course names
            allCourses: null,
            show: false,
            modalFor: null,
            courseOpts: null,
            selectValue: 0,
            allStudents: null,
            studentOpts: null,
            loading: 0,
            courseName: '',
            courseCode: '',
            courseTa: 0
        }

        this.getCourses = this.getCourses.bind(this);
        this.getStudents = this.getStudents.bind(this);
        this.handleShowStudent = this.handleShowStudent.bind(this);
        this.handleShowTeacher = this.handleShowTeacher.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderOpts = this.renderOpts.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.getObjFromName = this.getObjFromName.bind(this);

    }

    componentWillMount() {
        this.getCourses(); 
        this.renderOpts();
        this.getStudents();
    }
    /*const type = props.type; //either course, user, or posting
    TODO: display title, list of links depending on type of list

    for course:
        add btn on top right brings you to search page for courses (or lets you search for courses from search bar? or predefined drop list)
        every coourse has delete btn
        every course links opens modal of course info or course page for it

    for user: shows user info (teacher or student) like courses they're taking and teaching

*/
    // input: course IDs
    // output: course names
    getCourses() {
        let userCourses = {
            [this.state.type]: this.state.list
        }
        console.log("before api request " + JSON.stringify(userCourses));
        fetch('http://localhost:5000/api/courses/my-courses', {
            method: "POST",
            body: JSON.stringify(userCourses),
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
                        myCourseNames: data,
                        loading: this.state.loading + 1
                    })
                })
                return true;
            }
        }).catch(err => {
            console.log('caught it!',err);
        });
    }

    renderList() {
        let listItems = null;
        if(this.state.myCourseNames !== null && this.state.myCourseNames != undefined) {
            return listItems = this.state.myCourseNames.map((courseName) => 
                <li key={courseName}>
                    <a onClick={event => {
                        var courseObj = this.getObjFromName(courseName, this.state.allCourses);
                        this.props.history.push({
                            pathname: `/courses/${courseName}`,
                            state: { 
                                courseName: courseName, //send course object as prop
                                course: courseObj
                            }
                        });
                    }}>{courseName}</a></li>
            )
        } else {
            return listItems = "No Courses Yet! Add a course! ";
        }
    }

    getObjFromName(name, list) {
        for(var item in list) {
            if(list[item].name == name) {
                console.log(JSON.stringify(list[item]) + " matched");
                return list[item];
            }
        }

        return null;
    }

    handleShowStudent() {
        this.setState({
            show: true,
            modalFor: "student"
        })
    }

    handleShowTeacher() {
        this.setState({
            show: true,
            modalFor: "Teacher"
        })
    }

    handleClose() {
        this.setState({
            show: false,
            modalFor: null
        })
    }

    getStudents() {
        fetch('http://localhost:5000/api/users/students', {
            method: "GET",
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
                    
                    var studentOpts = [];
                    var studentObj = [];

                    if(data.length === 0) {
                        this.setState({
                            studentOpts: <option key={0} value={0}>No students available</option>
                        });
                        return;

                    } else {
                        studentOpts.push(<option key={0} value={0}>Select a student</option>);
                    }

                    for(var i in data) {
                        console.log("students in data: " + JSON.stringify(data[i].name))
                        studentOpts.push(<option key={data[i]._id} value={data[i].name}>{data[i].name}</option>);
                        studentObj.push(data[i]);      
                    }

                    this.setState({
                            studentOpts: studentOpts,
                            allStudents: studentObj,
                            loading: this.state.loading + 1
                    });
                })
                return true;
            }
        }).catch(err => {
            console.log('caught it!',err);
        });
    }

    renderOpts() {
        fetch('http://localhost:5000/api/courses/all', {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        }).then(response => {
            if(!response.ok) {
                console.log("AFTER API CALL FOR COURSES: " + response.data);
            } else {
                response.json().then(data => {
                    console.log("Successful" + JSON.stringify(data));

                    var listOpts = [];
                    var courseObj = [];

                    if(data.length === 0) {
                        this.setState({
                            courseOpts: <option key={0} value={0}>No courses available</option>
                        });
                        return;

                    } else {
                        listOpts.push(<option key={0} value={0}>Select a course</option>);
                    }

                    for(var i in data) {
                        console.log("course in data: " + JSON.stringify(data[i].name))
                        listOpts.push(<option key={data[i]._id} value={data[i].name}>{data[i].name}</option>);
                        courseObj.push(data[i]);      
                    }

                    this.setState({
                            courseOpts: listOpts,
                            allCourses: courseObj,
                            loading: this.state.loading + 1
                    });
                })
            }
        }).catch(err => {
            console.log('caught it!',err);
        });
    }

    handleAdd() {
        if(!this.state.myCourseNames.includes(this.state.selectValue) && this.state.selectValue !== 0) {
       
        let addedCourse = {
            name: this.state.selectValue,
            user: this.state.user
        } 

        fetch('http://localhost:5000/api/courses/add', {
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
                    var joined = this.state.myCourseNames.concat(data.course.name)
                    
                    this.setState({
                        myCourseNames: joined
                    })

                    this.handleClose();
                })
            }
        }).catch(err => {
            console.log('caught it!',err);
            this.handleClose();
        });
        } else {
            console.log("course already added")
            this.handleClose();
        }
    }

    handleChange(e){
        let name = e.target.name;
        let value = e.target.value;

        this.setState({ [name]: value });
    }
    
    handleCreate() {
        let data = {
            name: this.state.courseName,
            code: this.state.courseCode,
            teacher: this.state.user._id,
            ta: this.state.courseTa !== 0 ? this.getObjFromName(this.state.courseTa, this.state.allStudents)._id : ''
        }
         fetch('http://localhost:5000/api/courses/new', {
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
                    this.props.handleUpdate(data.user);
                    var joined = this.state.myCourseNames.concat(data.course.name)

                    this.setState({
                        myCourseNames: joined
                    })
                    
                    this.handleClose();
                })
            }
        }).catch(err => {
            console.log('caught it!',err);
        });

    }

    render() {
        console.log(this.state.loading);
        if(this.state.loading === 3) {
            return (
                <Fragment>  

                    <Button variant="primary" onClick={this.state.user.type=="student" ? this.handleShowStudent : this.handleShowTeacher}>
                        Add course
                    </Button>
                    {this.state.type === "courses" ? "My courses: " : "Courses I TA"}
                    
                    <ul>{this.renderList()}</ul>

                    <Modal size="lg" aria-labelledby="contained-modal-title-vcenter"centered show={this.state.show && this.state.modalFor=="student"} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Select course</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-center">
                            <select name="selectValue" value={this.state.selectValue} onChange={this.handleChange} id='select1'>
                                {this.state.courseOpts}
                            </select>
                        </Modal.Body>
                        
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={this.handleAdd}>
                                Add
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal size="lg" aria-labelledby="contained-modal-title-vcenter"centered show={this.state.show && this.state.modalFor=="Teacher"} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create a new course</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-center">
                            <form>
                                <label>Course name: </label>
                                <input name="courseName" value={this.state.courseName} onChange={this.handleChange}/>
                                <br/>
                                <label>Course code: </label>
                                <input name="courseCode" value={this.state.courseCode} onChange={this.handleChange}/>
                                <br/>
                                <label>Add a TA (optional): </label>
                                 <select name="courseTa" value={this.state.courseTa} onChange={this.handleChange} id='select2'>
                                    {this.state.studentOpts}
                                </select>
                            </form>
                        </Modal.Body>
                        
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={this.handleCreate}>
                                Add
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Fragment>
            )} else {
            return (
                <h1>Loading...</h1>
            )
        }
    }
}

export default withRouter(ListBox);