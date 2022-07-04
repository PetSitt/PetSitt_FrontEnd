import { useEffect } from "react";

const INITIAL_VALUES = [false, false, false];

function Home() {
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(function(pos) {
        console.log(pos);
        var latitude = pos.coords.latitude;
        var longitude = pos.coords.longitude;
    });
  },[])
  return (
    <div className="home">
      home
    </div>
  );
}

export default Home;