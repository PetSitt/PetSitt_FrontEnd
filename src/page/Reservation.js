import React,{useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import {useQuery, useQueryClient} from 'react-query';
import { useNavigate, Navigate } from 'react-router-dom';
import {apis} from '../store/api';

import StyledButton from '../elements/StyledButton';
import Modal from '../elements/Modal';


const Reservation = () => {
  const useClient = useQueryClient();
  const navigate = useNavigate();
  const infoData = localStorage.getItem('reservationInfo');
  const [info, setInfo] = useState(infoData && JSON.parse(infoData));
  const weekdays = ['일', '월', '화', '수', '목', '금', '토', '일'];
  const [petsData, setPetsData] = useState();
  const [petsForService, setPetsForService] = useState([]);
  const [requestStatus, setRequestStatus] = useState(false);
  const [dataForRequest, setDataForRequest] = useState();
  const [modalDisplay, setModalDisplay] = useState(false);
  const [modalType, setModalType] = useState();
  const [page, setPage] = useState('reservation');
  const {data: petsQuery, isLoading, isSuccess, isPreviousData} = useQuery('petsData', apis.reservation, {
    onSuccess: (data) => {
      console.log(data, 'success');
      setPetsData(data?.data.pets);
    },
    onError: (data) => {
      console.log(data, 'error');
    },
    refetchOnMount: 'always',
    staleTime: Infinity,
  })
  const sendRequestApi = (data, sitterId) => {
    return apis.makeReservation(dataForRequest, info.sitterId)
  }
  const sendRequest = useQuery(['requestStatus', dataForRequest, info.sitterId], ()=>sendRequestApi(dataForRequest, info.sitterId), {
    onSuccess: (data) => {
      if(data.data.msg === '예약 완료'){
        setRequestStatus(false);
        localStorage.removeItem('reservationInfo');
        setPage('done');
      }
      console.log('예약 완료')
    },
    onError: (data) => {
      console.log(data, 'request error');
      // 403예약 불가능 날짜
    },
    enabled: !!requestStatus,
    refetchOnMount: 'always',
    staleTime: Infinity,
  })
  const dateText = useRef();
  const confirmReservation = async () => {
    const _data = await {
      petIds: petsForService,
      category: info.service,
      reservationDate: info.date
    }
    await setDataForRequest(_data);
    setModalDisplay(false);
    setRequestStatus(true);
  }  
  const modalContent = {
    notSelected: {alert: true, title: '반려견 선택', text: '반려견을 선택해주세요.', confirmFn: ()=>setModalDisplay(false)},
    confirm: {alert: false, title: '예약 확정', text: '예약을 확정하시겠습니까?', _confirm: '예약하기', _cancel: '취소', confirmFn: confirmReservation, cancelFn: ()=>setModalDisplay(false)}
  };


  if(page !== 'reservation') return <Navigate to="/reservation/list"/>
  if(isLoading || !info || !petsData) return '예약페이지 로딩중';
  return (
    <>
      <ReservationPage>
        <section className="page_top">
          <h2>예약하기</h2>
        </section>
        <section className="page_body">
          <section>
            <dl>
              <div>
                <dt>서비스 : </dt>
                <dd>
                  <ul>
                    {
                      info.service.map((v,i)=>{
                        return (
                          <li key={`service_${i}`}>{i > 0 && ','} {v}</li>
                        )
                      })
                    }
                  </ul>
                </dd>
              </div>
              <div>
                <dt>날짜 : </dt>
                <dd>
                  <ul>
                    {
                      info.date.map((v,i)=>{
                        return (
                          <li key={`date_${i}`}>{i > 0 && ','} {v}</li>
                        )
                      })
                    }
                  </ul>
                </dd>
              </div>
            </dl>
          </section>
          <section>
            <h3>맡기는 반려동물</h3>
            <ul>
              {
                petsData.map((v,i)=>{
                  return (
                    <PetItem key={`pet_${i}`}>
                      <label>
                        <input type="checkbox" onChange={(e)=>{
                          if(e.target.checked){
                            setPetsForService((prev)=>{
                              const _data = prev ? [...prev, v._id] : [];
                              return _data;
                            })
                          }else{
                            setPetsForService((prev)=>{
                              const _data = [...prev].filter(item=>item !== v._id);
                              return _data;
                            })
                          }
                        }}/>
                        <div>
                          <span style={{backgroundImage: `url(${v.petImage})`}}></span>
                          <p>{v.petName} {`(${v.petType})`}</p>
                        </div>
                      </label>
                    </PetItem>
                  )
                })
              }
            </ul>
          </section>
          <section>
            <div className="info_box">
              {info.sitterName} 님이 제공하는 서비스의
              일당 금액은 {info.price}원 입니다.
              <ol style={{fontSize: '14px', color: '#797979', padding: '10px', backgroundColor: '#eee', margin: '10px 0'}}>
                <li>* 위 금액은 확정된 금액이 아닌 돌보미가 제공하는 평균적인 금액입니다.</li>
                <li>* 예약 완료 전 해당 서비스에 대한 확정 금액을 협의하시길 권고드립니다.</li>
              </ol>
            </div>
            <div>
              <StyledButton
                _onClick={()=>{
                    if(petsForService.length <= 0){
                      setModalType(modalContent.notSelected);
                    }else{
                      modalContent.confirm.text = `${info.date.map((v,i)=> `${v.split('/').join('.')}(${weekdays[new Date(v).getDay()]})`).join(', ')}예약을 확정하시겠습니까?`
                      setModalType(modalContent.confirm);
                    }
                    setModalDisplay(true);
                  }
                }
                _title="예약하기"
                _margin="0"
              />
            </div>
          </section>
        </section>
      </ReservationPage>
      {
        modalType && (
          <Modal _alert={modalType?.alert} _display={modalDisplay} confirmOnClick={modalType?.confirmFn} cancelOnclick={modalType?.cancelFn} _cancel={modalType?._cancel} _confirm={modalType?._confirm}>
            <div className="text_area">
              <h3>{modalType?.title}</h3>
              <p>{modalType?.text}</p>
            </div>
          </Modal>
        )
      }
    </>
  )
}


const ReservationPage = styled.div`
// 임시 css
line-height: 1.3;
h2{
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
}
h3{
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}
dl > div{
  padding: 0 0 10px;
  display: flex;
  dd{
    flex-shrink: 0;
    ul{
      display: flex;
    }
  }
}
& > section{
  &.page_body{
    section{
      padding: 30px 0;
      border-top: 1px solid #ddd;
    }
  }
}

`
const PetItem = styled.li`
  & + li{
    margin-top: 15px;
  }
  label{
    position: relative;
    input{
      position: absolute;
      left: 0;
      top: 0;
      width: 0;
      height: 0;
      & + div{
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 15px;
        border: 2px solid rgba(120, 120, 120, 0.2);
        border-radius: 6px;
        span{
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
      }
      &:checked + div{
        border-color: #FC9215;
      }
    }
  }
`
export default Reservation;