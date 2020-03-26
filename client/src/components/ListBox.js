import React, {Fragment} from "react";
import { Button, Modal } from 'react-bootstrap';

class ListBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: JSON.parse(localStorage.getItem('user')),
            type: props.type,
            list: props.type === "courses" ? JSON.parse(localStorage.getItem('user')).courses : JSON.parse(localStorage.getItem('user')).ta, //course IDs
            courses: null, //course names
            show: false,
            courseOpts: null,
            selectValue: 0
        }

        this.getCourses = this.getCourses.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderOpts = this.renderOpts.bind(this);
        this.handleAdd = this.handleAdd.bind(this);

    }

    componentWillMount() {
        this.getCourses(); 
        this.renderOpts();
    }
    /*const type = props.type; //either course, user, or posting
    TODO: display title, list of links depending on type of list

    for course:
        add btn on top right brings you to search page for courses (or lets you search for courses from search bar? or predefined drop list)
        every coourse has delete btn
        every course links opens modal of course info or course page for it

    for user: shows user info (teacher or student) like courses they're taking and teaching

*/
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
                        courses: data
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
        if(this.state.courses !== null && this.state.courses != undefined) {
            return listItems = this.state.courses.map((list) => 
                <li key={list}>{list}</li>
            )
        } else {
            return listItems = "none ";
        }
    }

    handleShow() {
        this.setState({
            show: true
        })
    }

    handleClose() {
        this.setState({
            show: false
        })
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
                    }

                    this.setState({
                            courseOpts: listOpts
                    });
                })
            }
        }).catch(err => {
            console.log('caught it!',err);
        });
    }

    handleAdd() {
        if(!this.state.courses.includes(this.state.selectValue)) {
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
        this.setState({selectValue:e.target.value});
    }
    
    render() {
        return (
            <Fragment>  
            {console.log("rendering now " + JSON.stringify(this.state))}

                <Button variant="primary" onClick={this.handleShow}>
                    Add course
                </Button>
                {this.state.type === "courses" ? "My courses: " : "Courses I TA"}
                
                <ul>{this.renderList()}</ul>

                <Modal size="lg" aria-labelledby="contained-modal-title-vcenter"centered show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Select course</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        <select value={this.state.selectValue} onChange={this.handleChange} id='select1'>
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
            </Fragment>
        )
    }
}

export default ListBox;