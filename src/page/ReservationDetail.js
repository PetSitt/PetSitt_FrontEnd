import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery, useMutation } from 'react-query';
import { apis } from '../store/api';

import StyledButton from '../elements/StyledButton';
import Modal from '../elements/Modal';
import NavBox from '../elements/NavBox';

const ReservationDetail = () => {
  const navigate = useNavigate();
  const reservationId = useParams().id;
  const type = useParams().type;
  console.log(reservationId);
  const [data, setData] = useState();
  const [modalDisplay, setModalDisplay] = useState(false);
  const reservatioinDetail = useQuery(
    'reservationDetailQuery',
    () => apis.reservationDetail(reservationId, type),
    {
      onSuccess: (data) => {
        console.log(data, 'success');
        setData(data.data);
      },
      onError: (data) => {
        console.log(data, 'error');
      },
      refetchOnMount: 'always',
      staleTime: Infinity,
    }
  );
  const { mutate: cancelReservation } = useMutation(
    () => apis.cancelReservation(reservationId),
    {
      onSuccess: (data) => {
        setModalDisplay(false);
        navigate('/reservation/list');
        console.log(data, 'success');
      },
      onError: (data) => {
        console.log(data, 'error');
      },
    }
  );

  if (reservatioinDetail.isLoading || !data) return null;
  if (type === 'user') {
    return (
      <>
        <ReservationDetailPage>
          <NavBox
            _title={
              data.reservationState === '취소완료'
                ? '취소된 예약'
                : data.reservationState === '진행완료'
                ? '진행 완료된 예약'
                : '진행중인 예약'
            }
          />
          <section className='page_body'>
            <ReservTop>
              {data.reservationState === '취소완료' ? (
                <div className='emojiBox canceled'>
                  <i className='ic-canceled' />
                </div>
              ) : (
                <div className='emojiBox'>
                  <i className='ic-upcoming' />
                </div>
              )}
              {data.reservationState === '진행중' && (
                <h4>{data.sitterName} 돌보미 방문 예정</h4>
              )}
              <StyledButton
                _onClick={`/detail/${data.sitterId}`}
                _title='돌보미  프로필 보기'
                color='#FC9215'
                _bgColor='#ffffff'
                _border='1px solid #FC9215'
              />
            </ReservTop>
            <hr />
            <ReservBoby>
              <ReservInfoBox>
                <p className='reservTitle'>예약 시간</p>
                <div className='reservDescBox'>
                  {data.reservationDate.map((date, index) => (
                    <p className='reservDesc' key={`date_${index}`}>
                      {date}
                    </p>
                  ))}
                </div>
              </ReservInfoBox>
              <ReservInfoBox>
                <p className='reservTitle'>돌보미 정보</p>
                <div className='reservDescBox'>
                  <p className='reservDesc'>{data.sitterName}</p>
                  <p className='reservDesc'>{data.phoneNumber}</p>
                </div>
              </ReservInfoBox>
              <ReservInfoBox>
                <p className='reservTitle'>서비스 정보</p>
                <div className='reservDescBox'>
                  {data.category.map((category, index) => (
                    <p className='reservDesc' key={`category_${index}`}>
                      {category}
                    </p>
                  ))}
                </div>
              </ReservInfoBox>
              <hr />
              <ReservPriceBox>
                <p className='reservTitle'>결제 금액</p>
                <p className='reservDesc price'>{data.servicePrice}원</p>
              </ReservPriceBox>
              <hr />
            </ReservBoby>
            {data.reservationState === '진행중' && (
              <ReservNoticeBox>
                <ul>
                  <li>
                    * 위 금액은 확정된 금액이 아닌 돌보미가 제공하는 평균적인
                    금액입니다.
                  </li>
                  <li>
                    * 예약 완료 전 해당 서비스에 대한 확정 금액을 협의하시길
                    권고드립니다.
                  </li>
                </ul>
              </ReservNoticeBox>
            )}
            <section>
              <div>
                {data.reservationState === '진행중' ? (
                  <StyledButton
                    _bgColor='#ffffff'
                    color='#676767'
                    _border='1px solid rgba(120, 120, 120, 0.4)'
                    _title='예약 취소'
                    _onClick={() => setModalDisplay(true)}
                  />
                ) : (
                  <StyledButton
                    _bgColor={'rgba(252, 146, 21, 0.1)'}
                    color={'#fc9215'}
                    _title='예약 리스트'
                    _onClick={() => navigate('/reservation/list')}
                  />
                )}
              </div>
            </section>
          </section>
        </ReservationDetailPage>
        <Modal
          _alert={false}
          _display={modalDisplay}
          _confirm='삭제'
          _cancel='닫기'
          confirmOnClick={cancelReservation}
          cancelOnclick={() => setModalDisplay(false)}
        >
          <div className='reservCancel'>
            <h3>예약 취소</h3>
            <p>
              정말 {data.reservationDate} 예약건을 <br />
              취소하시겠습니까?
            </p>
          </div>
        </Modal>
      </>
    );
  } else {
    return (
      <>
        <ReservationDetailPage>
          <NavBox
            _title={
              data.detailData.reservationState === '취소완료'
                ? '취소된 예약'
                : data.detailData.reservationState === '진행완료'
                ? '진행 완료된 예약'
                : '진행중인 예약'
            }
          />
          <section className='page_body'>
            <ReservTop>
              {data.detailData.reservationState === '취소완료' ? (
                <div className='emojiBox canceled'>
                  <i className='ic-canceled' />
                </div>
              ) : (
                <div className='emojiBox'>
                  <i className='ic-upcoming' />
                </div>
              )}
              {data.detailData.reservationState === '진행중' && (
                <h4>
                  {data.pets.map((v, i) => (
                    <span key={`pet_${i}`}>
                      {i > 0 ? ', ' + v.petName : v.petName}
                    </span>
                  ))}
                  만날 준비 되셨나요?
                </h4>
              )}
              <StyledButton
                _onClick={`/detail/${data.detailData.sitterId}`}
                _title='돌보미 프로필 보기'
                color='#FC9215'
                _bgColor='#ffffff'
                _border='1px solid #FC9215'
              />
            </ReservTop>
            <hr />
            <ReservBoby>
              <ReservInfoBox>
                <p className='reservTitle'>의뢰한 시간</p>
                <div className='reservDescBox'>
                  {data.detailData.reservationDate.map((date, index) => (
                    <p className='reservDesc' key={`date_${index}`}>
                      {date}
                    </p>
                  ))}
                </div>
              </ReservInfoBox>
              <ReservInfoBox>
                <p className='reservTitle'>신청자 정보</p>
                <div className='reservDescBox'>
                  <p className='reservDesc'>{data.detailData.phoneNumber}</p>
                </div>
              </ReservInfoBox>
              <ReservInfoBox>
                <p className='reservTitle'>의뢰한 서비스 정보</p>
                <div className='reservDescBox'>
                  {data.detailData.category.map((category, index) => (
                    <p className='reservDesc' key={`category_${index}`}>
                      {category}
                    </p>
                  ))}
                </div>
              </ReservInfoBox>
            </ReservBoby>
            {data.detailData.reservationState === '진행중' && (
              <section>
                <h3>반려견 정보</h3>
                <ul>
                  {data.pets.map((v, i) => {
                    return (
                      <li key={`pet_${i}`}>
                        <div
                          style={{ backgroundImage: `url(${v.petImage})` }}
                        ></div>
                        <dl>
                          <div>
                            <dt>이름</dt>
                            <dd>{v.petName}</dd>
                          </div>
                          <div>
                            <dt>나이</dt>
                            <dd>{v.petAge}살</dd>
                          </div>
                          <div>
                            <dt>몸무게</dt>
                            <dd>{v.petWeight}kg</dd>
                          </div>
                          <div>
                            <dt>중성화</dt>
                            <dd>{v.petSpay ? '했어요' : '안했어요'}</dd>
                          </div>
                          <div>
                            <dt>품종</dt>
                            <dd>{v.petType}</dd>
                          </div>
                        </dl>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {data.reservationState === '진행중' && (
              <section>
                <p>
                  {data.detailData.sitterName}님이 제공하는 서비스의 일당 금액은
                  {data.detailData.servicePrice}원 입니다.
                </p>
                <ul>
                  <li>
                    * 위 금액은 확정된 금액이 아닌 돌보미가 제공하는 평균적인
                    금액입니다.
                  </li>
                  <li>
                    * 예약 완료 전 해당 서비스에 대한 확정 금액을 협의하시길
                    권고드립니다.
                  </li>
                </ul>
              </section>
            )}
            <section>
              <div>
                {data.detailData.reservationState === '진행중' ? (
                  <StyledButton
                    _bgColor={'rgba(252, 146, 21, 0.1)'}
                    color={'#fc9215'}
                    _title='예약 취소하기'
                    _onClick={() => setModalDisplay(true)}
                  />
                ) : (
                  <StyledButton
                    _bgColor={'rgba(252, 146, 21, 0.1)'}
                    color={'#fc9215'}
                    _title='예약 리스트'
                    _onClick={() => navigate('/reservation/list')}
                  />
                )}
              </div>
            </section>
          </section>
        </ReservationDetailPage>
        <Modal
          _title={'예약 취소'}
          _text={'예약 취소'}
          _alert={false}
          _display={modalDisplay}
          _confirm='예약 취소'
          _cancel='닫기'
          confirmOnClick={cancelReservation}
          cancelOnclick={() => setModalDisplay(false)}
        >
          <div className='text_area'>
            <h3>예약을 취소하시겠습니까?</h3>
          </div>
        </Modal>
      </>
    );
  }
};

// 전부다 임시 css 입니다.
const ReservationDetailPage = styled.div`
  line-height: 1.2;
  h2 {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 20px;
  }
  h3 {
    font-size: 18px;
    font-weight: bold;
    margin: 30px 0 10px;
  }
  dl > div {
    margin: 15px 0;
    dt {
      font-weight: bold;
    }
  }
  .reservCancel {
    h3 {
      font-weight: 700;
      font-size: 18px;
      line-height: 22px;
      text-align: center;
    }
    p {
      font-weight: 400;
      font-size: 18px;
      line-height: 22px;
      text-align: center;
    }
  }
`;

const ReservTop = styled.section`
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  text-align: center;
  .emojiBox {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: center;
    height: 60px;
    width: 60px;
    margin: auto;
    border-radius: 50%;
    background-color: rgba(252, 146, 21, 0.1);
    i {
      font-size: 32px;
    }
  }
  .canceled {
    background: rgba(33, 122, 255, 0.1);
  }
  h4 {
    font-weight: 500;
    font-size: 18px;
    line-height: 22px;
    text-align: center;
    margin: 16px 0 24px 0;
  }
`;

const ReservBoby = styled.section`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  padding: 24px 0;
`;
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
    padding-bottom: 10px;
  }
`;

const ReservPriceBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: top;
  justify-content: space-between;
  padding: 16px 0;
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

  ul li {
    padding-bottom: 10px;
  }
`;
export default ReservationDetail;
