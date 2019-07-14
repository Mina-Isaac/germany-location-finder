import React, { Component } from 'react';
import './ListItem.scss';
import { IAppState } from '../../store/Store';
import { connect } from 'react-redux';
import { deleteMarker, addMarker, setActiveMarker, editMarkerPosition, editMarkerName, editMarker } from '../../store/Actions';
import { IMarker } from '../../store/Reducers';
import { geocodeAddress } from '../../utils/Utils';
import { MAP_CONFIG } from '../../Constants/Constants';
import {toastr} from 'react-redux-toastr';


export interface MarkerProps {
  marker: IMarker;
  activeMarker: IMarker | undefined;
  map: any;
  geocoder: any;
  add: Function,
  delete: Function,
  save: Function,
  editActiveMarker: Function,
  cancel: Function,
  setMarkerPosition: Function,
  changeName: Function
}

class ListItemComponent extends Component<MarkerProps, {name: string, geocodeAddress: string, validAddress:boolean, editMode: boolean}> {
  geoCoderInput: any;
  constructor(props){
    super(props);
    this.changeName = this.changeName.bind(this);
    this.changeAddress = this.changeAddress.bind(this);
    this.state = {
      name: '',
      geocodeAddress: '',
      validAddress: false,
      editMode: false
    }
  }
  componentDidMount(){
    if(this.props.activeMarker === this.props.marker){
      this.setState({
        editMode: true,
      })
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevState.editMode && this.props.activeMarker && this.props.activeMarker._id !== this.props.marker._id) {
      this.setState({
        name: '',
        geocodeAddress: '',
        validAddress: false,
        editMode: false
      }) 
    }
    if(!prevState.editMode && this.props.activeMarker && this.props.activeMarker._id === this.props.marker._id){
      this.setState({
        name: this.props.activeMarker.name,
        geocodeAddress: this.props.activeMarker.address,
        validAddress: this.props.activeMarker.address? true : false,
        editMode: true
      })
    } else if((this.props.activeMarker && prevProps.activeMarker ) && this.props.activeMarker.latLng.lat !== prevProps.activeMarker.latLng.lat ){
      this.setState({
        geocodeAddress: this.props.activeMarker.address,
        validAddress: true
      })
    }
  }
  removeMarker(id: string) {
    this.props.delete(id);
  }
  editMarker(marker: IMarker) {
    this.props.map.setZoom(12);
    this.props.map.panTo(marker.latLng);
    this.props.editActiveMarker(marker);
  }
  async geoCodeAddress(){
    try {
      const result = await geocodeAddress(this.state.geocodeAddress, this.props.geocoder);
      console.log(result);
      this.props.setMarkerPosition(result);
      this.props.map.setZoom(12);
      this.props.map.panTo(result.latLng);
      this.setState({validAddress: true});
    } catch (error) {
      toastr.error('Address Error', error.message);
    }
  }
  changeName(e) {
    this.setState({name: e.target.value});
    this.props.changeName(e.target.value);
  }
  changeAddress(e) {
    this.setState({geocodeAddress: e.target.value, validAddress: false});
  }
  saveMarker(){
    if(this.props.activeMarker && this.props.activeMarker._id === MAP_CONFIG.DEFAULT_MARKER_ID){
      console.log('new')
      this.props.add(this.props.activeMarker);
      this.setState({editMode: false});
    } else {
      console.log('edit')
      this.props.save(this.props.activeMarker);
      this.setState({editMode: false});
    }
  }
  /*global google*/
  cancelEdit(){
    this.setState({
      name: this.props.activeMarker ? this.props.activeMarker.name : '',
      geocodeAddress: this.props.activeMarker ? this.props.activeMarker.address : '',
      validAddress: true,
      editMode: false
    });
    const bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(MAP_CONFIG.DEFAULT_BOUNDS_RESTRICTIONS.latLngBounds.south, MAP_CONFIG.DEFAULT_BOUNDS_RESTRICTIONS.latLngBounds.west),
      new google.maps.LatLng(MAP_CONFIG.DEFAULT_BOUNDS_RESTRICTIONS.latLngBounds.north, MAP_CONFIG.DEFAULT_BOUNDS_RESTRICTIONS.latLngBounds.east)
    );
    this.props.map.fitBounds(bounds);
    this.props.cancel();
  }
  render() {
    const { editMode, geocodeAddress, name } = this.state;
    const marker = this.props.marker;
    return (
      <div className={editMode ? 'listitem active' : 'listitem'}>
        <div className="listitem--content">
          {
            editMode && 
            <div>
              <div className="geocode-filed">
                <input type="text" value={geocodeAddress} onChange={this.changeAddress}/>
                {this.props.geocoder && <button onClick={this.geoCodeAddress.bind(this)}>GetPosition</button>}
              </div>
              <span>OR start drag the green marker <img alt="green marker" src={MAP_CONFIG.ACTIVE_MARKER_ICON} style={{width:'15px',margin:0}} /> on map to select location</span>
            </div>
          }
          {
            ! editMode && <div>
              <h4>{marker.address}</h4>
              <small>{marker.name ? marker.name : marker.address}</small>
            </div> 
          }
          <div><b>Latitude:</b> {(this.props.activeMarker && this.props.activeMarker._id === this.props.marker._id) ? this.props.activeMarker.latLng.lat : marker.latLng.lat}</div>
          <div><b>Longitude:</b> {(this.props.activeMarker && this.props.activeMarker._id === this.props.marker._id) ? this.props.activeMarker.latLng.lng : marker.latLng.lng}</div>
          {
            editMode &&
            <div className="name-field">
              <label>Enter name</label>
              <input type="text" value={name} onChange={this.changeName}/>
            </div>
          }
        </div>
        <div className="listitem--actions">
          <button className={editMode ? 'btn-cancel' : 'btn-edit'} onClick={editMode ? this.cancelEdit.bind(this) : this.editMarker.bind(this, marker)}>{editMode ? 'Cancel' : 'Edit'}</button>
          <button className={editMode ? 'btn-save' : 'btn-delete'} disabled={editMode && !this.state.validAddress} onClick={editMode ? this.saveMarker.bind(this) : this.removeMarker.bind(this, marker._id)}>{editMode ? 'Save' : 'Delete'}</button>
        </div>
      </div>)
  }
}

const mapStateToProps = (store: IAppState) => {
  return {
    activeMarker: store.mapState.activeMarker,
    geocoder: store.mapState.geocoder,
    map: store.mapState.map
  };
};


const mapDispatchToProps = dispatch => ({
  add: (marker: IMarker) => {
    dispatch(addMarker(marker));
  },
  delete: (id: string) => {
    dispatch(deleteMarker(id));
  },
  save: (marker: IMarker) => {
    dispatch(editMarker(marker));
  },
  editActiveMarker: (marker: IMarker) => {
    dispatch(setActiveMarker(marker));
  },
  cancel: () => {
    dispatch(setActiveMarker(undefined));
  },
  setMarkerPosition: (pos)=>{
    dispatch(editMarkerPosition(pos));
  },
  changeName: (name)=>{
    dispatch(editMarkerName(name));
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(ListItemComponent);