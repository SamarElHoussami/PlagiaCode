import React from "react";

const ListBox = (props) => {
    /*const type = props.type; //either course, user, or posting
    TODO: display title, list of links depending on type of list

    for course:
        add btn on top right brings you to search page for courses (or lets you search for courses from search bar? or predefined drop list)
        every coourse has delete btn
        every course links opens modal of course info or course page for it

    for user: shows user info (teacher or student) like courses they're taking and teaching

*/
    const list = props.list;


    let listItems = null;
    if(list != null && list != undefined) {
        listItems = list.map((list) => 
            <li>{list}</li>
        )
    } else {
        listItems = "none ";
    }

    return (  
        <ul>{listItems}</ul>
    )
}

export default ListBox;