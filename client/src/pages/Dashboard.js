import React, { Component, Fragment } from 'react';
//import ErrorPage from './ErrorPage'; //TODO: implement error page
import ListBox from '../components/ListBox';
import NavBar from '../components/NavBar';

//bootstrap imports
import { Container, Row, Col } from 'react-bootstrap';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        console.log("from dash: " + this.props.loggedInStatus);

        this.state = {
            user: props.history.location.state === undefined ? null : props.history.location.state.user, //might not work
            courses: null,
            taCourses: null
        }

        console.log(this.state.user);

        this.getCourses = this.getCourses.bind(this);
        //this.getTaCourses = this.getTaCourses.bind(this);
        this.renderMyClasses = this.renderMyClasses.bind(this);
        this.renderMyTaClasses = this.renderMyTaClasses.bind(this);
    }

    componentWillMount() {
        this.getCourses();
    }

    //ToDo: send array of course ids, get array of course objects
    getCourses() {
        let userCourses = {
            courses: this.state.user.courses
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

    renderMyClasses() {
        if(this.authenticated()) {
            if(this.state.user.courses.length != 0) {
                return (
                    <Row xs={12}>
                        <Col xs={12} md={6}>
                            <h3>My classes</h3> 
                            {console.log(this.state)}
                            <ListBox list={this.state.courses}/>
                        </Col>
                        {this.renderMyTaClasses}
                    </Row>
                )
            } else {
                return (
                    <h1>You have no courses yet!</h1>
                )
            }
        } else {
            return <div></div>
        }
    } 

    renderMyTaClasses() {
        if(this.state.user.ta.length != 0) {
            return (
                <Col xs={12} md={6}>
                    <h3>Classes I TA:</h3>
                        <ListBox list={this.state.user.ta}/>
                </Col>
            )
        } else {
            return <div></div>
        }
    }
        
    //list of course ids
    //listbox will fetch the course info when displaying
    //then make names into links that render course info
    //course info will depend on view (student or teacher)

    authenticated() {
        if(this.state.user == null) {
            this.props.history.push('/login');
            return false;
        }  else {
            //this.getCourses();
            return true;
        }
    }

    render() {
        return (
            <Container>
                <Row xs={12}>
                    <h1>Welcome, {this.state.user.name}</h1>
                </Row>
            {this.renderMyClasses()}    
            </Container>
        )
    }
}

export default Dashboard;
