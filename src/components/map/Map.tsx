import React, { Component } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { MAP_CONFIG } from '../../Constants/Constants';
import { germanBorderData } from '../../Constants/coords.geojson';
import { multipolygonToGPolygon, geocodeLocation } from '../../utils/Utils';

import { connect } from 'react-redux';
import {
  setLastValidCoords, setGeocoder, setMapInstance, setActiveMarker, editMarkerPosition
} from '../../store/Actions';
import { IAppState } from '../../store/Store';

const GoogleMapWrapper = (props: any) => {
  return <LoadScript
    googleMapsApiKey={MAP_CONFIG.GOOGLE_API_KEY}
    loadingElement={<div />}
  >
    <GoogleMap
      mapContainerStyle={{ height: '100vh' }}
      onLoad={props.mapLoad}
      options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
    >
    {props.active &&
      <Marker 
        position={props.active.latLng}
        draggable={true}
        icon={MAP_CONFIG.ACTIVE_MARKER_ICON}
        onDragEnd={ev => props.markerDrag(ev)}
        onLoad={props.activeMarkerRef} 
      />}
      {props.markers.map((marker) => {
        return (
          <Marker 
            key={marker._id} 
            position={marker.latLng}
            visible={props.active && props.active._id !== marker._id}
            onClick={()=> props.activateMarker(marker)}
          />
        )
      })
      }
    </GoogleMap>
  </LoadScript>
};

class MapComponent extends Component<any> {
  map: any;
  bordersPolygon: any;
  marker: any;
  geocoder: any;
  activeMarkerRef: any;
  markersRefs: any[] = [];
  /*global google*/
  handleMapLoad(map: any) {
    const bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(MAP_CONFIG.DEFAULT_BOUNDS_RESTRICTIONS.latLngBounds.south, MAP_CONFIG.DEFAULT_BOUNDS_RESTRICTIONS.latLngBounds.west),
      new google.maps.LatLng(MAP_CONFIG.DEFAULT_BOUNDS_RESTRICTIONS.latLngBounds.north, MAP_CONFIG.DEFAULT_BOUNDS_RESTRICTIONS.latLngBounds.east)
    );
    map.fitBounds(bounds);
    map.data.addGeoJson(germanBorderData);
    map.data.setStyle({
      strokeWeight: 1
    });
    this.props.setGeocoder(new google.maps.Geocoder());
    this.props.setMap(map);
  }
  coordinatesPolygon() {
    if (!this.bordersPolygon) {
      this.bordersPolygon = multipolygonToGPolygon(germanBorderData);
    }
    return this.bordersPolygon;
  }
  async markerDrag(p) {
    if (google.maps.geometry.poly.containsLocation(p.latLng, this.coordinatesPolygon())) {
      this.props.updateLastValidCoords(p.latLng.toJSON());
      try {
        const result = await geocodeLocation(p.latLng, this.props.geocoder);
        console.log(result);
        this.props.setMarkerPosition(result);
      } catch (error) {
        console.log(error);
      }
    } else {
      this.activeMarkerRef.setPosition(this.props.lastValidCoords);
    }
  }
  setActiveMarker(m){
    this.props.edit(m);
    this.props.map.setZoom(12);
    this.props.map.panTo(m.latLng);
  }
  public render() {
    return (
      <GoogleMapWrapper 
        mapLoad={this.handleMapLoad.bind(this)} 
        active={this.props.activeMarker} 
        markerDrag={(p)=>this.markerDrag(p)} 
        markers={this.props.markers} 
        activateMarker={(i)=>this.setActiveMarker(i)}
        activeMarkerRef={(ref)=> {this.activeMarkerRef = ref}}
      />
    );
  }
}


const mapStateToProps = (store: IAppState) => {
  return {
    markers: store.mapState.markers,
    lastValidCoords: store.mapState.lastValidCoords,
    activeMarker: store.mapState.activeMarker,
    geocoder: store.mapState.geocoder,
    map: store.mapState.map
  };
};

const mapDispatchToProps = dispatch => ({
  updateLastValidCoords: latLng => {
    dispatch(setLastValidCoords(latLng))
  },
  edit: (id: number) => {
    dispatch(setActiveMarker(id));
  },
  setGeocoder: (geocoder: any) => {
    dispatch(setGeocoder(geocoder));
  },
  setMap: (map: any) => {
    dispatch(setMapInstance(map));
  },
  setMarkerPosition: (pos)=>{
    dispatch(editMarkerPosition(pos));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapComponent);
