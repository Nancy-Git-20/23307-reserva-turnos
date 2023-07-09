import logo from '../img/working-hours.png';
import {BrowserRouter, Routes, Route, Link } from "react-router-dom";


export const LeftModule = ()=>{
    
    return(
        <>
            <div className="col-sm-5 ColLeft d-flex align-items-center">
                <Link to="/"><h1><img className="Logo" src={logo} alt="LOGO"/></h1></Link>
                <h2>Reserva de Turnos</h2>
            </div>
        </>
    );
}