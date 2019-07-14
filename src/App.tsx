import React from 'react';
import MapComponent from './components/map/Map';
import PanelComponent from './components/panel/Panel';
import './App.scss';


const App: React.SFC <{}> = () => {
  return (
    <>
      <PanelComponent/>
      <MapComponent />
    </>
  );
}

export default App;
