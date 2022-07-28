import React,{useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import {useQuery, useQueryClient} from 'react-query';
import { useNavigate, Navigate } from 'react-router-dom';
import {apis} from '../store/api';

import { comma } from '../shared/common';
import StyledButton from '../elements/StyledButton';
import Modal from '../elements/Modal';
import NavBox from '../elements/NavBox';


const Reservation = () => {
  const useClient = useQueryClient();
  const navigate = useNavigate();
  const infoData = sessionStorage.getItem('reservationInfo');
  const [info, setInfo] = useState(infoData && JSON.parse(infoData));
  const weekdays = ['일', '월', '화', '수', '목', '금', '토', '일'];
  const [petsData, setPetsData] = useState();
  const [petsForService, setPetsForService] = useState([]);
  const [requestStatus, setRequestStatus] = useState(false);
  const [dataForRequest, setDataForRequest] = useState();
  const [modalDisplay, setModalDisplay] = useState(false);
  const [modalType, setModalType] = useState();
  const [page, setPage] = useState('reservation');

  const sendRequestApi = (data, sitterId) => {
    return apis.makeReservation(data, sitterId)
  }
  const sendRequest = useQuery(['requestStatus',dataForRequest, info.sitterId], ()=>sendRequestApi(dataForRequest, info.sitterId), {
    onSuccess: (data) => {
      setPage('done');
      setRequestStatus(false);
    },
    onError: (data) => {
      // 403예약 불가능 날짜
    },
    enabled: !!requestStatus,
    refetchOnMount: 'always',
    staleTime: Infinity,
  })
  const confirmReservation = async () => {
    const _data = await {
      petIds: petsForService,
      category: info.service,
      reservationDate: info.date
    }
    setDataForRequest(_data);
    setModalDisplay(false);
    setRequestStatus(true);
  }  
  const modalContent = {
    notSelected: {alert: true, title: '반려견 선택', text: '반려견을 선택해주세요.', confirmFn: ()=>setModalDisplay(false)},
    confirm: {alert: false, title: '예약 확정', text: '예약을 확정하시겠습니까?', _confirm: '예약하기', _cancel: '취소', confirmFn: confirmReservation, cancelFn: ()=>setModalDisplay(false)},
    error: {alert: true, text: '잘못된 접근입니다. 다시 시도해주세요.', _confirm: '확인', confirmFn: ()=>navigate(-1)},
  };
  const {data: petsQuery} = useQuery('petsData', apis.reservation, {
    onSuccess: (data) => {
      if(data.data.pets.length){
        setPetsData(data.data.pets);
      }
    },
    
    refetchOnMount: 'always',
    staleTime: Infinity,
  })

  if(!infoData) return (
    <>
    {
      !infoData && (
        <Modal _alert={true} _display={true} confirmOnClick={()=>navigate(-1)} _confirm={'확인'}>
          <div className="text_area">
            <p>잘못된 접근입니다.</p>
          </div>
        </Modal>
      )
    }
    </>
  )
  if(page !== 'reservation') return <Navigate to="/reservation/list" state={'reserved'}/>
  if(petsQuery.isLoading || !info || !petsData) return null;

  return (
    <>
      <ReservationPage>
      <NavBox
        _title={'예약하기'}
      />
        <section className="page_top">
          <h2>예약하기</h2>
        </section>
        <section className="page_body">
          <section>
            <ReservInfoBox>
              <p className='reservTitle'>신청하는 서비스</p>
              <div className='reservDescBox'>
                {
                  info.service.map((v,i)=>{
                    return (
                      <p className='reservDesc' key={`service_${i}`}>{i > 0 && ','} {v}</p>
                    )
                  })
                }
              </div>
            </ReservInfoBox>
            <ReservInfoBox>
              <p className='reservTitle'>예약 일자</p>
              <div className='reservDescBox'>
                {
                  info.date.map((v,i)=>{
                    return (
                      <p className='reservDesc' key={`date_${i}`}>{i > 0 && ','} {v}</p>
                    )
                  })
                }
              </div>
            </ReservInfoBox>
          </section>
          <section>
            <ReservInfoBox className="pets">
              <p className='reservTitle'>맡기는 반려동물</p>
              <div className='reservDescBox'>
                <ul style={{paddingTop: '24px'}}>
                {
                petsData.length ? (
                  petsData.map((v,i)=>{
                    return (
                      <PetItem key={`pet_${i}`}>
                        <label>
                          <input type="checkbox" onChange={(e)=>{
                            if(e.target.checked){
                              setPetsForService((prev)=>{
                                const _data = prev ? [...prev, v.petId] : [];
                                return _data;
                              })
                            }else{
                              setPetsForService((prev)=>{
                                const _data = [...prev].filter(item=>item !== v.petId);
                                return _data;
                              })
                            }
                          }}/>
                          <div>
                            <span style={{backgroundImage: `url(${v.petImage})`}}></span>
                            <p>{v.petName}</p>
                            <p>{`${v.petAge}살 ${v.petType}`}</p>
                          </div>
                        </label>
                      </PetItem>
                    )
                  })
                ) : (
                  <p>등록된 펫 정보가 없습니다.</p>
                )
              }
                </ul>
              </div>
            </ReservInfoBox>
          </section>
          <section>
            <ReservPriceBox>
              <p className='reservTitle'>서비스 금액</p>
              <p className='reservDesc price'>{comma(info.price)}원</p>
            </ReservPriceBox>
            <ReservNoticeBox>
              <ul>
                <li>
                  위 금액은 확정된 금액이 아닌 {info.sitterName} 돌보미가 제공하는 평균적인
                  금액입니다.
                </li>
                <li>
                  예약 완료 전 해당 서비스에 대한 확정 금액을 협의하시길
                  권고드립니다.
                </li>
              </ul>
            </ReservNoticeBox>
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
    & > section{
      border-bottom: 1px solid #C9C9C9;
      &:last-child{
        border: none;
      }
    }
  }
}

`
const PetItem = styled.li`
  display: inline-block;
  vertical-align: top;
  & + li{
    margin-left: 24px;
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
        text-align: center;
        span{
          display: inline-block;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          border: 2px solid #E4E4E4;
          box-sizing: border-box;
        }
        p{
          margin-top: 6px;
          line-height: 1;
          & + p{
            color: #676767;
            margin-top: 5px;
          }
        }
      }
      &:checked + div{
        span{
          border-color: #FC9215;
        }
        p{
          color: #FC9215;
        }
      }
    }
  }
`
const ReservInfoBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: top;
  justify-content: space-between;
  margin-bottom: 24px;
  .reservTitle {
    color: #676767;
  }
  .reservDesc {
    text-align: right;
    &+.reservDesc{
      margin-top: 10px;
    }
  }
  &.pets{
    padding: 24px 0;
    flex-direction: column;
  }
`;
const ReservPriceBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: top;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #C9C9C9;
  .reservTitle {
    color: #676767;
  }
  .reservDesc {
    text-align: right;
  }
  .price {
    font-weight: 700;
    font-size: 21px;
    line-height: 25px;
    color: #fc9215;
  }
`;

const ReservNoticeBox = styled.section`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #676767;
  padding: 24px 0;
  ul li {
    position: relative;
    padding-left: 20px;
    padding-bottom: 10px;
    &:before{
      position: absolute;
      left: 7px;
      top: 5px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: #676767;
      content: '';
    }
  }
`;
export default Reservation;