import React, {Fragment} from 'react';
import { withRouter } from 'react-router-dom';
import ReactLoading from 'react-loading';

//style import 
import courseStyles from '../styles/listboxStyle.module.css';
import headerStyles from '../styles/coursepageStyle.module.css';

class Courses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: JSON.parse(localStorage.getItem('user')),
            allCourses: [],
            userCourses: JSON.parse(localStorage.getItem('user')).courses,
            listItems: null,
            loading: 0,
            error: null,


        }

        this.getAll = this.getAll.bind(this);
        this.renderCourses = this.renderCourses.bind(this);
    }

    componentWillMount() {
        this.getAll();
    }

    renderCourses() {
        let listItems = null;
        if(this.state.allCourses !== null && this.state.allCourses!= undefined) {
            listItems = this.state.allCourses.map((course) => 
                <a
                style={this.pickColor()}
                className={courseStyles.listItem} 
                key={course.name}
                name={course.name}
                onClick={event => {
                        this.props.history.push({
                            pathname: `/courses/${course.name}`,
                            state: { 
                                courseName: course.name, //send course object as prop
                                courseId: course._id
                            }
                        });
                    }}
                ><p><b>{course.name}</b> Course code: {course.code}</p></a>
            );
            this.setState({
                listItems: listItems
            });
            return listItems;
        } else {
            return listItems = null;
        }
    }

    pickColor() {
        var opts = ["rgba(27,218,209,0.3)", "rgba(27,112,218,0.3)", "rgba(30,27,218,0.3)","rgba(197,27,218,0.3)", "rgba(218,27,115,0.3)","rgba(218,27,27,0.3)"];
        var style = {
            backgroundColor: opts[Math.floor((Math.random()*opts.length))],
            backgroundImage: "none"
        }
        return style;
    }

    render() {
        if(this.state.loading === 1) {
            return (
                <Fragment>
                    <div className={headerStyles.bgHeader}>
                        <div className={headerStyles.courseInfo}>
                            <h3 className={headerStyles.courseName}>All Courses</h3>
                        </div>
                    </div>
                    <div className={courseStyles.listContainer}>
                        {this.state.listItems || this.renderCourses()}
                    </div>
                </Fragment>
            );
        } else if (this.state.error !== null) {
            return (
                <h1>There was an error retrieving the courses. Please refresh and try again</h1>
            )
        } else {
            return (
                <div className={courseStyles.loading}>
                    <ReactLoading type={"bubbles"} color={"#f3abcb"} height={'20%'} width={'20%'} />
                </div>
            )
        }
    }

    /**************************************************
    
                           API CALLS
    
    ************************************************** */

    //gets all courses and renders select input for them
    getAll() {
        fetch('/api/courses/all', {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        }).then(response => {
            if(!response.ok) {
                console.log("AFTER API CALL FOR COURSES: " + response.data);
                this.setState({
                    error: response.data
                })
            } else {
                response.json().then(data => {

                    this.setState({
                        allCourses: data,
                        loading: this.state.loading + 1
                    });
                })
            }
        }).catch(err => {
            console.log('caught it!',err);
            this.setState({
                error: err
            })
        });
    }
}

export default Courses;
