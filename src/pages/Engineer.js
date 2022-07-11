import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import Sidebar from "../component/Sidebar";
import { fetchTicket, updateTicketData } from '../api/tickets';
import { ExportPdf, ExportCsv } from '@material-table/exporters';
import MaterialTable from '@material-table/core';
import '../styles/Engineer.css';
import { Modal,Button } from "react-bootstrap";

function Engineer() {

  const [ticketList, setTicketList] = useState([]);
  const [ticketCount,setTicketCount] = useState({});
  const [ticketModal,setTicketModal] = useState(false);
  const [selectedCurrTicket,setSelectedCurrTicket] = useState({});
  const [message,setMessage] = useState("");

  const columns = [
    { title: 'Title', field: 'title' },
    { title: 'Id', field: 'id' },
    { title: 'Assignee', field: 'assignee' },
    { title: 'Reporter', field: 'reporter' },
    { title: 'TicketPriority', field: 'ticketPriority' },
    { title: 'Description', field: 'description' },
  ];

  // Api call Function 
  useEffect(() => {
    (async () => {
      fetchTickets()
    })()
  }, [])

  const fetchTickets = () => {
    fetchTicket().then(function (response) {
      if (response.status === 200) {
        console.log("TicketList",response.data)
        setTicketList(response.data);
        updateTicketCount(response.data);
        console.log("TicketList in state",ticketList);
      }
    }).catch((error) => {
      console.log(error)
    })
  };

  const onCloseTicketModal = ()=>{
    setTicketModal(false);
  };

  const onOpenTicketModal =()=>{
    setTicketModal(true);
  }

  const updateTicketCount= (tickets) =>{
    const data={
      open:0,
      closed:0,
      blocked:0,
      progress:0
    }

    tickets.forEach(ticket => {
      if(ticket.status==="OPEN"){
        data.open+=1;
      }
      if(ticket.status==="CLOSED"){
        data.closed+=1;
      }
      if(ticket.status==="IN-PROGRESS"){
        data.progress+=1;
      }
      if(ticket.status==="BLOCKED"){
        data.blocked+=1;
      }

      setTicketCount(Object.assign({},data))
      
    });

  };

  const updateTicket=(ticketdetails)=>{
    //preventDefault(e);
    const ticket={
      assignee : ticketdetails.assignee,
      description : ticketdetails.description,
      id : ticketdetails.id,
      reporter : ticketdetails.reporter,
      status : ticketdetails.status,
      ticketPriority : ticketdetails.ticketPriority,
      title : ticketdetails.title    
    }
      setSelectedCurrTicket(ticket);
      onOpenTicketModal();

  };

  const updateSelectedCurrTicket=(data)=> setSelectedCurrTicket(data);

  const onTicketUpdate =(e) =>{
    e.preventDefault();
    if(e.target.name==='title'){
      selectedCurrTicket.title=e.target.value;
    }

    updateSelectedCurrTicket(Object.assign({},selectedCurrTicket));
    
  };

  const updateTicketDetails=(e)=>{
    e.preventDefault();
    updateTicketData(selectedCurrTicket.id,selectedCurrTicket).then(function(response){
        setMessage("Ticket Updated Successfully");
        onCloseTicketModal();
        fetchTickets();
    }).catch(function(error){
      console.log(error.message);
    })
  }


 // console.log("TicketList", ticketList);





  return (
    <div className="bg-light min-vh-100">
      <div className="row">
        <div className="col-1">
          <Sidebar />
        </div>
        <div className="container col m-1">

          <h3 className="text-info text-center">Welcome Engineer.{localStorage.getItem('name')}</h3>
          <p className="text-muted text-center fw-500">Take a Look at Engineer stats below ! </p>

          <div className="row my-5 mx-2 text-center">
            <div className="col my-2 p-2">
              <div className=" borders-b card bg-primary bg-opacity-25 p-2 " style={{ width: 12 + 'rem' }}>
                <div className="cardbody"></div>
                <h5 className="card-subtitle">
                  <i className="bi bi-pencil text-primary mx-2"></i>
                  Open
                </h5>
                <hr />
                <div className='row'>
                  <div className="col">{ticketCount.open}</div>
                  <div className="col">
                    <div style={{ height: 30, width: 30 }}>
                      <CircularProgressbar value={40}
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
            <div className="col my-2 p-2">
              <div className=" borders-b card bg-secondary bg-opacity-25 p-2 " style={{ width: 12 + 'rem' }}>
                <div className="cardbody"></div>
                <h5 className="card-subtitle">
                  <i className="bi bi-lightning-charge text-warning mx-2"></i>
                  Progress
                </h5>
                <hr />
                <div className='row'>
                  <div className="col">{ticketCount.progress}</div>
                  <div className="col">
                    <div style={{ height: 30, width: 30 }}>
                      <CircularProgressbar value={60}
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
            <div className="col my-2 p-2">
              <div className=" borders-b card bg-danger bg-opacity-25 p-2 " style={{ width: 12 + 'rem' }}>
                <div className="cardbody"></div>
                <h5 className="card-subtitle">
                  <i className="bi bi-slash-circle text-secondary mx-2"></i>
                  Blocked
                </h5>
                <hr />
                <div className='row'>
                  <div className="col">{ticketCount.blocked}</div>
                  <div className="col">
                    <div style={{ height: 30, width: 30 }}>
                      <CircularProgressbar value={50}
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
            <div className="col my-2 p-2">
              <div className=" borders-b card bg-success bg-opacity-25 p-2 " style={{ width: 12 + 'rem' }}>
                <div className="cardbody"></div>
                <h5 className="card-subtitle">
                  <i className="bi bi-check2-circle text-success mx-2"></i>
                  Closed
                </h5>
                <hr />
                <div className='row'>
                  <div className="col">{ticketCount.closed}</div>
                  <div className="col">
                    <div style={{ height: 30, width: 30 }}>
                      <CircularProgressbar value={90}
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
            <hr />
            {/* Material Table Starts*/}

            <MaterialTable
                 onRowClick={(event,editTicket)=>updateTicket(editTicket)}
                  columns={columns}
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
                      backgroundColor: 'lightblue',
                      color: 'black',
                      fontWeight:'bold'
                    },
                    rowStyle: {
                      backgroundColor: '#eee',
      
                    },
                    filtering: true, searchFieldVariant: 'filled', paginationType: 'stepped', pageSizeOptions: [5, 10, 25, 100, 200, 400],title:{ fontWeight:'bold'}
                  }}
              data={ticketList}
              title="Ticket Records"
  
            >
            </MaterialTable>
            {
              ticketModal ?(
                <Modal 
                show={ticketModal}
                onHide={onCloseTicketModal}
                backdrop="static"
                keyboard={false}
                centered>
                <Modal.Header closeButton>
                <Modal.Title>Update Ticket</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                <form onSubmit={updateTicketDetails}>
                 <div className="p-1">
                
                 <h5 className="card-subtitle mb-2 text-primary lead">Ticket ID:{selectedCurrTicket.id}</h5>
                 <hr/>
                 <div className="input-group mb-3">
                 <label className="label input-group-text label-md">Title</label>
                 <input className="form-control" type='text' name='title' value={selectedCurrTicket.title} onChange={onTicketUpdate} required/>
                 </div>
                 <div className="m-1">
                 <Button type="submit" variant="primary" >Update</Button>
                 </div>
                 </div>
                </form>
                </Modal.Body>

                </Modal>
              ):("")
            }

          </div>

        </div>
      </div>
    </div>

  );
}

export default Engineer;