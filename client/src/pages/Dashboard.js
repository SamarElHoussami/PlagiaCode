import React, { Component, Fragment } from 'react';
//import ErrorPage from './ErrorPage'; //TODO: implement error page
import ListBox from '../components/ListBox';
import NavBar from '../components/NavBar';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        console.log("from dash: " + this.props.loggedInStatus);

        this.state = {
            user: props.history.location.state === undefined ? null : props.history.location.state.user //might not work
        }

        //console.log(this.state.user);
       
        const renderListBoxes = (
            this.state.user.type === "student" ? (
                    <Fragment> 
                        <h1>My courses</h1>
                        <ListBox type="courses" list={this.state.user.courses} user={this.state.user} /> 

                        { this.state.user.ta === null ? null : (
                            <Fragment>
                            <h1>TA courses</h1>
                            <ListBox type="ta" list={this.state.user.ta} user={this.state.user} />
                            </Fragment>
                        )}
                    </Fragment>
                ) : 
                (
                    <Fragment>

                    </Fragment>
                )
        )
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
            return true;
        }
    }

    render() {
        {if(this.authenticated()) {
            return (
                <Fragment>
                    <NavBar userType={this.state.user.type}/>
                    <h1>Welcome, {this.state.user.name}</h1>
                    <div>{this.renderListBoxes}</div>
                </Fragment>
            )}
        else return (
                <div></div>
            )
        }
    }
}

export default Dashboard;
