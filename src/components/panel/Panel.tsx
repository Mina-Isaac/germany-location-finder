import React, { Component } from 'react';
import './Panel.scss';
import { IAppState } from '../../store/Store';
import { connect } from 'react-redux';
import { setActiveMarker } from '../../store/Actions';
import { IMarker } from '../../store/Reducers';
import ListItem from '../listitem/ListItem';
import { MAP_CONFIG } from '../../Constants/Constants';

export interface PanelProps {
  markers: IMarker[];
  map: any;
  activeMarker?: IMarker;
  add: Function,
}

/*global google*/
class PanelComponent extends Component<PanelProps> {
  addNew(){
    const bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(MAP_CONFIG.DEFAULT_BOUNDS_RESTRICTIONS.latLngBounds.south, MAP_CONFIG.DEFAULT_BOUNDS_RESTRICTIONS.latLngBounds.west),
      new google.maps.LatLng(MAP_CONFIG.DEFAULT_BOUNDS_RESTRICTIONS.latLngBounds.north, MAP_CONFIG.DEFAULT_BOUNDS_RESTRICTIONS.latLngBounds.east)
    );
    this.props.map.fitBounds(bounds);
    this.props.add({_id: MAP_CONFIG.DEFAULT_MARKER_ID, address: "", name: '', latLng: MAP_CONFIG.DEFAULT_CENTER});
  }
  render() {
    return (
      <div className="panel">
        <div className="panel__content">
          <div className="panel__content--header">
            <span>Markers List</span> 
            {
              ( ! this.props.activeMarker || this.props.activeMarker._id !== MAP_CONFIG.DEFAULT_MARKER_ID ) &&
              <button onClick={this.addNew.bind(this)}>+ Add New</button>
            }
          </div>
          <div className="panel__content--body">
            <div className="panel__content--overlay" style={{opacity: this.props.activeMarker ? 0.5 : 0}} ></div>
            {(this.props.activeMarker && this.props.activeMarker._id === MAP_CONFIG.DEFAULT_MARKER_ID ) && 
              <ListItem marker={this.props.activeMarker}></ListItem>
            }
          {this.props.markers.map((marker) => 
            <ListItem key={marker._id} marker={marker}></ListItem>
          )}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (store: IAppState) => {
  return {
    markers: store.mapState.markers,
    activeMarker: store.mapState.activeMarker,
    map: store.mapState.map
  };
};

const mapDispatchToProps = dispatch => ({
  add: (marker: IMarker) => {
    dispatch(setActiveMarker(marker));
  }
 });

export default connect(mapStateToProps, mapDispatchToProps)(PanelComponent);