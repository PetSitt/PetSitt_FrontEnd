import React,{useEffect, useState} from 'react';
import styled from 'styled-components';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import {apis} from '../store/api';

import Tabs from '../elements/Tabs';
import { useNavigate } from 'react-router-dom';

const ReservationList = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [pastReservation, setPastReservation] = useState();
  const [proceedings, setProceedings] = useState();
  const [selectedTab, setSelectedTab] = useState('user');

  const {reservatioinList, isFetching, refetch} = useQuery('reservationQuery', ()=>apis.reservationList(selectedTab), {
    onSuccess: (data)=>{
      console.log(data, 'success');
      setProceedings(data.data.proceedings);
      setPastReservation(data.data.pasts);
    },
    onError: (data)=>{
      console.log(data, 'error');
    },
    refetchOnMount: 'always',
    staleTime: Infinity,
  })
  useEffect(()=>{
    refetch();
    queryClient.invalidateQueries('reservationQuery');
  },[selectedTab])


  return (
    <ReservationListPage>
      <section className="page_top">
          <h2>예약내역</h2>
          <Tabs _tab={['사용자', '돌보미']} _value={['user', 'sitter']} setSelectedTab={setSelectedTab}/>
        </section>
        <section className="page_body">
          {
            isFetching ? (
              <p>예약 내역을 불러오는 중입니다.</p>
            ) : (
              <>
              <section>
                <h3>진행중인 예약</h3>
                <ul>
                  {
                    proceedings?.length > 0 ? (
                      proceedings.map((v,i)=>{
                        return(
                          <ReservationItem key={`reservation_${i}`} className="proceeding_reservations">
                            <p className="reservationInfo">
                              <strong>{v.category.map((category,index)=>(<span key={`category_${index}`}>{category}</span>))}</strong><br/>
                              <strong>{v.reservationDate.map((date,index)=>(<span key={`date_${index}`}>{index > 0 ? ', ' + date : date}</span>))}</strong>
                            </p>
                            <div className="sitterInfo">
                              <h4>{selectedTab === 'user' ? '돌보미' : '신청자'} 정보</h4>
                              <div>
                                {
                                  selectedTab === 'user' && <span style={{backgroundImage: `url(${v.imageUrl})`}}></span>
                                }
                                <p>
                                  <strong>{selectedTab === 'user' ? v.sitterName : v.userName} | </strong>
                                  {
                                    selectedTab === 'user' && <><em>{v.address}</em><br/></>
                                  }
                                  <span>{v.phoneNumber}</span>
                                </p>
                              </div>
                            </div>
                            
                          </ReservationItem>
                        )
                      })
                    ) : (
                      <NoResult>진행중인 예약 내역이 없습니다.</NoResult>
                    )
                  }
                </ul>
              </section>
              <section>
                <h3>지난 예약</h3>
                <ul>
                  {
                    pastReservation?.length > 0 ? (
                      pastReservation.map((v,i)=>{
                        return(
                          <ReservationItem key={`reservation_${i}`} className="past_reservations">
                            <p className="reservationInfo">
                              <strong>{v.category.map((category,index)=>(<span key={`category_${index}`}>{category}</span>))}</strong>
                              <strong className={`status ${v.reservationState === '취소완료' ? 'canceled' : 'completed'}`}>{v.reservationState}</strong>
                              <strong>{v.reservationDate.map((date,index)=>(<span key={`date_${index}`}>{index > 0 ? ', ' + date : date}</span>))}</strong>
                            </p>
                            {
                              selectedTab === 'user' ? (
                                <p className="sitterInfo">
                                  <strong>{v.sitterName}</strong>
                                  <button type="button" onClick={()=>navigate(`/detail/${v.sitterId}`)}>{v.sitterName}님 상세페이지</button>
                                </p>
                              ) : (
                                <p className="sitterInfo">
                                  <strong>{v.userName}</strong>
                                </p>
                              )
                            }
                            
                            
                          </ReservationItem>
                        )
                      })
                    ) : (
                      <NoResult>지난 예약 내역이 없습니다.</NoResult>
                    )
                  }
                </ul>
              </section>
              </>
            )
          }
        </section>
    </ReservationListPage>
  )
}

// 전부다 임시 css 입니다.
const ReservationItem = styled.li`
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ddd;
  & + li{
    margin-top: 10px;
  }
  h4{
    margin-top: 10px;
    & + div {
      display: flex;
      gap: 10px;
      align-items: center;
      font-size: 14px;
      & > span{
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }
  &.past_reservations{
    .reservationInfo{
      display: flex;
      gap: 10px;
      .status{
        &.canceled{
          color: red;
        }
        &.completed{
          color: green;
        }
      }
    }
    .sitterInfo{
      display: flex;
      gap: 10px;
      align-items: center;
      button{
        border-bottom: 1px solid #000;
        &:after{
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          border-top: 1px solid #000;
          border-right: 1px solid #000;
          transform: rotate(45deg);
          vertical-align: middle;
          margin: -2px 0 0 4px;
        }
      }
    }
  }
`
const ReservationListPage = styled.div`
  line-height: 1.2;
  h2{
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 20px;
  }
  h3{
    font-size: 18px;
    font-weight: bold;
    margin: 30px 0 10px;
  }
`
const NoResult = styled.p`
  padding: 20px 15px;
  border-radius: 6px;
  background-color: rgba(120,120,120,.1);
`
const Loading = styled.p`
  padding: 20px 15px;
  border-radius: 6px;
  background-color: rgba(120,120,120,.1);
`
export default ReservationList;