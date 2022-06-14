import React from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import Sidebar from "../component/Sidebar";
import { useState,useEffect} from "react";
import { Modal } from 'react-bootstrap';
import {fetchTicket} from '../api/tickets'
import { getAllUsers } from "../api/user";
import {ExportPdf,ExportCsv} from '@material-table/exporters';
import "../styles/admin.css"
import MaterialTable from '@material-table/core';


function Admin() {
  const [userModal, setUserModal] = useState(false);
  const [ticketDetails,setTicketDetails]=useState([]);
  const [userDetails,setUserDetails]=useState([]);
  const showUserModal = () => {
    setUserModal(true)
  }
  const closeUserModal = () => {
    setUserModal(false)
  }
  useEffect(()=>{
    (async()=>{
      fetchTickets();
      getAllUser();
    })()
  },[])

  const fetchTickets=()=>{
    fetchTicket().then(function(response){
      if(response.status===200){
        console.log(response)
        setTicketDetails(response.data);
        console.log(ticketDetails);
      }
    }).catch((error)=>{
      console.log(error)
    })
  }
  const getAllUser=()=>{
    getAllUsers().then(function(response){
      if(response.status===200){
        console.log(response)
       
        setUserDetails(response.data);
        console.log('users',userDetails);
        
      }
    }).catch((error)=>{
      console.log(error)
    })
  }

  return <div className="bg-light vh-100">

    <div className="row">
      <div className="col-1">
        <Sidebar />
      </div>
      <div className="container col m-1">
        <h3 className="text-primary text-center">Welcome Admin</h3>
        <p className="text-muted text-center">Take a quick look at your stats below</p>

        {/* STATS CARDS START HERE */}
        <div className="row my-5 mx-2 text-center">
          <div className="col my-1 p-2 ">
            <div className="card bg-primary bg-opacity-25 " style={{ width: 12 + 'rem' }}>
              <div className="cardbody borders-b">
                <h5 className="card-subtitle">
                  <i className="bi bi-pen text-primary mx-2"></i>
                  OPEN
                </h5>
                <hr />
                <div className="row">
                  <div className="col">8</div>
                  <div className="col">
                    <div style={{ height: 30, width: 30 }}>
                      <CircularProgressbar value={80}
                        styles={buildStyles({
                          textColor: "blue",
                          pathColor: "darkBlue",

                        })}
                      />
                    </div>

                  </div>

                </div>
              </div>

            </div>

          </div>
          <div className="col my-1 p-2 ">
          <div className="card bg-success bg-opacity-25 " style={{ width: 12 + 'rem' }}>
            <div className="cardbody borders-b">
              <h5 className="card-subtitle">
                <i className="bi bi-pen text-primary mx-2"></i>
                Progress
              </h5>
              <hr />
              <div className="row">
                <div className="col">4</div>
                <div className="col">
                  <div style={{ height: 30, width: 30 }}>
                    <CircularProgressbar value={80}
                      styles={buildStyles({
                        textColor: "blue",
                        pathColor: "darkBlue",

                      })}
                    />
                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>
        <div className="col my-1 p-2 ">
        <div className="card bg-danger bg-opacity-25 " style={{ width: 12 + 'rem' }}>
          <div className="cardbody borders-b">
            <h5 className="card-subtitle">
              <i className="bi bi-pen text-primary mx-2"></i>
              Closed
            </h5>
            <hr />
            <div className="row">
              <div className="col">2</div>
              <div className="col">
                <div style={{ height: 30, width: 30 }}>
                  <CircularProgressbar value={80}
                    styles={buildStyles({
                      textColor: "blue",
                      pathColor: "darkBlue",

                    })}
                  />
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
      <div className="col my-1 p-2 ">
      <div className="card bg-secondary bg-opacity-25 " style={{ width: 12 + 'rem' }}>
        <div className="cardbody borders-b">
          <h5 className="card-subtitle">
            <i className="bi bi-pen text-primary mx-2"></i>
            Blocked
          </h5>
          <hr />
          <div className="row">
            <div className="col">1</div>
            <div className="col">
              <div style={{ height: 30, width: 30 }}>
                <CircularProgressbar value={80}
                  styles={buildStyles({
                    textColor: "blue",
                    pathColor: "darkBlue",

                  })}
                />
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
        </div>

        <hr />

        <MaterialTable
        options={{
          exportMenu: [{
            label: 'Export Pdf', 
            exportFunc: (cols, datas) => ExportPdf(cols, datas, 'Ticket Records')
          }, 
          {
            label: 'Export Csv', 
            exportFunc: (cols, datas) => ExportCsv(cols, datas, 'Ticket Records')
          }, 
        ], exportAllData: true ,
        headerStyle:{
          backgroundColor:'darkblue',
          color:'#fff'
        },
        rowStyle:{
          backgroundColor: '#eee',
         
        },
        filtering :true, searchFieldVariant:'filled',paginationType:'stepped',pageSizeOptions:[5,10,25,100,200,400]
      }}
          columns={[
            {
              title: 'Ticket id',
              field: 'id'
            },
            {
              title: 'Title',
              field: 'title'
            },
            {
              title: 'Description',
              field: 'description'
            },
            {
              title: 'Reporter',
              field: 'reporter'
            },
            {
              title: 'TicketPriority',
              field: 'ticketPriority'
            },
            
            {
              title: "Status",
              field: "status",
              lookup: {
                "OPEN": "OPEN",
                "IN_PROGRESS": "IN_PROGRESS",
                "BLOCKED": "BLOCKED",
                "CLOSED":"CLOSED"
              }
            }
          ]}
          data={ticketDetails}
          title="Ticket Records"

           
        />
        <button className="btn btn-primary" onClick={showUserModal}>Open Modal</button>

        <Modal
          show={userModal}
          onHide={closeUserModal}
          backdrop="static"
          centered>
          <Modal.Header closeButton>
            <Modal.Title> Edit Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="p-1">
                <h5 className="text-primary">UserId</h5>
                <div className="input-group">
                  <label className="input-group-text">Name
                    <input type="text" className="form-control"></input>
                  </label>
                </div>
              </div>
            </form>
          </Modal.Body>
        </Modal>
        <MaterialTable
        options={{
          exportMenu: [{
            label: 'Export Pdf', 
            exportFunc: (cols, datas) => ExportPdf(cols, datas, 'Ticket Records')
          }, 
          {
            label: 'Export Csv', 
            exportFunc: (cols, datas) => ExportCsv(cols, datas, 'Ticket Records')
          }, 
        ], exportAllData: true ,
        headerStyle:{
          backgroundColor:'darkblue',
          color:'#fff'
        },
        rowStyle:{
          backgroundColor: '#eee',
         
        },
        filtering :true, searchFieldVariant:'filled',paginationType:'stepped',pageSizeOptions:[5,10,25,100,200,400]
      }}
          columns={[
           
            {
              title: 'Name',
              field: 'name'
            },
            {
              title: 'E-mail',
              field: 'email'
            },
            {
              title: 'UserId',
              field: 'userId'
            },
            {
              title: 'UserStatus',
              field: 'userStatus',
             
            },
            
            {
              title: "UserType",
              field: "userTypes",
              lookup: {
                "ADMIN": "ADMIN",
                "CUSTOMER": "CUSTOMER",
                "ENGINEER": "ENGINEER"
                
              }
            }
          ]}
          data={userDetails}
          title="User Records"

           
        />

      </div>
    </div>
  </div>
}

export default Admin;