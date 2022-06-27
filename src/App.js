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
      
    </div>
  );
}

export default App;
