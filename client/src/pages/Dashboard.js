import React, { Component, Fragment } from 'react';
//import ErrorPage from './ErrorPage'; //TODO: implement error page
import ListBox from '../components/ListBox';
import NavBar from '../components/NavBar';

//bootstrap imports
import { Container, Row, Col } from 'react-bootstrap';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        console.log("from dash: " + localStorage.getItem('loggedInStatus'));

        this.state = {
            user: null,
            loggedInStatus: localStorage.getItem('loggedInStatus'),
            courses: null,
            taCourses: null
        }

        console.log(this.state.loggedInStatus + " ?");

        this.renderMyClasses = this.renderMyClasses.bind(this);
        this.renderMyTaClasses = this.renderMyTaClasses.bind(this);
        this.authenticated = this.authenticated.bind(this);
    }

    componentWillMount() {
        if(this.authenticated()) {
            console.log("is authenticated");
            this.setState({
                user: JSON.parse(localStorage.getItem('user'))
            })
        } else {
            this.props.history.push("/login");
            console.log("done:)");
        }
    }

    renderMyClasses() {
        if(this.state.user.courses.length != 0) {
            return (
                <Row xs={12}>
                    <Col xs={12} md={6}>
                        {console.log(this.state)}
                        <ListBox type="courses" handleUpdate={this.props.handleUpdate}/>
                    </Col>
                    {this.renderMyTaClasses}
                </Row>
            )
        } else {
            return (
                <h1>You have no courses yet!</h1>
            )
        }
    } 

    renderMyTaClasses() {
        if(this.state.user.ta.length != 0) {
            return (
                <Col xs={12} md={6}>
                    <h3>Classes I TA:</h3>
                        <ListBox type="ta" handleUpdate={this.props.handleUpdate}/>
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
        console.log("again: " + this.state.loggedInStatus);
        if(this.state.loggedInStatus === "false") {
            console.log("going to login");
            return false;
        }  else {
            //this.getCourses();
            return true;
        }
    }

    render() {
        if(this.authenticated()) {
            return (
                <Container>
                    <Row xs={12}>
                        <h1>Welcome, {this.state.user.name}</h1>
                    </Row>
                {this.renderMyClasses()}    
                </Container>
            )
        } else return null;
    }
}

export default Dashboard;
