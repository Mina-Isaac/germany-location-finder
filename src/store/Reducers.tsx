import { Reducer } from 'redux';
import {
  MapActions,
  MapActionTypes,
} from './Actions';

// Define the Marker type
export interface IMarker {
  latLng: {
    lat: number;
    lng: number;
  }
  address: string;
  _id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
  draggable?: boolean
}


// Define the Markers State
export interface IMapState {
  readonly markers: IMarker[];
  readonly lastValidCoords: { lat: number; lng: number; };
  readonly activeMarker: IMarker | undefined;
  readonly geocoder: any | null;
  readonly map: any | null;
}

// Define the initial state
const initialMapState: IMapState = {
  markers: [],
  lastValidCoords: { lat: 51.165691, lng: 10.451526 },
  activeMarker: undefined,
  geocoder: null,
  map: null
};

export const mapReducer: Reducer<IMapState, MapActions> = (
  state = initialMapState,
  action
) => {
  switch (action.type) {
    case MapActionTypes.GET_ALL: {
      const markers = action.markers.reverse();
      return {
        ...state,
        markers: markers,
      };
    }
    case MapActionTypes.ADD_MARKER: {
      return {
        ...state,
        markers: [action.marker, ...state.markers ],
        activeMarker: undefined
      };
    }
    case MapActionTypes.EDIT_MARKER: {
      const markers = [...state.markers ];
      let i = markers.findIndex(a => a._id === action.marker._id);
      markers[i] = action.marker;
      return {
        ...state,
        markers: [...markers],
        activeMarker: undefined
      };
    }
    case MapActionTypes.DELETE_MARKER: {
      let i = state.markers.findIndex(a => a._id === action._id); // Get Index of marker to be removed
      return {
        ...state,
        markers: [...state.markers.slice(0, i), ...state.markers.slice(i + 1)],
        activeMarker: undefined
      };
    }
    case MapActionTypes.LAST_VALID_COORDS: {
      return {
        ...state,
        lastValidCoords: action.lastValidCoords,
      };
    }
    case MapActionTypes.SET_ACTIVE_MARKER: {
      return {
        ...state,
        activeMarker: action.marker,
      };
    }
    case MapActionTypes.EDIT_POSITION: {
      return {
        ...state,
        activeMarker: Object.assign({}, state.activeMarker, {latLng: action.latLng, address: action.address})
      };
    }
    case MapActionTypes.EDIT_NAME: {
      return {
        ...state,
        activeMarker: Object.assign({}, state.activeMarker, {name: action.name})
      };
    }
    case MapActionTypes.SET_GEOCODER: {
      return {
        ...state,
        geocoder: action.geocoder
      };
    }
    case MapActionTypes.SET_MAP_INSTANCE: {
      return {
        ...state,
        map: action.map
      };
    }
    default:
      return state;
  }
};  