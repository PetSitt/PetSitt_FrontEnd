import { useQuery } from "react-query";
import {apis} from '../../store/api'

function Home() {
  const {isLoading, data} = useQuery('queryKey', apis.get);
  console.log(isLoading)
  console.log(data)

  return (
    <div className="home">
    </div>
  );
}

export default Home;