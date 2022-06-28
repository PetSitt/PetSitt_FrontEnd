// import './App.css';
import {Switch, Route} from 'react-router-dom';
import MapIndex from './page/map/MapIndex';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/map" component={MapIndex} />
      </Switch>
    </div>
  );
}

export default App;
