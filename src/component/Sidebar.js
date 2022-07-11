import { CSidebar, CSidebarNav, CNavTitle, CNavItem } from "@coreui/react";
import {Link} from 'react-router-dom';


   


const Sidebar = () => {

    const logoutFn = () => {
        localStorage.clear();
        // navigate, route, link, window
        window.location.href = "/"; 

    }
    return (
        <CSidebar unfoldable className="bg-black vh-100">
            <CSidebarNav>
                <CNavItem className="bg-dark text-center d-flex">
                    <i className="bi bi-bar-chart-fill m-2"></i>
                    <h5 className="mx-5 my-1 fw-bolder">TETHERX</h5>
                </CNavItem>
                <CNavTitle className="">
                    A CRM App for all your needs...
                </CNavTitle>
                <CNavItem className="d-flex">
                <i className="bi bi-box-arrow-left m-2"></i>
                <Link to="/" style={{textDecoration:'none', color:"white"}}><span className="mx-5 my-1">Home</span></Link>
                  
            </CNavItem>
                <CNavItem className="d-flex">
                    <i className="bi bi-box-arrow-left m-2"></i>
                    <span className="mx-5 my-1" onClick={logoutFn} styles={{cursor:'pointer'}}>Logout</span>
                </CNavItem>

            </CSidebarNav>

        </CSidebar>

    )
}

export default Sidebar;