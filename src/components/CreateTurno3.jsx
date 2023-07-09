import { useState, useEffect, useRef, forwardRef } from "react";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {collection, getDocs, addDoc, deleteDoc,doc} from "firebase/firestore";
import {db} from "../firebaseConfig/firebase.js";

import calendar from '../img/calendar.png';

/*REACT-DATE-PICKER*/
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// CSS Modules, react-datepicker-cssmodules.css// 
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
//import es from 'date-fns/locale/es';
registerLocale('es', es)



export const CreateTurno3 = () => {

    const[startDate, setStartDate] = useState(new Date());
    const[hoy, setHoy] = useState(new Date());
    const[nombre,setNombre] = useState("");
    const[apellido,setApellido] = useState("");
    const[email,setEmail] = useState("");
    const[telefono,setTelefono] = useState("");
    const[comentarios,setComentarios] = useState("");
    const[disabledDates, setDisabledDates] =  useState([]);
    const[arrExcludedTimes, setArrExcludedTimes] =  useState([]);
    const[datosVisible, setDatosVisible] = useState(false);

    const navigate = useNavigate();
    const turnosCollection = collection(db,"turnosColeccion");
    const dpReference = useRef(null);

    const cargarTurno = async(e)=>{
        e.preventDefault();
        await addDoc (turnosCollection,{
            Nombre:nombre,
            Apellido:apellido,
            Email:email,
            Telefono:telefono,
            Comentarios:comentarios,
            Turno: startDate + ' - '
        })
        navigate("/");
    }
   
    const getTurnos = async () =>{
        const data = await getDocs(turnosCollection);
        data.forEach((date) => {
            if (!disabledDates.includes(date.data().Turno)) {
                disabledDates.push(date.data().Turno)
            }
        });
    handleDisabledDates()
    
    }

    //let arrExcludedTimes = [];
    const handleDisabledDates = () => {
        const today = format(startDate, "dd-MM-yyyy");
        //console.log('hola', disabledDates.length)
        for (let i = 0; i < disabledDates.length; i++) {
            const reserva = format(new Date(disabledDates[i]),"dd-MM-yyyy");
            //console.log('reserva - today', reserva + '--' + today);
            if( reserva == today ){
                //console.log('reserva ', reserva, ' today ', today);
                arrExcludedTimes.push(
                    setHours(
                        setMinutes(new Date(disabledDates[i]), new Date(disabledDates[i]).getMinutes()),
                        new Date(disabledDates[i]).getHours()
                    )
                );
            }
        }
        //console.log('array con fechas? ', arrExcludedTimes)
        setArrExcludedTimes(arrExcludedTimes)
    }
    

    useEffect(() => {
       getTurnos();
    }, [startDate]); //startDate

    // en el caso de querer setear un horario marcado
    //-> const [startDate, setStartDate] = useState(setHours(setMinutes(new Date(), 30), 16));

    let handleDisplay = (time) => {
        //return time.getHours() < 9   ? "text-success" : "text-error";
        let horario = time.getHours() < 9 ? "HideTime" : 
                      time.getHours() > 18.5 ? "HideTime" :
                      "ShowTime";
        return horario;
    };
    const isWeekday = (date) => {
        const day = date.getDay();
        return day !== 0 && day !== 6;
    };

    const filterPassedTime = (time) => {
        //console.log('TIME:::', time);
        const currentDate = startDate;
        const selectedDate = new Date(time);
        return currentDate.getTime() < selectedDate.getTime();
        // aca cuando cambia de dia tendria que habilitar todos los horarios.
    };

    const checkDate = (date) => {
        //console.log('Dia seleccionado es: ', date)
        setStartDate(date);
        setArrExcludedTimes([]);
    }
    const cargarDatosUser = () => {
        datosVisible === false ? setDatosVisible(true) : setDatosVisible(false) 
    }

    function range(start, end) {
        var ans = [];
        for (let i = start; i <= end; i++) {
            ans.push(i);
        }
        return ans;
    }
    
    const years = range(new Date().getFullYear(), new Date().getFullYear() + 1, 1);
    const months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];
    

    return(
        <div className="col-sm-7 ColRight d-flex align-items-center">
            <div className="container">
                <div className="row">
                    <div className="col">

                        <h5 className="BackWrap"> <Link to ="/" className="BackLink"> <i className="fa-solid fa-backward"></i> volver </Link> </h5>
                        <h4 className="Title">
                            <span className="Icon"><img src={calendar} alt="*"/></span> Reservar turno 
                            <span className="Today mt-2"> <i className="fa-solid fa-calendar-check"></i> Hoy es: <span>{`${format(hoy, 'PPPPp', {locale:es})}`}hs. </span> </span>
                        </h4>
                       
                        <div className="WrapContainer">
                            <form className="FormAsignarTurno" onSubmit={cargarTurno}>
                                <fieldset>
                                    <div className="mb-3">
                                        <label className="form-label"><strong>Seleccionar fecha y hora:</strong></label>
                                        <div className="WrapDP">
                                            <DatePicker
                                                ref={dpReference}
                                                /*Date Select*/ 
                                                dateFormat="dd/MM/yyyy hh:mm"
                                                selected={startDate}
                                                onChange={(date) => checkDate(date)}
                                                minDate={new Date()}
                                                filterDate={isWeekday}
                                                locale="es"
                                                calendarStartDay={0}
                                                highlightDates={[subDays(new Date(), 2), addDays(new Date(), 2)]}
                                                inline
                                                shouldCloseOnSelect={false}
                                                /*Time Select*/
                                                showTimeSelect
                                                timeClassName={handleDisplay}
                                                //Aca para anular horarios anteriores a la hora actual
                                                //filterTime={filterPassedTime}
                                                //Aca para marcar horarios que ya esten reservados:
                                                excludeTimes={arrExcludedTimes}
                                                timeIntervals={30}
                                                // minTime={new Date(0, 0, 0, 9, 0)}
                                                // maxTime={new Date(0, 0, 0, 18, 30)}
                                                timeCaption="Horarios disponibles"
                                                renderCustomHeader={({
                                                    date,
                                                    changeYear,
                                                    changeMonth,
                                                    decreaseMonth,
                                                    increaseMonth,
                                                    prevMonthButtonDisabled,
                                                    nextMonthButtonDisabled,
                                                  }) => (
                                                    <div>
                                                        <button type="button" onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="react-datepicker__navigation react-datepicker__navigation--previous" aria-label="Previous Month">
                                                            {<span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--previous">Previous Month</span>}
                                                        </button>
                                                        
                                                        <span className="WrapSelect">
                                                            <select className="MonthSel"
                                                                value={months[date.getMonth()]}
                                                                onChange={({ target: { value } }) =>
                                                                changeMonth(months.indexOf(value))
                                                                }
                                                            >
                                                                {months.map((option) => (
                                                                <option key={option} value={option}>
                                                                    {option}
                                                                </option>
                                                                ))}
                                                            </select>
                                                            <span className="Arrow"></span>
                                                        </span>

                                                        <span className="WrapSelect">
                                                            <select className="YearSel"
                                                                value={date.getFullYear()}
                                                                onChange={({ target: { value } }) => changeYear(value)}
                                                            >
                                                                {years.map((option) => (
                                                                <option key={option} value={option}>
                                                                    {option}
                                                                </option>
                                                                ))}
                                                            </select>
                                                            <span className="Arrow"></span>
                                                        </span>

                                                        <button type="button" onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="react-datepicker__navigation react-datepicker__navigation--next react-datepicker__navigation--next--with-time" aria-label="Next Month">
                                                            {<span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--next">Next Month</span>}
                                                        </button>
                                                      
                                                    </div>
                                                  )}
                                                
                                            />

                                            <h5 className="Reserva mt-2"> <i className="fa-solid fa-calendar-check"></i> Seleccionó el {`${format(startDate, 'PPPPp', {locale:es})}`}hs. </h5> 

                                            <button type="button" className="btn Custom" onClick={cargarDatosUser}> Cargar datos de usario </button>

                                        </div>

                                    </div>
                                </fieldset>

                                <fieldset id="DatosUser" className={datosVisible === true ? "Visible" : "Hidden"}>
                                    <h5 className="Reserva mt-2"> <i className="fa-solid fa-calendar-check"></i> Seleccionó el {`${format(startDate, 'PPPPp', {locale:es})}`}hs. </h5> 

                                    <div className="row">
                                        <div className="mb-3 col-sm-6">
                                            <label className="form-label">Nombre</label>
                                            <input className="form-control" type="text" placeholder="Ingresar nombre" value={nombre} onChange={(e)=> setNombre(e.target.value)} />
                                        </div>
                                            <div className="mb-3 col-sm-6">
                                            <label className="form-label">Apellido</label>
                                            <input className="form-control" type="text" placeholder="Ingresar apellido" value={apellido} onChange={(e)=> setApellido(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="mb-3 col-sm-6">
                                            <label className="form-label">Email</label>
                                            <input className="form-control" type="email" placeholder="Ingresar email" value={email} onChange={(e)=> setEmail(e.target.value)} />
                                        </div>

                                        <div className="mb-3 col-sm-6">
                                            <label className="form-label">Telefono</label>
                                            <input className="form-control" type="text" placeholder="Ingresar telefono celular" value={telefono} onChange={(e)=> setTelefono(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="row"> 

                                        <div className="mb-3 col-sm-12" >
                                            <label className="form-label">Comentarios</label>
                                            <textarea className="form-control" rows="3" value={comentarios} onChange={(e)=> setComentarios(e.target.value)}
                                             placeholder="Ingresar informacion adicional"></textarea>


                                            <button type="button" onClick={cargarDatosUser} className="btn BackBtn mt-4"> Mmmm... quiero cambiar la fecha </button>
                                            <button type="submit" className="btn Custom mt-4"> Cargar Turno </button>
                                        
                                        </div>
                                        

                                    </div>    
                                </fieldset>
                               


                            </form>

                          </div> 
                    </div>
                </div>
            </div>
        </div>
    )
}