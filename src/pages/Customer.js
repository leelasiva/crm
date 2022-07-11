import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from '@material-table/exporters';
import { Modal, Button, ModalBody } from 'react-bootstrap';
import { fetchTicket, updateTicketData, ticketCreation } from '../api/tickets';
import Sidebar from "../component/Sidebar";
import "../styles/admin.css"

const logoutFn = () => {
  localStorage.clear();
  window.location.href = "/"
}

function Customer() {

  const [ticketCreationModal, setTicketCreationModal] = useState(false);
  // get all the Tickets Created by the User

  const [ticketDetails, setTicketDetails] = useState([]);
  const [ticketUpdateModal, setTicketUpdateModal] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedCurrTicket, setSelectedCurrTicket] = useState({});
  const [ticketCount, setTicketCount] = useState({});

  const onCloseTicketCreationModal = () => {
    setTicketCreationModal(false)
  };

  const onCloseTicketUpdateModal=()=>{
    setTicketUpdateModal(false);
  };

  useEffect(() => {
    (async () => {
        fetchTickets();
    })();
  }, []);

  const updateTicketCount=(tickets)=>{
    const data={
      pending:0,
      blocked:0,
      progress:0,
      closed:0
    }
    tickets.forEach(x=>{
      if(x.status==="OPEN"){
        data.pending+=1;
      }else if(x.status === "BLOCKED"){
        data.blocked+=1;
      }else if(x.status === "IN-PROGRESS"){
        data.progress+=1;
      }else{
        data.closed+=1;
      }
    })
    setTicketCount(Object.assign({},data))
  }


  const fetchTickets= () =>{
    fetchTicket().then(function(response){
      if(response.status === 200){
      setTicketDetails(response.data);
      updateTicketCount(response.data);
      }
    })
  }

  const createTicket=(e)=>{
    e.preventDefault();
    const data={
      title:e.target.title.value,
      description:e.target.description.value
    }
    ticketCreation(data).then(function(response){
      setMessage("Ticket Created Successfully");
      onCloseTicketCreationModal();
      fetchTickets();
    }).catch(function(error){
      if(error.response.status === 400){
        setMessage(error.message)
      }
    })

  };

  const editTicket=(ticketdetails)=>{
    const ticket={
      assignee: ticketdetails.assignee,
      description: ticketdetails.description,
      id:ticketdetails.id,
      reporter: ticketdetails.reporter,
      status: ticketdetails.status,
      title:ticketdetails.title
  }
  setSelectedCurrTicket(ticket);
  setTicketUpdateModal(true);
  };

  const updateSelectedCurrTicket=(data)=>setSelectedCurrTicket(data);

  const onupdateTicket=(e)=>{
    if(e.target.name==="title")
    selectedCurrTicket.title = e.target.value
else if(e.target.name==="description")
    selectedCurrTicket.description = e.target.value
  else if(e.target.name==="status")
    selectedCurrTicket.status = e.target.value
     updateSelectedCurrTicket(Object.assign({},selectedCurrTicket));
  };

  const updateTicket=(e)=>{
    e.preventDefault();
    updateTicketData(selectedCurrTicket.id,selectedCurrTicket).then(function(response){
      setMessage("Ticket updated Successfully");
      onCloseTicketUpdateModal();
      fetchTickets();
    }).catch(function(error){
      if(error.response.status === 400){
        setMessage(error.message);
        console.log(error.message);
      }
    })
      
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="col-1"><Sidebar home='/' /></div>
      <div className="container">
        <h3 className="text-success text-center">Welcome , {localStorage.getItem('name')}</h3>
        <p className="tex-muted text-center">Take a quick Looks at your admin Stats below</p>
        {/*Card */}

        <div className="row my-5 mx-2 text-center">
          <div className="col-xs-12 col-lg-3 col-md-6 my-1">
            <div className="card cardItem shadow bg-primary text-dark bg-opacity-25 borders-b" style={{ width: 15 + 'rem' }}>
              <div className="card-body">
                <h5 className="card-subtitle mb-2"><i className="bi bi-pencil text-primary mx-2"></i>OPEN</h5>
                <hr />
                <div className="row">
                  <div className="col">
                    <h1 className="col text-darkmx-4">{ticketCount.pending}</h1>
                  </div>
                  <div className="col">
                    <div style={{ width: 40, height: 40 }}>
                      <CircularProgressbar value={30} styles={buildStyles({
                        textColor: "red",
                        pathColor: 'darkblue',
                      })} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="col-xs-12 col-lg-3 col-md-6 my-1">
            <div className="card cardItem shadow bg-success text-dark bg-opacity-25 borders-b" style={{ width: 15 + 'rem' }}>
              <div className="card-body">
                <h5 className="card-subtitle mb-2"><i className="bi bi-lightning-charge text-success mx-2"></i>Progress</h5>
                <hr />
                <div className="row">
                  <div className="col">
                    <h1 className="col text-darkmx-4">{ticketCount.progress}</h1>
                  </div>
                  <div className="col">
                    <div style={{ width: 40, height: 40 }}>
                      <CircularProgressbar value={80} styles={buildStyles({
                        textColor: "red",
                        pathColor: 'green',
                      })} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="col-xs-12 col-lg-3 col-md-6 my-1">
            <div className="card cardItem shadow bg-warning text-dark bg-opacity-25 borders-b" style={{ width: 15 + 'rem' }}>
              <div className="card-body">
                <h5 className="card-subtitle mb-2"><i className="bi bi-slash-circle text-dark mx-2"></i>Blocked</h5>
                <hr />
                <div className="row">
                  <div className="col">
                    <h1 className="col text-darkmx-4">{ticketCount.blocked}</h1>
                  </div>
                  <div className="col">
                    <div style={{ width: 40, height: 40 }}>
                      <CircularProgressbar value={50} styles={buildStyles({
                        textColor: "red",
                        pathColor: 'orange',
                      })} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="col-xs-12 col-lg-3 col-md-6 my-1">
            <div className="card cardItem shadow bg-secondary text-dark bg-opacity-25 borders-b" style={{ width: 15 + 'rem' }}>
              <div className="card-body">
                <h5 className="card-subtitle mb-2"><i className="bi bi-check2-circle text-dark mx-2"></i>Closed</h5>
                <hr />
                <div className="row">
                  <div className="col">
                    <h1 className="col text-darkmx-4">{ticketCount.closed}</h1>
                  </div>
                  <div className="col">
                    <div style={{ width: 40, height: 40 }}>
                      <CircularProgressbar value={12} styles={buildStyles({
                        textColor: "red",
                        pathColor: 'darkblue',
                      })} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr className="my-5" />
          <div className="container my-3">
            <MaterialTable
            onRowClick={(event,rowData)=>{editTicket(rowData)}}
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
                  backgroundColor: 'darkgreen',
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
              title="Tickets Raised by You"
              data={ticketDetails}

            />
            <input type="submit" className="form-control btn btn-success fw-bolder text-white my-2" value="Raise Ticket" onClick={() => { setTicketCreationModal(true) }} />
            {
              ticketCreationModal ? (
                <Modal
                  show={ticketCreationModal}
                  onHide={onCloseTicketCreationModal}
                  backdrop="static"
                  keyboard={false}
                  centered>
                  <Modal.Header closeButton onClick={() => onCloseTicketCreationModal()}>
                    <Modal.Title>Create Ticket</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form onSubmit={createTicket}>
                      <div className="p-1">
                        <label className=" fw-bolder">Title:</label>
                        <input type='text' className="form-control" name='title' placeholder="Title" 
                         onChange={onupdateTicket} required />
                      </div>
                      <div className="p-1">
                      <label className=" fw-bolder">Status:</label>
                      <input type='text' className="form-control" name='status' placeholder="Status" 
                       onChange={onupdateTicket} required />
                    </div>
                      <div className="p-1">
                        <label className="fw-bolder">Description</label>
                        <textarea id='form16' rows='3' className="md-textarea form-control" name='description' placeholder="About the ticket" onChange={onupdateTicket} required></textarea>
                      </div>
                      <div className="input-group p-1 my-2  justify-content-center">
                        <div className="m-1">
                          <Button className="btn btn-success" type="submit">Create</Button>
                        </div>
                        <div className="m-1">
                          <Button className="btn btn-secondary" onClick={()=>onCloseTicketCreationModal()}>Cancel</Button>
                        </div>
                      </div>
                    </form>
                  </Modal.Body>

                </Modal>
              ) : ("")
            }
            {
              ticketUpdateModal ? (
                <Modal
                  show={ticketUpdateModal}
                  onHide={onCloseTicketUpdateModal}
                  backdrop="static"
                  keyboard={false}
                  centered>
                  <Modal.Header closeButton onClick={() => onCloseTicketUpdateModal()}>
                    <Modal.Title>Update Ticket</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form onSubmit={updateTicket}>
                      <div className="p-1">
                        <label className=" fw-bolder">Title:</label>
                        <input type='text' className="form-control" name='title' placeholder="Title" 
                         onChange={onupdateTicket} value={selectedCurrTicket.title} required />
                      </div>
                      <div className="p-1">
                      <label className=" fw-bolder">Status:</label>
                      <input type='text' className="form-control" name='status' placeholder="Status" 
                       onChange={onupdateTicket} value={selectedCurrTicket.status} required />
                    </div>
                      <div className="p-1">
                        <label className="fw-bolder">Description</label>
                        <textarea id='form16' rows='3' className="md-textarea form-control" name='description' placeholder="About the ticket" onChange={onupdateTicket} value={selectedCurrTicket.description} required></textarea>
                      </div>
                      <div className="input-group p-1 my-2  justify-content-center">
                        <div className="m-1">
                          <Button className="btn btn-success" type="submit">Update</Button>
                        </div>
                        <div className="m-1">
                          <Button className="btn btn-secondary">Cancel</Button>
                        </div>
                      </div>
                    </form>
                  </Modal.Body>

                </Modal>
              ) : ("")
            }
          </div>


        </div>
      </div>
    </div>
  );
}

export default Customer;