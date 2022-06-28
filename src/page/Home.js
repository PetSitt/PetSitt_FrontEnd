import { useQuery } from "react-query";
import {apis} from '../store/api'
import Input from '../elements/Input';

function Home() {
  // const {isLoading, data} = useQuery('queryKey', apis.get);

  return (
    <div className="home">
      <Input _placeholder={"아이디(이메일)"} _required={"required"} />
    </div>
  );
}

export default Home;