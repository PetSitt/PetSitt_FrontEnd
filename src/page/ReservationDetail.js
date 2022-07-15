import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useQuery, useMutation } from "react-query";
import { apis } from "../store/api";

import StyledButton from "../elements/StyledButton";
import Modal from '../elements/Modal';

const ReservationDetail = () => {
  const navigate = useNavigate();
	const reservationId = useParams().id;
	const type = useParams().type;
	const [data, setData] = useState();
  const [modalDisplay, setModalDisplay] = useState(false);
	const reservatioinDetail = useQuery(
		"reservationDetailQuery",
		() => apis.reservationDetail(reservationId, type),
		{
			onSuccess: (data) => {
				console.log(data, "success");
				setData(data.data);
			},
			onError: (data) => {
				console.log(data, "error");
			},
			refetchOnMount: "always",
			staleTime: Infinity,
		}
	);
  const {mutate: cancelReservation} = useMutation(()=>apis.cancelReservation(reservationId), {
    onSuccess: (data) => {
      setModalDisplay(false);
      navigate('/reservation/list');
      console.log(data, 'success');
    },
    onError: (data) => {
      console.log(data, 'error');
    }
  })

	if (reservatioinDetail.isLoading || !data) return null;
  if(type === 'user') {
  return (
		<>
			<ReservationDetailPage>
				<section className="page_top">
					<h2>진행중인 예약</h2>
				</section>
				<section className="page_body">
					<section>
						<span style={{ backgroundImage: `url()` }}></span>
						<h4>{data.sitterName} 돌보미가 방문합니다.</h4>
						<Link to={`/detail/${data.sitterId}`}>
							{data.sitterName} 돌보미 상세 프로필 상세보기
						</Link>
					</section>
					<section>
						<h3>서비스 의뢰내역</h3>
						<dl>
							<div>
								<dt>의뢰한 서비스</dt>
								<dd>
									{data.category.map((category, index) => (
										<span key={`category_${index}`}>{category}</span>
									))}
								</dd>
							</div>
							<div>
								<dt>의뢰한 날짜</dt>
								<dd>
									{data.reservationDate.map((date, index) => (
										<span key={`date_${index}`}>{date}</span>
									))}
								</dd>
							</div>
							<div>
								<dt>{data.sitterName}님의 연락처</dt>
								<dd>{data.phoneNumber}</dd>
							</div>
						</dl>
					</section>
					<section>
						<p>
							{data.sitterName}님이 제공하는 서비스의 일당 금액은
							{data.servicePrice}원 입니다.
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
					<section>
						<div>
							<StyledButton
								_bgColor={"rgba(252, 146, 21, 0.1)"}
								color={"#fc9215"}
								_title="예약 취소하기"
                _onClick={()=>setModalDisplay(true)}
							/>
						</div>
					</section>
				</section>
			</ReservationDetailPage>
			<Modal
				_text={"예약을 취소하시겠습니까?"}
				_alert={false}
				_display={modalDisplay}
        _confirm="예약 취소"
        _cancel="닫기"
				confirmOnClick={cancelReservation}
        cancelOnclick={()=>setModalDisplay(false)}
			>
				<div className="text_area">
					<h3>예약을 취소하시겠습니까?</h3>
				</div>
			</Modal>
		</>
	)}else{
    return (
      <>
			<ReservationDetailPage>
				<section className="page_top">
					<h2>진행중인 예약</h2>
				</section>
				<section className="page_body">
					<section>
						<span style={{ backgroundImage: `url()` }}></span>
						<h4>{data.pets.map((v,i)=><span key={`pet_${i}`}>{i > 0 ? ', ' + v.petName : v.petName}</span>)} 만날 준비 되셨나요?</h4>
					</section>
					<section>
						<h3>예약 내역</h3>
						<dl>
							<div>
								<dt>의뢰한 서비스</dt>
								<dd>
									{data.detailData.category.map((category, index) => (
										<span key={`category_${index}`}>{category}</span>
									))}
								</dd>
							</div>
							<div>
								<dt>의뢰한 날짜</dt>
								<dd>
									{data.detailData.reservationDate.map((date, index) => (
										<span key={`date_${index}`}>{date}</span>
									))}
								</dd>
							</div>
							<div>
								<dt>신청자 연락처</dt>
								<dd>{data.detailData.phoneNumber}</dd>
							</div>
						</dl>
					</section>
          <section>
            <h3>반려견 정보</h3>
            <ul>
              {
                data.pets.map((v,i)=>{
                  return(
                    <li key={`pet_${i}`}>
                      <div style={{backgroundImage: `url(${v.petImage})`}}></div>
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
                  )
                })
              }
            </ul>
          </section>
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
					<section>
						<div>
							<StyledButton
								_bgColor={"rgba(252, 146, 21, 0.1)"}
								color={"#fc9215"}
								_title="예약 취소하기"
                _onClick={()=>setModalDisplay(true)}
							/>
						</div>
					</section>
				</section>
			</ReservationDetailPage>
			<Modal
				_text={"예약을 취소하시겠습니까?"}
				_alert={false}
				_display={modalDisplay}
        _confirm="예약 취소"
        _cancel="닫기"
				confirmOnClick={cancelReservation}
        cancelOnclick={()=>setModalDisplay(false)}
			>
				<div className="text_area">
					<h3>예약을 취소하시겠습니까?</h3>
				</div>
			</Modal>
		</>
    )
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
`;
export default ReservationDetail;
