import './css/cdn.jsdelivr.net_npm_bootstrap@5.2.3_dist_css_bootstrap.min.css';
import './css/reset.css';
import './css/layout.css';

import {BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {LeftModule } from "./components/LeftModule";
import {ShowTurnos} from "./components/ShowTurnos";
import {CreateTurno3} from "./components/CreateTurno3";
import {EditTurno3} from "./components/EditTurno3";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="container-fluid">
          <div className="row">
            <LeftModule/>
            <Routes>
              <Route path="/" element={<ShowTurnos/>}/>
              <Route path="/createTurno3" element={<CreateTurno3/>}/>
              <Route path="/editTurno3/:id" element={<EditTurno3/>}/>
            </Routes>
          </div>
        </div>  
      </BrowserRouter>

    </div>
  );
}

export default App;
