import React from 'react';
import "./Header.scss"
import { Link } from 'react-router-dom';
import { List, Icon } from 'semantic-ui-react';

function Header() {
    return (
        <div className="header-container">
            <List className="nav-links">
                <span className="header-icon">
                    <Icon name='sticky note outline' size='big' />
                </span>
                <span className="title">TODO: </span>
                <List.Item className="link-item"> 
                    <Link to="/" className="link">
                        List Tasks
                    </Link>
                </List.Item>
                <List.Item className="link-item">
                    <Link to="/create" className="link">
                        Create Task
                    </Link>
                </List.Item>
            </List>
        </div>
    );
}

export default Header;