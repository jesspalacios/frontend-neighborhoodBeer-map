import React, { Component } from "react";
import scriptLoader from "react-async-script-loader";
import { MAP_KEY } from "../data/credentials";
import { mapStyles } from "../data/mapStyles.js";
//^^Keep Secret key info in the Data Folder
import ListView from "./ListView";
import spinner from "../images/circles-loader.svg";
import foursquare from "../images/foursquare.png";

class App extends Component {
  state = {
    listOpen: true,
    map: {},
    infowindow: {},
    bounds: {},
    mapReady: false,
    //Miami lat & long 
    //If you want to change to another city change the info below
    mapCenter: { lat: 26.083738243673544, lng: -80.20089268684387 },
    mapError: false,
    width: window.innerWidth
  };

  componentDidMount() {
    window.addEventListener("resize", this.updateWidth);
  }

  componentDidUpdate({ isScriptLoadSucceed }) {
    // Check if script is loaded and if map is defined
    if (isScriptLoadSucceed && !this.state.mapReady) {
      // create map
      const map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 50,
        center: this.state.mapCenter,
        styles: mapStyles
      });

      // set up bounds and info window to use later
      const bounds = new window.google.maps.LatLngBounds();
      const infowindow = new window.google.maps.InfoWindow({ maxWidth: 400 });

      this.setState({
        map: map,
        infowindow: infowindow,
        bounds: bounds,
        mapReady: true
      });

      // alert user if map request fails
    } else if (!this.state.mapReady) {
      this.setState({ mapError: true });
    }
  }

  toggleList = () => {
    const { width, listOpen, infowindow } = this.state;

    if (width < 500) {
      // close infowindow if listview is opening
      if (!listOpen) {
        infowindow.close();
      }
      this.setState({ listOpen: !listOpen });
    }
  };

  updateWidth = () => {
    const { map, bounds } = this.state;
    this.setState({ width: window.innerWidth });
    if (map && bounds) {
      map.fitBounds(bounds);
    }
  };

  render() {
    const {
      listOpen,
      map,
      infowindow,
      bounds,
      mapReady,
      mapCenter,
      mapError
    } = this.state;

    return <div className="container" role="main">
      <nav id="list-toggle" className="toggle" onClick={this.toggleList}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M2 6h20v3H2zm0 5h20v3H2zm0 5h20v3H2z" />
        </svg>
      </nav>
      <section id="beerList" aria-labelledby="beerList" className={listOpen ? "list open" : "list"} role="complementary" tabIndex={listOpen ? "0" : "-1"}>
        <h1 className="app-title">Beer Maps</h1>
        <hr />
        {/* rendering the markers only when map has loaded */
          mapReady ? <ListView map={map} infowindow={infowindow} bounds={bounds} mapCenter={mapCenter} toggleList={this.toggleList} listOpen={listOpen} /> : <p>
            We are experiencing loading issues. Please check your internet
            connection
            </p>}
        <img src={foursquare} alt="Powered by Foursquare" className="fs-logo" />
      </section>
      <section id="map" className="map" role="application" aria-labelledby="map">
        {mapError ? <div id="map-error" className="error" role="alert" aria-labelledby="map-error">
          Google Maps did not load. Please try again later...
            </div> : <div className="loading-map">
            <h4 className="loading-message">Map is loading...</h4>
            <img src={spinner} className="spinner" alt="loading indicator" />
          </div>}
      </section>
    </div>;
  }
}

//google map script that's required for Map to appear. 
export default scriptLoader([
  `https://maps.googleapis.com/maps/api/js?key=${MAP_KEY}`
])(App);
