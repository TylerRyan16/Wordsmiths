import React from 'react';
import Topbar from '../TopBar/Topbar';

const Layout = ({ children }) => {
    return (
        <div>
            <Topbar />
            <main>{children}</main>
        </div>
    );
};

export default Layout;