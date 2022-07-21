import React from 'react';
import { Route, Routes } from 'react-router-dom';
// page
import Home from './page/Home';
import Detail from './page/Detail';
import Signup from './page/Signup';
import Login from './page/Login';
import SearchAddress from './page/SearchAddress';
import PwFind from './page/PwFind';
import IdFind from './page/IdFind';
import Mypage from './page/Mypage';
import Myprofile from './page/Myprofile';
import Petprofile from './page/Petprofile';
import PetprofileForm from './page/PetprofileForm';
import PwChange from './page/PwChange';
import Reservation from './page/Reservation';
import ReservationList from './page/ReservationList';
import ReservationDetail from './page/ReservationDetail';
import SitterProfile from './page/SitterProfile';
import SitterProfileForm1 from './page/SitterProfileForm1';
import SitterProfileForm2 from './page/SitterProfileForm2';
import SitterProfileForm3 from './page/SitterProfileForm3';
import SitterProfileForm4 from './page/SitterProfileForm4';
import Chat from './page/Chat';
import Auth from './Auth';
import Profile from './Profile';
 
const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} exact />
      <Route path='/detail/:id' element={<Detail />} exact />
      <Route path='/signup' element={<Signup />} />
      <Route path='/pwfind' element={<PwFind />} />
      <Route path='/idfind' element={<IdFind />} />
      <Route path='/mypage' element={<Mypage />} />
      <Route path='/mypage/myprofile' element={<Myprofile />} />
      <Route path='/mypage/petprofile' element={<Petprofile />} />
      <Route path='/mypage/petprofileform' element={<PetprofileForm />} />
      <Route
        path='/mypage/:petId/petprofileform'
        element={<PetprofileForm />}
      />
      <Route path='/mypage/sitterprofile' element={<SitterProfile />} />
      <Route
        path='/mypage/SitterProfileForm1'
        element={<SitterProfileForm1 />}
      />
      <Route
        path='/mypage/SitterProfileForm2'
        element={<SitterProfileForm2 />}
      />
      <Route
        path='/mypage/SitterProfileForm3'
        element={<SitterProfileForm3 />}
      />
      <Route
        path='/mypage/SitterProfileForm4'
        element={<SitterProfileForm4 />}
      />
      <Route path='/pwchange' element={<PwChange />} />
      <Route path='/login' element={<Login />}></Route>
      <Route path='/search' element={<SearchAddress />}></Route>
      <Route path='/reservation' element={<Reservation />}></Route>
      ReservationDetail
      <Route path='/reservation/list' element={<ReservationList />}></Route>
      <Route
        path='/reservation/detail/:type/:id'
        element={<ReservationDetail />}
      ></Route>
      <Route path="/oauth/kakao/callback" element={<Auth />}></Route>
      <Route path="/profile" element={<Profile />}></Route>
      {/* <Route path='/chat' element={<Chat />} /> */}
      <Route path='*' element={<Home replace to='/' />} />
    </Routes>
  );
};

export default Router;
