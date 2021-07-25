import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import Dialog from "@material-ui/core/Dialog";
import firebase from "../firebase"


const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "600px",
};
const center = {
  lat: 37.33,
  lng: -121.893,
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
}



export default function Individual() {
  const {isLoaded, loadError} = useLoadScript({
   googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
   libraries,
  });

  const [markers, setMarkers] = React.useState([]);
  const [selectedMarker, setSelectedMarker] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  
  const signUpRef = firebase.firestore().collection("/signups");

  function addSignUp(newSignUp){
    signUpRef
    .doc()
    .set(newSignUp)
    .catch((err) => {
      console.error(err);
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
      for (let i in eventInfo) {
        setMarkers(eventInfo);
      }
    });
  }, []);

  const handleSignUpOpen = () =>{
      setOpen(true);
  }

  const handleSignUpClose = () =>{
    setOpen(false);
}

  const { register, handleSubmit } = useForm();

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, [])

  if(loadError) return "Error loading maps";
  if(!isLoaded) return "Loading maps";

  return <div>
    <h1>Refood Individual Interface</h1><br />
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
                <button className = 'signup-button' onClick = {handleSignUpOpen} >Sign Up</button>
                <Dialog
                  open = {open}
                  onClose = {handleSignUpClose}
                  PaperProps={{
                    style: { borderRadius: 20, width: "55vh"}
                  }}>
                      <div class = "sign-form">
                        <h2>Event Sign Up</h2>
                        <br />
                        <form id = "signup-form" onSubmit = {handleSubmit((data) =>{
                          addSignUp(data);
                          document.getElementById("signup-form").reset();
                        })}>
                          <div class = "field">
                            <input type = "text" required {...register("fname")} /><br/><br/>
                            <label>First Name</label>
                          </div>
                          <div class = "field">
                            <input type = "text" required {...register("lname")} /><br/><br/>
                            <label>Last Name</label>
                          </div>
                          <div class = "field">
                            <input type = "email" required {...register("email")} /><br/><br/>
                            <label>Email</label>
                          </div>
                            <input type = "submit" />
                        </form>
                      </div>
                </Dialog>
              </div>
            </InfoWindow>
          ) : null}

      </GoogleMap>
    </div>
  </div>
}
