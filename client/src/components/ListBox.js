import React from "react";

const ListBox = (props) => {
    const list = props.list;
    const listItems = list.map((list) => 
        <li>{list}</li>
    )

    return (  
        <ul>{listItems}</ul>
    )
}

export default ListBox;