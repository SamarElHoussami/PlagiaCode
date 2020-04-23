import React, { Component, Fragment } from 'react';
//import ErrorPage from './ErrorPage'; //TODO: implement error page
import ListBox from '../components/ListBox';
import NavBar from '../components/NavBar';
import img_teacher from "../images/img_teacher.PNG";
import img_student from "../images/img_student.PNG";

//bootstrap imports
import { Container, Row, Col } from 'react-bootstrap';

//style import 
import styles from '../styles/dashboardStyle.module.css';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            loggedInStatus: localStorage.getItem('loggedInStatus'),
            courses: null,
            taCourses: null
        }

        this.renderMyClasses = this.renderMyClasses.bind(this);
        this.renderMyTaClasses = this.renderMyTaClasses.bind(this);
        this.authenticated = this.authenticated.bind(this);
    }

    componentWillMount() {
        if(this.authenticated()) {
            this.setState({
                user: JSON.parse(localStorage.getItem('user')),
            })
        } else {
            this.props.history.push("/login");
        }
    }

    renderMyClasses() {
        return (
            <Row xs={12}>
                <Col xs={12}>
                    {console.log(this.state)}
                    <ListBox type="courses" handleUpdate={this.props.handleUpdate}/>
                </Col>
                {this.renderMyTaClasses()}
            </Row>
        )    
    } 

    renderMyTaClasses() {
        if(this.state.user.ta.length != 0) {
            return (
                <Col xs={12}>
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
        if(this.state.loggedInStatus === "false") {
            return false;
        }  else {
            //this.getCourses();
            return true;
        }
    }

    render() {
        if(this.authenticated()) {
            return (
                <div>
                    <div className={styles.bgHeader}>
                        <Container>
                        <div style={{display: "flex", justifyContent: "space-between", height: "100%"}}>
                            <div className={styles.userInfo}>
                                <h3 className={styles.userName}>{this.state.user.name}</h3>
                                <h5 className={styles.userType}>{this.state.user.type}</h5>
                            </div>
                            {this.state.user.type === "Student" ? <img src={img_student} className={styles.profilePic}/> : <img src={img_teacher} className={styles.profilePic}/>}  
                        </div>
                        </Container>
                    </div>
                    <Container>
                    {this.renderMyClasses()}    
                    </Container>
                </div>
            )
        } else return null;
    }
}

export default Dashboard;
