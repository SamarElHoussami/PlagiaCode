import React from 'react';

class Courses extends React.Component {
    constructor(props) {
        super(props);

        console.log("from courses page: " + JSON.stringify(props));
    }
    render() {
        return (
            <h1>Welcome to courses</h1>
        );
    }
}

export default Courses;
