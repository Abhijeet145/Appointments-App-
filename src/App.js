import { useState, useEffect,useCallback } from 'react';
import { BiCalendar } from 'react-icons/bi';
import Search from './components/Search';
import AddAppointment from './components/AddAppointment';
//import appointmentList from './components/data.json';
import AppointmentInfo from './components/AppointmentInfo.js';
function App() {
  const [appointmentList , setAppointmentList] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("petName");
  const [orderBy, setOrderBy] = useState("asc");

  const filteredAppointments = appointmentList.filter(
    item => {
      return (
        item.petName.toLowerCase().includes(query.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        item.aptNotes.toLowerCase().includes(query.toLowerCase())
      );
    }
  ).sort((a,b)=>{
    const order = orderBy === "asc"?1:-1;
    return (
      a[sortBy].toLowerCase() < b[sortBy].toLowerCase() ? -1 * order : 1 * order
    );
  });

  const fetchData = useCallback(()=>{
      fetch(`./data.json`)
      .then(response => response.json())
      .then(data => {
        setAppointmentList(data);
      });
  },[]);

  useEffect(()=>{
    fetchData();
  },[fetchData]);
  
  return (
    <div className="App container mx-auto mt-3 font-thin ">
      <h1 className='text-5xl mb-4'>
      <BiCalendar className='inline-block text-red-400 align-top' />Your Appointments</h1>   
      <AddAppointment 
        onSendAppointment={(myAppointment)=>{setAppointmentList([...appointmentList,myAppointment])}}
        lastId={
          appointmentList.reduce((max,item) => Number(item.id)>max?Number(item.id):max,0)
          }
        />
      <Search query={query} onQueryChange={(myQuery)=>{setQuery(myQuery);}}
        sortBy={sortBy}
        onSortChange={(mySort)=>setSortBy(mySort)}
        orderBy={orderBy}
        onOrderChange={(myOrder)=>setOrderBy(myOrder)}
      />
      <ul className='divide-y divide-grey-200'>
        {
          filteredAppointments.map((appointment) => (
            <AppointmentInfo key = {appointment.id}
             appointment={appointment}
             onDeleteAppointment = { appointmentId =>
             setAppointmentList(appointmentList.filter( appointment =>
              appointmentId !== appointment.id
             ))}
            />
          ))
        }
      </ul>

    </div>
  );
}

export default App;
