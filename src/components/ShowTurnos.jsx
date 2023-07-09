import { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import {collection, getDocs, deleteDoc, doc} from "firebase/firestore";
import {db} from "../firebaseConfig/firebase.js";
import Swal from "sweetalert2";
import whithReactContent from "sweetalert2-react-content";
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

import nocalendar from '../img/no-calendar.png';

const mySwal = whithReactContent(Swal);

export const ShowTurnos = ()=>{
    
    const [turnos, setTurnos] =  useState([]);
    const turnosCant = turnos.length; //console.log(turnosCant);

    const turnosCollection = collection(db,"turnosColeccion");

    const getTurnos = async () =>{
        const data = await getDocs(turnosCollection);
        //console.log('data.docs: ', data.docs);
        setTurnos(
            data.docs.map((doc)=>({...doc.data(),id:doc.id}))
        );
        //console.log('TURNOSS:::', turnos);
    }

    const deleteTurno = async(id)=>{
        const turnosDoc = doc(db,"turnosColeccion", id);
        await deleteDoc(turnosDoc);
        getTurnos();
    }

    const confirmDelete = (id)=>{
        Swal.fire({
            title: 'Esta seguro de cancelar este turno?',
            text: "Esta accion no podra ser revertida",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si eliminar!'
          }).then((result) => {
            if (result.isConfirmed) {
              /// eliminar deletePlayer
              deleteTurno(id);  
              Swal.fire(
                'Listo!',
                'Se cancelo el turno',
                'success'
              )
            }
          })
    }

    useEffect(()=>{
        getTurnos();
    },[]);

    return(
        <div className="col-sm-7 ColRight d-flex align-items-center">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="d-grid">
                            
                            <Link to="/CreateTurno3" className="btn Custom mt-3 mb-3 m-auto">Reservar Turno</Link>

                        </div>
                        <div className="WrapContainer">
                            <h5 className="text-start">Reservas realizadas:</h5>
                            <div className="ScrollTable">
                                <table className="table Show">
                                    <thead>
                                        <tr>
                                            <th className="HideMbl"><i className="fa-solid fa-camera"></i></th>
                                            <th>Nombre y apellido</th>
                                            {/* <th>Email</th> */}
                                            <th className="HideMbl">Telefono</th>
                                            <th className="TurnoCell">Turno</th>
                                            {/* <th>Comentarios</th> */}
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody> 
                                        {
                                        turnosCant === 0 ? <tr><td colSpan='5'> <span className="NoCalendar"><img src={nocalendar} alt="*"/></span>
                                             <strong className="Nop">No hay turnos reservados </strong> </td></tr> 
                                        :
                                        turnos.map((turno)=>(
                                            <tr key={turno.id}>
                                                <td className="HideMbl"><span className="FrameUser"><i className="fa-solid fa-user"></i></span></td>
                                                <td>{turno.Nombre + ' ' + turno.Apellido }</td>
                                                {/* <td>{turno.Email}</td> */}
                                                <td className="HideMbl"><Link to={`https://api.whatsapp.com/send?phone=54${turno.Telefono}&text=%F0%9F%99%82%20Hola`} target="_blank" rel="noreferrer" 
                                                className="LinkTurno">{turno.Telefono}</Link></td>
                                                {/* <td style={{width: "100px"}}>{`${format(turno.Turno, 'PPPPp', {locale:es})}`} {JSON.stringify(turno.Turno)}</td> */}
                                                {/* <td style={{width: "100px"}}> {JSON.stringify(turno.Turno)}</td> */}
                                                <td> {`${format(new Date(turno.Turno), 'PPPPp', {locale:es})}`} </td>
                                                {/* <td>{turno.Comentarios}</td> */}
                                                <td className="ActionsTable">
                                                    <Link to={`/editTurno3/${turno.id}`} className="btn btn-light"><i className="fa-solid fa-pencil"></i></Link>
                                                    <button onClick={()=>{confirmDelete(turno.id)}} className="btn btn-danger"> <i className="fa fa-trash"></i></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>    
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
}