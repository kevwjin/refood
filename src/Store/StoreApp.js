import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import firebase from "../firebase"
import { reflect } from "async";
import { Link } from "react-router-dom";


const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};
const center = {
  lat: 37.33,
  lng: -121.893,
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
}

export default function StoreApp() {
  const {isLoaded, loadError} = useLoadScript({
   googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
   libraries,
  });

  const [markers, setMarkers] = React.useState([]);
  const [selectedMarker, setSelectedMarker] = React.useState(null);
  const [signUps, setSignUps] = React.useState([]);

  const signUpRef = firebase.firestore().collection("/signups");

  function getSignUps(){
    signUpRef.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setSignUps(items);
    })
  }

  useEffect(() => {
    const ref = firebase.database().ref("/EventInfo");
    let eventInfo = [];
    ref.on("value", (response) => {
      const data = response.val();
      for (let id in data) {
        eventInfo.push({
          data: data[id].data,
          time: data[id].time,
        });
      }
      setMarkers(eventInfo);
    });
    getSignUps();
  }, []);


  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    const firestore = firebase.database().ref("/EventInfo");
    firestore.push({ data, time: new Date().toString() });
    setMarkers((current) => [
      ...current,
      { data, time: new Date().toString() },
    ]);
    document.getElementById("add-marker-form").reset();
  }

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, [])

  if(loadError) return "Error loading maps";
  if(!isLoaded) return "Loading maps";



  return <div>
    <div>
      <img src="../refood-h-white.png" alt="Refood Logo" className = "logo" />
      <Link to = "/">
        <button className = 'nav-button'>Sign out</button>
      </Link>
    </div>
    <div class = "map">
      <h2 class = "map-header">Food Event Map</h2>
      <GoogleMap 
        mapContainerStyle = {mapContainerStyle}
        zoom = {12}
        center = {center}
        options = {options}
        onLoad = {onMapLoad}
        onClick = {()=>setSelectedMarker(null)}
      >
        {/* renders markers on the map */}
        {markers.map((marker) => (
          <Marker
            key = {marker.time}
            position = {{lat: parseFloat(marker.data.lat), lng: parseFloat(marker.data.lng)}}
            icon = {{
              url: '../refood_icon.png',
              scaledSize: new window.google.maps.Size(45,45),
              origin: new window.google.maps.Point(0,0),
              anchor: new window.google.maps.Point(22.5,22.5)
            }}
            onClick = {() => {
              setSelectedMarker(marker);
            }}
          />
        ))}

        {selectedMarker ? (
            <InfoWindow
              position={{ lat: parseFloat(selectedMarker.data.lat), lng: parseFloat(selectedMarker.data.lng) }}
              onCloseClick={() => {
                setSelectedMarker(null);
              }}
            >
              <div>
                <h2>
                  {selectedMarker.data.name}
                </h2>
                <p>
                  {selectedMarker.data.description}
                </p>
                <p>
                  Event start: {selectedMarker.data.startDate}
                </p>
                <p>
                  Event end: {selectedMarker.data.endDate}
                </p>
              </div>
            </InfoWindow>
          ) : null}

      </GoogleMap>
    </div>
    <br /><br />
    <div class = "create-event">
      <h2 class = "form-header">Create New Event</h2><br />
      <form onSubmit = {handleSubmit(onSubmit)} id = "add-marker-form">
        <div class = "field">
         <input type = "number" step = "any" required {...register("lat")} /><br/><br/>
         <label>Latitude</label>
        </div>
        <div class = "field">
         <input type = "number" step = "any" required {...register("lng")} /><br/><br/>
         <label>Longitude</label>
        </div>
        <div class = "field">
         <input type = "text" required {...register("name")} /><br/><br/>
         <label>Event name</label>
        </div>
        <div class = "field">
         <input type = "datetime-local" required {...register("startDate")} /><br/><br/>
         <label>Event start</label>
        </div>
        <div class = "field">
         <input type = "datetime-local" required {...register("endDate")} /><br/><br/>
         <label>Event end</label>
        </div>
        <div class = "field">
          <input type = "text" required {...register("description")} /><br/>
         <label>Event description</label>
        </div>
         <input type = "submit" />
    </form>
    </div>
    <h1>Sign Ups</h1>
    <div id = "table-container">
      <table>
        <thead>
          <th>Event Name</th>
          <th>Attendee Name</th>
          <th>Attendee Email</th>
        </thead>
        <tbody>
          {signUps.map((signup) => (
            <tr>
              <td>{signup.eventName}</td>
              <td>{signup.data.fname} {signup.data.lname}</td>
              <td>{signup.data.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
}
