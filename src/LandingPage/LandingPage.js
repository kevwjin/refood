import React from "react";
import "../index.css"
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function StoreApp() {

  return <div id = "container">
      <img class = 'lp-logo' src="refood_transparent.png" alt="Refood Logo" />
      <Link to = "/store-view">
        <button className = 'landing-button'>Sign in as Store</button>
      </Link>
      <Link to = "/i-view">
        <button className = 'landing-button'>View Upcoming Events</button>
      </Link>
    </div>
  }