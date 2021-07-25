import React from "react";
import StoreApp from "./Store/StoreApp";
import LandingPage from "./LandingPage/LandingPage";
import "./index.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Individual from "./Individual/Individual";

function App() {
  return (
    <div>testing testing testing. Please work github</div>

    // <Router>
    //   <div>
    //     <Switch>
    //       <Route exact path="/store-view">
    //         <StoreApp />
    //       </Route>
    //       <Route exact path="/i-view">
    //         <Individual />
    //       </Route>
    //       <Route exact path="/">
    //         <LandingPage />
    //       </Route>
    //     </Switch>
    //   </div>
    // </Router>
  );
}

export default App;
