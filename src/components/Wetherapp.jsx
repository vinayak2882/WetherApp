import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import axios from 'axios';
import {imLocation} from 'react-icons/im'
import {BiSearch} from 'react-icons/bi';
import Chart from "react-apexcharts";

const Wetherapp = () => {
    const [citys, setCitys] = useState([""])
    const [weather, setWeather] = useState([])
    const [display, setDisplay] = useState(true)
    const [namesct, setnamesct] = useState('Solapur')
      const Currentlocation = (e) => {
      axios
      .get("https://ipinfo.io/json?token=52ed0181817dc8")
      .then((response) => {
        setnamesct(response.data.city)
        WeatherData(response.data.city)
        localStorage.setItem('cityName', JSON.stringify(response.data.city))
      })
    }
    const arr = useRef([])
 
    useEffect(()=>{
      Currentlocation()
      },[])

    
    const weekdaysData = (latitude,longitude) => {
      axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=7edb22c1fe54e5a265ee62c5d502ed63&units=metric`)
      .then((res)=>{
      setWeather(res.data.daily)
      let day = res.data.daily[0].feels_like
           arr.current =  Object.values(day)
          }).catch((error)=>{
         console.log('error',error)
   
         })
       }

    const WeatherData = (cityname) => { 
      let longitude; 
      let latitude;
      axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&cnt=7&appid=62dd5f4098aaef7c00b3f3bad07323ec&units=metric`).then((res)=>{
        longitude = res.data.city.coord.lon
        latitude = res.data.city.coord.lat
       
      }).catch((error)=>{
        console.log( error)
      })
       setTimeout(()=>{
        weekdaysData(latitude, longitude) 
      },500)
      }
   


    const Citydatafetch = (e) => { 
      const {value} = e.target
           if(value.length !== 0){
        setDisplay(false)
        axios.get(`https://vinayak2882.github.io/data.api/citylist.json`).then(({data})=>{
          let arr = data.filter((e) =>
          e.city.toLowerCase().includes(value)
            );
             setCitys([...arr])
              }).catch((error)=>{
            console.log('error:', error)
          })
        }
        else{
        setDisplay(true)
          }
    }
         const Wetherget = (el) => { 
          setDisplay(true)
          WeatherData(el.city) 
          setnamesct(el.city)
          localStorage.setItem('cityName', JSON.stringify(el.city))
    }
  
  return (
  <div className='Fullscreen'>
  <div className='mobilescreen'>
     <div className='searchbar'>
        <div className='childdiv'>
            <div className='inputdiv'>
            <imLocation style={{fontSize:"23px",marginTop:"10px"}}></imLocation>
            <input type="text"  placeholder="Search" onChange={Citydatafetch }  /> 
            </div>
            <div className='citysearch'><BiSearch style={{fontSize:"20px",marginTop:"15px"}}></BiSearch></div>
        </div>
          </div>
          <div className='citydiv' style={{display: display ? "none" : 'block' }}>
           {citys.map((e,index) => {
                    return(
                <div key={index} className='citychilddiv'  onClick={()=>{Wetherget(e)}} >
                  <span className='city'>{e.city}</span>  , <span className='state'>{e.state}</span>
                   
                </div>
              )
            })}
          
           </div>
      
     
            
   
      <h3>{namesct}</h3>
     <div className='wetherdivfull'>
            {weather.map((e, index)=>{
           return(
              <div key={index} className='bossdivwether' >
                 <h3  style={{margin:'0px'}}>{new Date(`${e.dt}`* 1000).toLocaleDateString("EN", {weekday: "short"})}</h3>
                  <div style={{display:"flex",margin:"auto"}}>
                    <h4 className='temp'>{Math.round(e.temp.min)}°</h4>
                   <h4 className='temp'>{Math.round(e.temp.max)}°</h4>
                   </div>
                   <img src={`https://openweathermap.org/img/wn/${e.weather[0].icon}.png`} alt="abc"  />
                <p style={{margin:'0px'}}>{e.weather[0].main}</p>
                {/* <p>{e.weather[0]}</p> */}
              </div>
            )
          })}
      </div>



<div className='lowerdiv'>
         <Chart id='lower_Data'
          type="area"
          series={[
            {
              name: "Temperature",
              data: [...arr.current],
            },
          ]}
          options={{
            dataLabels: {
              formatter:(val) => {
              },
            },
            xaxis: {
              categories: ["9:00am", "10:00am", "11:00pm", "12:00pm","1:00pm","2:00pm"],
            },
          }}
        />


 <div className='humidiv'>
         <div className='humtop'>
                <div>
                    <h3>Pressure</h3>
                    <p>1111ph</p>
                </div>
                <div>
                <h3>Humidity</h3>
                <p>38%</p>
                </div>
                </div>
                <div className='humlow'>
                <div><h3>Sunrise</h3>
                <p>5:55am</p></div>
                <div><h3>Sunset</h3>
                    <p>5:45pm</p></div>
                </div>
               </div>
               </div>

          </div>
  </div>
  )
}

export default Wetherapp
