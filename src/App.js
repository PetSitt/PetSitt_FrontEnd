// import './App.css';
import {Switch, Route} from 'react-router-dom';
import MapIndex from './page/map/MapIndex';
import { useQuery } from "react-query";
import {apis} from './store/api'

function App() {
  const {isLoading, data} = useQuery('queryKey', apis.get, {
    staleTime: 10000
  });
  console.log(isLoading)
  console.log(data)

  return (
    <div className="App">
      <Switch>
        <Route path="/map" component={MapIndex} />
      </Switch>
    </div>
  );
}

export default App;
