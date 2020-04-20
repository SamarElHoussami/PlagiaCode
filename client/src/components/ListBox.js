import React, {Fragment} from "react";
import { Button, Modal } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import ReactLoading from 'react-loading';

//style import 
import styles from '../styles/listboxStyle.module.css';

class ListBox extends React.Component {
    constructor(props) {
        super(props);

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
            courseTa: 0,
            renderCourses: true,
            listItems: null,
            editCourses: false,
            removeCourse: null
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
        this.confirmRemoveCourse = this.confirmRemoveCourse.bind(this);
        this.removeCourse = this.removeCourse.bind(this);
        

    }

    /**************************************************
    
                           LIFECYCLE
    
    ************************************************** */

    componentWillMount() {
        this.getCourses(); 
        this.renderOpts();
        this.getStudents();
    }

    /**************************************************
    
                           HELPER FUNCTIONS
    
    ************************************************** */

    renderList() {
        let listItems = null;
        if(this.state.myCourseNames !== null && this.state.myCourseNames != undefined) {
            listItems = this.state.myCourseNames.map((courseName) => 
                <a
                style={this.pickColor()}
                className={styles.listItem} 
                key={courseName}
                name={courseName}
                onClick={event => { 
                    if(!this.state.editCourses) {
                        var courseObj = this.getObjFromName(courseName, this.state.allCourses);
                        this.props.history.push({
                            pathname: `/courses/${courseName}`,
                            state: { 
                                courseName: courseName, //send course object as prop
                                courseId: courseObj._id
                            }
                        });
                    }}
                }
                ><p><b>{courseName}</b> Course Code: {this.getObjFromName(courseName, this.state.allCourses).code}</p><Button variant="danger" style={{display: this.state.editCourses ? "inline" : "none"}} className={styles.rmvBtn} onClick={event => { this.setState({ removeCourse: this.getObjFromName(courseName, this.state.allCourses) })}}>-</Button></a>
            );
            this.setState({
                renderCourses: false,
                listItems: listItems
            });
            return listItems;
        } else {
            return listItems = null;
        }
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

    getObjFromName(name, list) {
        for(var item in list) {
            if(list[item].name == name) {
                return list[item];
            }
        }

        return null;
    }

    handleShowStudent() {
        this.setState({
            show: true,
            modalFor: "Student"
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
            modalFor: null,
            removeCourse: null
        })
    }


    handleChange(e){
        let name = e.target.name;
        let value = e.target.value;

        this.setState({ [name]: value });
    }

    pickColor() {
        var opts = ["rgba(27,218,209,0.3)", "rgba(27,112,218,0.3)", "rgba(30,27,218,0.3)","rgba(197,27,218,0.3)", "rgba(218,27,115,0.3)","rgba(218,27,27,0.3)"];
        var style = {
            backgroundColor: opts[Math.floor((Math.random()*opts.length))],
            backgroundImage: "none"
        }
        return style;
    }

    /**************************************************
    
                           RENDER
    
    ************************************************** */

    render() {
        if(this.state.loading === 3) {
            return (
                <Fragment>  

                    <h1 className={styles.containerTitle}>{this.state.type === "courses" ? "My courses: " : "Courses I TA"}</h1>
                    
                    {this.state.type === "courses" ? 
                    <a className={styles.editCoursesBtn} onClick={event => {
                        this.setState({
                            editCourses: !this.state.editCourses,
                            renderCourses: !this.state.renderCourses
                        })
                    }}>{this.state.editCourses ? "done" : "edit courses"}</a> : null }

                    <div className={styles.listContainer}>
                        {this.state.type == "courses" ? <a className={styles.addBtn} onClick={this.state.user.type=="Student"? this.handleShowStudent : this.handleShowTeacher}>
                        </a>: null}
                        {this.state.renderCourses && this.renderList() || this.state.listItems}
                    </div>

                    <Modal size="lg" aria-labelledby="contained-modal-title-vcenter"centered show={this.state.show && this.state.modalFor=="Student"} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title className={styles.modalTitle}>Add Course</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <label className={styles.formLabel}>Select Course* </label>
                            <select className={styles.inputSelect} name="selectValue" value={this.state.selectValue} onChange={this.handleChange} id='select1'>
                                {this.state.courseOpts}
                            </select>
                        </Modal.Body>
                        
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.handleAdd}>
                                Add
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal size="lg" aria-labelledby="contained-modal-title-vcenter"centered show={this.state.show && this.state.modalFor=="Teacher"} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title className={styles.modalTitle}>Create Course</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <input className={styles.inputText} name="courseName" placeholder="Course Name*" value={this.state.courseName} onChange={this.handleChange}/>
                                <br/>
                                <input className={styles.inputText} placeholder="Course Code*" name="courseCode" value={this.state.courseCode} onChange={this.handleChange}/>
                                <br/>
                                <label className={styles.formLabel}>Add a TA (optional): </label>
                                 <select className={styles.inputSelect} name="courseTa" value={this.state.courseTa} onChange={this.handleChange} id='select2'>
                                    {this.state.studentOpts}
                                </select>
                            </form>
                        </Modal.Body>
                        
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.handleCreate}>
                                Add
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {this.confirmRemoveCourse()}
                </Fragment>
            )} else if(this.state.type === "courses"){
            return (
                <div className={styles.loading}>
                    <ReactLoading type={"bubbles"} color={"#f3abcb"} height={'20%'} width={'20%'} />
                </div>
            )
        } else {
            return null;
        }

    }

    /**************************************************
    
                           API CALLS
    
    ************************************************** */
    
    // input: course IDs
    // output: course names
    getCourses() {
        let userCourses = {
            "courses": this.state.list
        }
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

    //gets all students and renders select input for them
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

    //gets all courses and renders select input for them
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

    //adds course to user's list of courses
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
                        myCourseNames: joined,
                        renderCourses: true
                    })

                    this.handleClose();
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


    //creats new course
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
                    var joinedNames = this.state.myCourseNames.concat(data.course.name);
                    var joinedCourses = this.state.allCourses.concat(data.course);

                    this.setState({
                        myCourseNames: joinedNames,
                        allCourses: joinedCourses,
                        renderCourses: true
                    })
                    
                    this.handleClose();
                })
            }
        }).catch(err => {
            console.log('caught it!',err);
        });

    }

    //removes course
     removeCourse(course) {
        let data = {
            course: course,
            user: this.state.user
        }
         fetch('http://localhost:5000/api/courses/remove', {
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
                    var removedCourse = this.state.allCourses.filter(function(e) {if(e._id.localeCompare(course._id) !== 0) {return e}})
                    var removedCourseIds = removedCourse.map((item) => { return item._id});
                    var updatedUser = this.state.user;
                    updatedUser.courses = removedCourseIds;

                    this.props.handleUpdate(updatedUser);

                    var removedCourseName = this.state.myCourseNames.filter(function(e) {if(e.localeCompare(course.name) !== 0) {return e}});
                    this.setState({
                        allCourses: removedCourse,
                        myCourseNames: removedCourseName,
                        renderCourses: true, 

                    })
                    
                    this.handleClose();
                })
            }
        }).catch(err => {
            console.log('caught it!',err);
        });

    }
}

export default withRouter(ListBox);