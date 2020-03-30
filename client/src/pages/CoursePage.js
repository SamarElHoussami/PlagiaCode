import React from 'react';
import { withRouter } from 'react-router-dom';

class CoursePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            courseName: props.history.location.state === undefined ? null : props.history.location.state.courseName,
            course: props.history.location.state === undefined ? null : props.history.location.state.course,
            teacher: null,
            postings: null,
            tas: null,
            loading: 0,
            show: false
        }

        this.getTeacher = this.getTeacher.bind(this);
        this.getPostings = this.getPostings.bind(this);
        this.getStudents = this.getStudents.bind(this);
        this.getTas = this.getTas.bind(this);
        this.renderNames = this.renderNames.bind(this);

        console.log("from courses page: " + JSON.stringify(this.state.course.teacher));
    }

    componentWillMount() {
        if(this.state.course !== null && this.state.course !== undefined) {
            this.getTeacher();
            this.getPostings();
            this.getStudents();
            this.getTas();
        } else {
            console.log("course is null");
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

    getTas() {
        if(this.state.course.tas !== null) {
            let courseTas = {
                user_ids: this.state.course.tas
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
                            tas: data,
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

    renderNames(object) {
        let listItems = null;
        if(this.state[object] !== null && this.state[object] != undefined) {
            return listItems = this.state[object].map((item) => 
            console.log(item._id);
                <li key={item._id}>
                    <a onClick={event => {
                        this.setState({
                            show: true,
                            modalFor: [object]
                        });
                    }}>{item.name}</a></li>
            )
        } else {
            return listItems = <h1>This course does not have any {object} yet!</h1>;
        }
    }

    render() {
        if(this.state.course !== null && this.state.loading == 4) {
            return (
                <div>
                    <h1>Course: {this.state.courseName}</h1>
                    <h1>Course Code: {this.state.course.code}</h1>
                    <h1>Teacher: {this.state.teacher.name}</h1>
                    <h1>Postings: <br/><ul>{this.renderNames("postings")}</ul></h1>
                    <h1>Students: <br/><ul>{this.renderNames("students")}</ul></h1>
                    <h1>Tas: <br/><ul>{this.renderNames("tas")}</ul></h1>
                </div>    
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
