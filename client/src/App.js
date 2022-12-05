import './App.css';
import {React, useState} from 'react';
import Axios from 'axios';

function App() {

  const [value, setValue] = useState(false);

  var motorState = 0;
  
  const getMotorState = () => {
    Axios.get('http://localhost:3001/get/motor').then((res) => {
      motorState = res.data.data;
      cond(motorState)
    })
  }
  
  const cond =(state)=>{
    if(state === 1) {
      setValue(true)
    } else if(state === 0) {
      setValue(false)
    }
  }

  const postMotorState = (state) => {
    Axios.post('http://localhost:3001/post/motor', {
      data: state
    }).then((response) => {
      console.log(response);
    })
  };
  
  const toggler = () => {
    if(value === true) {
      console.log("0");
      setValue(false)
      postMotorState(0);
    } else {
      console.log("1");
      setValue(true);
      postMotorState(1);
    }
  }

  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [moisture, setMoisture] = useState(0);
  const [light, setLight] = useState(0);

  const getData = () => {
    Axios.get('http://localhost:3001/get/hydroponic/data').then((response) => {
      setTemperature(response.data.temperature);
      setHumidity(response.data.humidity);
      setMoisture(response.data.moisture);
      setLight(response.data.light);
    })
  }

  setInterval(getData,10000);
  setInterval(getMotorState, 3000);

  return (
  <div className='App'>
    <h1>HYDROPONIC SYSTEM</h1>
      <div className = "parameters">
        <p>
          Hydroponic temperature = {temperature}
          <br></br>
          Hydroponic humidity = {humidity}
          <br></br>
          Hydroponic Moisture = {moisture}
          <br></br>
          Hydroponic light intensity = {light}
        </p>
      </div>
      <div className='motor-control'>
        <h2>Motor Button</h2>
        <label className="switch" >
          <input type="checkbox" checked={value} onClick={toggler}></input>
          <span className="slider round"></span>
        </label>
      </div>
  </div>   
 );
}

export default App