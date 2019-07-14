import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import axios from 'axios';
import { MAP_CONFIG } from '../Constants/Constants';
// Import Marker Typing
import { IMarker, IMapState } from './Reducers';
import {toastr} from 'react-redux-toastr';

const server = axios.create({
  baseURL: MAP_CONFIG.SERVER_URL
});

// Create Action Constants
export enum MapActionTypes {
  GET_ALL = 'GET_ALL',
  ADD_MARKER = 'ADD_MARKER',
  EDIT_MARKER = 'EDIT_MARKER',
  DELETE_MARKER = 'DELETE_MARKER',
  SET_ACTIVE_MARKER = 'SET_ACTIVE_MARKER',
  EDIT_POSITION = 'EDIT_POSITION',
  EDIT_NAME = 'EDIT_NAME',
  LAST_VALID_COORDS = 'LAST_VALID_COORDS',
  SET_GEOCODER = 'SET_GEOCODER',
  SET_MAP_INSTANCE = 'SET_MAP_INSTANCE'
}

// Interface for Get All Action Type
export interface IMarkerGetAllAction {
  type: MapActionTypes.GET_ALL;
  markers: IMarker[];
}

// Interface for Marker Add Action Type
export interface IMarkerAddAction {
  type: MapActionTypes.ADD_MARKER;
  marker: IMarker;
}

// Interface for Marker Add Action Type
export interface IMarkerEditAction {
  type: MapActionTypes.EDIT_MARKER;
  marker: IMarker;
}

// Interface for Marker Remove Action Type
export interface IMarkerDeleteAction {
  type: MapActionTypes.DELETE_MARKER;
  _id: string;
}

// Interface for Cancel Edit Action Type
export interface ISetActiveMarker {
  type: MapActionTypes.SET_ACTIVE_MARKER;
  marker: IMarker | undefined;
}

// Interface for Marker Restrict Position Action Type
export interface IMarkerEditPositionAction {
  type: MapActionTypes.EDIT_POSITION;
  address: string;
  latLng: { lat: number; lng: number; };
}

// Interface for Marker Restrict Position Action Type
export interface IMarkerEditNameAction {
  type: MapActionTypes.EDIT_NAME;
  name: string;
}


// Interface for Set Last Valid coordinates Action Type
export interface IMapLastValidCoordsAction {
  type: MapActionTypes.LAST_VALID_COORDS;
  lastValidCoords: { lat: number; lng: number; };
}

// Interface for set geocoder Action Type
export interface IMapGeocoderAction {
  type: MapActionTypes.SET_GEOCODER;
  geocoder: any;
}

// Interface for set map instance Action Type
export interface IMapInstance {
  type: MapActionTypes.SET_MAP_INSTANCE;
  map: any;
}

/* 
Combine the action types with a union
*/
export type MapActions = IMarkerGetAllAction |
  IMarkerAddAction |
  IMarkerEditAction |
  IMarkerDeleteAction |
  IMarkerEditPositionAction |
  IMapLastValidCoordsAction |
  ISetActiveMarker |
  IMarkerEditNameAction |
  IMapGeocoderAction |
  IMapInstance;

/* Get All Action
<Promise<Return Type>, State Interface, Type of Param, Type of Action> */
export const getAllMarkers: ActionCreator<
  ThunkAction<Promise<any>, IMapState, null, IMarkerGetAllAction>
> = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await server.get('markers');
      if (response.data.length) {
        dispatch({
          markers: response.data,
          type: MapActionTypes.GET_ALL,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
};

/* Marker Add Action
<Promise<Return Type>, State Interface, Type of Param, Type of Action> */
export const addMarker: ActionCreator<
  ThunkAction<Promise<any>, IMapState, null, IMarkerAddAction>
> = (marker) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await server.post('markers', marker);
      toastr.success('Marker Added Successfully');
      if (response.data) {
        dispatch({
          marker: response.data,
          type: MapActionTypes.ADD_MARKER,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
};

/* Marker Edit Action
<Promise<Return Type>, State Interface, Type of Param, Type of Action> */
export const editMarker: ActionCreator<
  ThunkAction<Promise<any>, IMapState, null, IMarkerAddAction>
> = (marker) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await server.put(`markers/${marker._id}`, marker);
      toastr.success('Marker Edited Successfully');
        dispatch({
          marker: response.data,
          type: MapActionTypes.EDIT_MARKER,
        });
    } catch (err) {
      console.error(err);
    }
  };
};

/* Marker Delete Action
<Promise<Return Type>, State Interface, Type of Param, Type of Action> */
export const deleteMarker: ActionCreator<
  ThunkAction<Promise<any>, IMapState, null, IMarkerDeleteAction>
> = (id) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await server.delete(`markers/${id}`);
      toastr.success('Marker Deleted Successfully');
      if (response.data) {
        dispatch({
          _id: id,
          type: MapActionTypes.DELETE_MARKER,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
};


/* Marker Cancel Edit Action
<Promise<Return Type>, State Interface, Type of Param, Type of Action> */
export const setActiveMarker: ActionCreator<
  ThunkAction<any, IMapState, null, ISetActiveMarker>
> = (marker) => (dispatch: Dispatch) => {
  dispatch({
    type: MapActionTypes.SET_ACTIVE_MARKER,
    marker: marker
  });
};

/* Marker Edit Position Action
<Promise<Return Type>, State Interface, Type of Param, Type of Action> */
export const editMarkerPosition: ActionCreator<
  ThunkAction<any, IMapState, null, IMarkerEditPositionAction>
> = (pos) => {
  return (dispatch: Dispatch) => {
    dispatch({
      address: pos.address,
      latLng: pos.latLng,
      type: MapActionTypes.EDIT_POSITION,
    });
  };
};

/* Active Marker Edit Name Action
<Promise<Return Type>, State Interface, Type of Param, Type of Action> */
export const editMarkerName: ActionCreator<
  ThunkAction<any, IMapState, null, IMarkerEditNameAction>
> = (name) => {
  return (dispatch: Dispatch) => {
    dispatch({
      name: name,
      type: MapActionTypes.EDIT_NAME,
    });
  };
};

/* Set Last Valid Coords Action */
export const setLastValidCoords = (lastValidCoords) => {
  return (dispatch: Dispatch) => {
    dispatch({
      type: MapActionTypes.LAST_VALID_COORDS,
      lastValidCoords
    });
  }
};

/* Active marker update Action
<Promise<Return Type>, State Interface, Type of Param, Type of Action> */
export const updateActiveMarker: ActionCreator<
  ThunkAction<Promise<any>, IMapState, null, IMarkerDeleteAction>
> = (id) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await server.delete(`markers/${id}`);
      if (response.data) {
        dispatch({
          _id: id,
          type: MapActionTypes.DELETE_MARKER,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
};

/* Set Geocoder Action */
export const setGeocoder = (geocoder: any) => {
  return (dispatch: Dispatch) => {
    dispatch({
      type: MapActionTypes.SET_GEOCODER,
      geocoder
    });
  }
};
/* Set Map Instance Action */
export const setMapInstance = (map: any) => {
  return (dispatch: Dispatch) => {
    dispatch({
      type: MapActionTypes.SET_MAP_INSTANCE,
      map
    });
  }
};