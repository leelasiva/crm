import React from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import Sidebar from "../component/Sidebar";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Modal, Button, ModalBody } from 'react-bootstrap';
import { fetchTicket, updateTicketData } from '../api/tickets'
import { getAllUsers, updateUserData } from "../api/user";
import { ExportPdf, ExportCsv } from '@material-table/exporters';
import "../styles/admin.css"
import MaterialTable from '@material-table/core';



function Admin() {
  //States to hold the changes

  //Ticket Records States
  const [ticketList, setTicketList] = useState([]);
  const [ticketUpdateModal, setTicketUpdateModal] = useState(false);
  const [selectedCurrTicket, setSelectedCurrTicket] = useState({});
  const [ticketStatusCount, setTicketStatusCount] = useState({});
  const [message, setMessage] = useState('');
  //user Records State
  const [messageUser, setMessageUser] = useState('');
  const [userDetails, setUserDetails] = useState([]);
  const [updateUser, setUpdateUser] = useState({});
  const [userUpdateModal, setUserUpdateModal] = useState(false);


  //Ticket Modal
  const onCloseTicketModal = () => {
    setTicketUpdateModal(false)
  }
  // USER Modal
  const onCloseUserModal = () => {
    setUserUpdateModal(false);
  }
  //Api Call for Fetch Ticket and User Records
  useEffect(() => {
    (async () => {
      fetchTickets();
      getAllUser("");
    })()
  }, [])

  // Function to Call Tickets Api
  const fetchTickets = () => {
    fetchTicket().then(function (response) {
      if (response.status === 200) {
        console.log(response)
        setTicketList(response.data);
        updateTicketCounts(response.data);
        console.log(ticketList);
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  // Grabbing the Current Selected Ticket Values(old Values)
  const editTicket = (ticketDetail) => {
    const ticket = {
      assignee: ticketDetail.assignee,
      id: ticketDetail.id,
      title: ticketDetail.title,
      description: ticketDetail.description,
      ticketPriority: ticketDetail.ticketPriority,
      status: ticketDetail.status,
      reporter: ticketDetail.reporter
    }
    console.log("currentTicket", ticket);
    setSelectedCurrTicket(ticket);
    setTicketUpdateModal(true);
  }
  console.log("selectedTicket", selectedCurrTicket);

  const updateSelectedCurrTicket = (data) => setSelectedCurrTicket(data);

  //grabing the ticket details which will be updated through the Modal from the User
  const onTicketUpdate = (e) => {
    if (e.target.name === 'title') {
      selectedCurrTicket.title = e.target.value;
    } else if (e.target.name === 'description') {
      selectedCurrTicket.description = e.target.value;
    } else if (e.target.name === 'reporter') {
      selectedCurrTicket.reporter = e.target.value;
    } else if (e.target.name === 'ticketPriority') {
      selectedCurrTicket.ticketPriority = e.target.value;
    } else if (e.target.name === 'status') {
      selectedCurrTicket.status = e.target.value;
    } else if (e.target.name === 'assignee') {
      selectedCurrTicket.status = e.target.value;
    }
    updateSelectedCurrTicket(Object.assign({}, selectedCurrTicket));
  }

  //Api call to update the ticket in DB
  const updateTicket = (e) => {
    e.preventDefault();
    updateTicketData(selectedCurrTicket.id, selectedCurrTicket).then(function (response) {
      setMessage("Ticket updated Successfully");
      onCloseTicketModal(false);
      fetchTickets();
    }).catch(function (error) {
      console.log(error);
    })
  };

  // Count the Tickets
  const updateTicketCounts = (tickets) => {
    const data = {
      pending: 0,
      closed: 0,
      progress: 0,
      blocked: 0

    }
    tickets.forEach(x => {
      if (x.status === "OPEN")
        data.pending += 1
      else if (x.status === "IN_PROGRESS")
        data.progress += 1
      else if (x.status === "BLOCKED")
        data.blocked += 1
      else
        data.closed += 1
    })
    setTicketStatusCount(Object.assign({}, data))
  }



  //  //Tickets Functionalities Ends//


  // [User Details Functionalities starts::]

  // Function to Call User List Api
  const getAllUser = (userId) => {
    getAllUsers(userId).then(function (response) {
      if (response.status === 200) {
        console.log(response)

        setUserDetails(response.data);
        console.log('users', userDetails);

      }
    }).catch((error) => {
      console.log(error)
    })
  }

  //  Grabbing the Current Selected User Values(old Values)
  const editUser = (userDetail) => {
    const user = {
      name: userDetail.name,
      email: userDetail.email,
      userStatus: userDetail.userStatus,
      userTypes: userDetail.userTypes,
      userId: userDetail.userId
    }
    console.log("Current User ", user);
    setUpdateUser(user);
    setUserUpdateModal(true);

  }
  console.log("selected user", updateUser);

  // updating the state with new values for UserUPdate

  const updateCurrUserDetail = (e) => {
    if (e.target.name === 'name') {
      updateUser.name = e.target.value;
    } else if (e.target.name === 'email') {
      updateUser.email = e.target.value;
    } else if (e.target.name === 'status') {
      updateUser.userStatus = e.target.value;
    } else if (e.target.name === 'type') {
      updateUser.userTypes = e.target.value;
    }
    updatedSelectedUser(Object.assign({}, updateUser));
  };

  const updatedSelectedUser = (data) => setUpdateUser(data);

  // Function to call Api for Update USER DETAILS
  const updateCurrUser = (e) => {
    e.preventDefault();
    updateUserData(updateUser.userId, updateUser).then(function (response) {
      setMessageUser("User has been updated Successfully");
      onCloseUserModal(false);
      getAllUser("");
    }).catch(function (error) {
      console.log(error);
    })
  };

  return <div className="bg-light min-vh-100">

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
            <div className="card bg-primary bg-opacity-25 p-2 " style={{ width: 12 + 'rem' }}>
              <div className="cardbody borders-b">
                <h5 className="card-subtitle">
                  <i className="bi bi-pen text-primary mx-2"></i>
                  OPEN
                </h5>
                <hr />
                <div className="row">
                  <div className="col">{ticketStatusCount.pending}</div>
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
            <div className="card bg-success bg-opacity-25 p-2 " style={{ width: 12 + 'rem' }}>
              <div className="cardbody borders-b">
                <h5 className="card-subtitle">
                  <i className="bi bi-lightning-charge text-warning mx-2"></i>
                  Progress
                </h5>
                <hr />
                <div className="row">
                  <div className="col">{ticketStatusCount.progress}</div>
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
            <div className="card bg-danger bg-opacity-25 p-2" style={{ width: 12 + 'rem' }}>
              <div className="cardbody borders-b">
                <h5 className="card-subtitle">
                  <i className="bi bi-check2-circle text-success mx-2"></i>
                  Closed
                </h5>
                <hr />
                <div className="row">
                  <div className="col">{ticketStatusCount.closed}</div>
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
            <div className="card bg-secondary bg-opacity-25 p-2" style={{ width: 12 + 'rem' }}>
              <div className="cardbody borders-b">
                <h5 className="card-subtitle">
                  <i className="bi bi-slash-circle text-secondary mx-2"></i>
                  Blocked
                </h5>
                <hr />
                <div className="row">
                  <div className="col">{ticketStatusCount.blocked}</div>
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
        <h6 className="text-center">{messageUser}</h6>
        <div className="container">
          <MaterialTable
            onRowClick={(event, ticketDetail) => editTicket(ticketDetail)}
            options={{
              exportMenu: [{
                label: 'Export Pdf',
                exportFunc: (cols, datas) => ExportPdf(cols, datas, 'Ticket Records')
              },
              {
                label: 'Export Csv',
                exportFunc: (cols, datas) => ExportCsv(cols, datas, 'Ticket Records')
              },
              ], exportAllData: true,
              headerStyle: {
                backgroundColor: 'darkblue',
                color: '#fff'
              },
              rowStyle: {
                backgroundColor: '#eee',

              },
              filtering: true, searchFieldVariant: 'filled', paginationType: 'stepped', pageSizeOptions: [5, 10, 25, 100, 200, 400]
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
                title: 'Assignee',
                field: 'assignee'
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
                  "CLOSED": "CLOSED"
                }
              }
            ]}
            data={ticketList}
            title="Ticket Records"


          />
        </div>


        {/* <button className="btn btn-primary" onClick={showUserModal}>Open Modal</button>*/}
        {
          ticketUpdateModal ? (
            <Modal
              show={ticketUpdateModal}
              onHide={onCloseTicketModal}
              backdrop="static"
              centered>
              <Modal.Header closeButton onClick={onCloseTicketModal}>
                <Modal.Title> Edit Details
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={updateTicket}>
                  <div className="p-1">
                    <h5 className="text-primary">UserId :{selectedCurrTicket.id}</h5>
                    <div className="input-group">
                      <label className="input-group-text">Title</label>
                      <input type="text" className="form-control" name='title' value={selectedCurrTicket.title}
                        onChange={onTicketUpdate}></input>
                    </div>
                    <div className="input-group">
                      <label className="input-group-text">Reporter</label>
                      <input type="text" className="form-control" name='reporter' value={selectedCurrTicket.reporter}
                        onChange={onTicketUpdate}></input>
                    </div>
                    <div className="input-group">
                      <label className="input-group-text">Assignee</label>
                      <input type="text" className="form-control" name='assignee' value={selectedCurrTicket.assignee}
                        onChange={onTicketUpdate}></input>
                    </div>
                    <div className="input-group">
                      <label className="input-group-text">Status</label>
                      <input type="text" className="form-control" name='status' value={selectedCurrTicket.status}
                        onChange={onTicketUpdate}></input>
                    </div>
                    <div className="input-group">
                      <label className="input-group-text">TicketPriority</label>
                      <input type="text" className="form-control" name='ticketPriority' value={selectedCurrTicket.ticketPriority}
                        onChange={onTicketUpdate}></input>
                    </div>
                    <Button type='submit' className='my-1'>Update</Button>

                  </div>
                </form>
              </Modal.Body>
            </Modal>
          ) : ("")
        }

        <h6 className="text-center">{message}</h6>
        <div className="container">

          <MaterialTable
            onRowClick={(event, userDetail) => editUser(userDetail)}
            options={{
              exportMenu: [{
                label: 'Export Pdf',
                exportFunc: (cols, datas) => ExportPdf(cols, datas, 'Ticket Records')
              },
              {
                label: 'Export Csv',
                exportFunc: (cols, datas) => ExportCsv(cols, datas, 'Ticket Records')
              },
              ], exportAllData: true,
              headerStyle: {
                backgroundColor: 'darkblue',
                color: '#fff'
              },
              rowStyle: {
                backgroundColor: '#eee',

              },
              filtering: true, searchFieldVariant: 'filled', paginationType: 'stepped', pageSizeOptions: [5, 10, 25, 100, 200, 400]
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
            title="User Records" />
        </div>

        {
          userUpdateModal ? (
            <Modal
              show={userUpdateModal}
              onHide={onCloseUserModal}
              backdrop="static"
              centered>
              <Modal.Header closeButton onClick={onCloseUserModal}>
                <Modal.Title>User Update</Modal.Title>
              </Modal.Header>
              <ModalBody>
                <form onSubmit={updateCurrUser}>
                  <div className="p-1">
                    <h5 className="text-primary">UserId : {updateUser.userId}</h5>
                    <div className="Input-group">
                      <label className="Input-group-text">Name :</label>
                      <input type="text" className="form-control" name="name" value={updateUser.name}
                        onChange={updateCurrUserDetail}></input>
                    </div>
                    <div className="Input-group">
                      <label className="Input-group-text">UserStatus: :</label>
                      <input type="text" className="form-control" name="status" value={updateUser.userStatus}
                        onChange={updateCurrUserDetail} >
                      </input>
                    </div>
                    <div className="Input-group">
                      <label className="Input-group-text">UserType :</label>
                      <input type="text" className="form-control" name="type" value={updateUser.userTypes}
                        onChange={updateCurrUserDetail}></input>
                    </div>
                    <div className="Input-group">
                      <label className="Input-group-text">Email :</label>
                      <input type="text" className="form-control" name="email" value={updateUser.email}
                        onChange={updateCurrUserDetail}></input>
                    </div>
                    <Button type='submit' className='my-1'>Update</Button>

                  </div>
                </form>
              </ModalBody>
            </Modal>
          ) : ("")
        }

      </div>
    </div>
  </div>
}

export default Admin;