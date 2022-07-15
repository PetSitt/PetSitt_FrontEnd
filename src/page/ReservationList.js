import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {Link} from 'react-router-dom';
import { apis } from "../store/api";
import moment from "moment";

import Tabs from "../elements/Tabs";
import { useNavigate } from "react-router-dom";
import StyledButton from "../elements/StyledButton";
import Review from './Review';
import CareDiary from "./CareDiary";
import Modal from '../elements/Modal';

const ReservationList = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [pastReservation, setPastReservation] = useState();
	const [proceedings, setProceedings] = useState();
	const [selectedTab, setSelectedTab] = useState("user");
  const [modalDisplay, setModalDisplay] = useState(false);
  const [modalType, setModalType] = useState(null);
  const reviewTextRef = useRef();
  const [reviewText, setReviewText] = useState();
  const starRef = useRef();
	const today = moment().format("YYYY/MM/DD");
  const [errorMessage, setErrorMessage] = useState(null);
  const [buttonHide, setButtonHide] = useState(false);
  const [reviewPageMode, setReviewPageMode] = useState('write');
  const [diaryPageMode, setdiaryPageMode] = useState('write');
  const idForReview = useRef();
  const [diaryData, setDiaryData] = useState(null);
  const [diaryStatus, setDiaryStatus] = useState(null);
  const reservationIdForDiary = useRef();
  const dataToSend = useRef({
    reservationId: null,
    data: {
      sitterId: null,
      reviewStar: null,
      reviewInfo: null,
    }
  });
  const [diarySave, setDiarySave] = useState(false);
	const {
		data: reservatioinList,
		isFetched,
		isFetching,
		refetch,
	} = useQuery("reservationQuery", () => apis.reservationList(selectedTab), {
		onSuccess: (data) => {
			console.log(data, "success");
			setProceedings(data.data.proceedings);
			setPastReservation(data.data.pasts);
      console.log(data.data.pasts.length, 'past')
      if(data.data.pasts.length < 3){
        setButtonHide(true);
      }else{
        setButtonHide(false);
      }
		},
		onError: (data) => {
			console.log(data, "error");
		},
		refetchOnMount: "always",
		staleTime: Infinity,
	});
  const registerReviewApi = (reservationId, data) => {
    console.log(reservationId, data)
    return apis.registerReview(reservationId, data);
  }
  const {mutate: saveReview} = useMutation(()=>registerReviewApi(dataToSend.current.reservationId, dataToSend.current.data), {
    onSuccess: (data) => {
      console.log(data, 'review registered');
      setModalDisplay(false);
      setModalType(null);
      setReviewText(null);
      starRef.current = null;
      dataToSend.current = {
        reservationId: null,
        data: {
          sitterId: null,
          reviewStar: null,
          reviewInfo: null,
        }
      };
      refetch();
    },
    onError: (data) => {
      console.log(data, 'review registration failed');
    },
  })
  const {mutate: morePastReviews} = useMutation(()=>apis.loadMorePastReservation(pastReservation[pastReservation.length-1].reservationId, selectedTab), {
    onSuccess: (data) => {
      console.log(data, 'loaded more reviews');
      if(data.data.reservations.length < 3){
        setButtonHide(true);
        return;
      }
      setPastReservation((prev)=>{
        return [...prev, ...data.data.reservations];
      })
    },
    onError: (data) => {
      console.log(data, 'loading more reviews failed');
      if(data.response.status === 401){
        // 모달띄우기
        setButtonHide(true);
      }
    },
  })
  const {mutate: loadReview, data: reviewData} = useMutation(()=>apis.loadReview(idForReview.current), {
    onSuccess: (data) => {
      console.log(data, 'review loaded');
      setModalType(modalContent.review);
      setReviewPageMode('view');
      setModalDisplay(true);
    },
    onError: (data) => {
      console.log(data, 'loading review failed');
    }
  })
  const registerDiaryApi = (diaryData) => {
    if(diaryData?.inputValues.length < diaryData?.checked.length){
      diaryData?.checked.pop();
    }   
    const formData = new FormData();
    formData.append('checkList', JSON.stringify(diaryData.inputValues));
    formData.append('checkState', JSON.stringify(diaryData.checked));
    formData.append('diaryImage', JSON.stringify(diaryData.files));
    formData.append('diaryInfo', diaryData.text ? diaryData.text : null);
    
    // console.log(formData.get('checkList'), formData.get('checkState'), formData.get('diaryImage')[0], formData.get('diaryInfo'))
    // console.log(reservationIdForDiary.current)
    return apis.registerDiary(reservationIdForDiary.current, formData);
  }
  const saveDiary = useQuery(['saveDiaryQuery', diaryData], ()=>registerDiaryApi(diaryData), {
    onSuccess: (data) => {
      console.log(data, 'diary saving success');
      setDiarySave(false);
      setModalDisplay(false);
      setModalType(null);
      setDiaryData(null);
      setDiaryStatus('clear');
      reservationIdForDiary.current = null;
      refetch();
    },
    onError: (data) => {
      console.log(data, 'diary saving failed');
    },
    enabled: !!diarySave,
  })
  const confirmWritingReview = () => {
    if(starRef.current > 0 && reviewTextRef.current?.value.length > 0){
      dataToSend.current.data.reviewStar = starRef.current;
      dataToSend.current.data.reviewInfo = reviewTextRef.current?.value;
      saveReview();
      setErrorMessage(null);
    }else{
      if(starRef.current <= 0 || !starRef.current){
        setErrorMessage('별점을 입력해주세요.');
        return;
      }
      if(reviewTextRef.current?.value.length <= 0 || !reviewTextRef.current?.value){
        setErrorMessage('리뷰 내용을 작성해주세요.');
        return;
      }
    }
  }
  const cancelWritingDiary = async() => {
    await setDiaryStatus('save');
    setModalType(modalContent.diaryCancel);
  }
  const confirmWritingDiary = async() => {
    setDiaryStatus('save');
    setDiarySave(true);
  }
  // console.log(diaryStatus, diaryData)
  const modalContent = {
    review: {type: 'review', _confirm: '리뷰 등록', _cancel: '등록 취소', confirmFn: confirmWritingReview, cancelFn: ()=>{setReviewText(reviewTextRef.current?.value); setModalType(modalContent.reviewCancel)}},
    reviewCancel: {type: 'reviewCancel', _confirm: '리뷰 작성 취소', _cancel: '리뷰 작성', confirmFn: ()=>{setModalDisplay(false); setModalType(null); setReviewText(null); starRef.current = null; dataToSend.current.data.sitterId = null; dataToSend.current.reservationId = null; setErrorMessage(null)}, cancelFn: ()=>{setModalType(modalContent.review)}},
    diary: {type: 'diary', _confirm: '일지 등록', _cancel: '등록 취소', confirmFn: confirmWritingDiary, cancelFn: cancelWritingDiary},
    diaryCancel: {type: 'diaryCancel', _confirm: '일지 작성 취소', _cancel: '일지 작성', confirmFn: ()=>{setModalDisplay(false); setModalType(null); setDiaryStatus('clear'); reservationIdForDiary.current = null}, cancelFn: ()=>{setDiaryStatus('get'); setModalType(modalContent.diary)}},
  };
	useEffect(() => {
		refetch();
		queryClient.invalidateQueries("reservationQuery");
	}, [selectedTab]);

	useEffect(() => {
		if (proceedings) {
			setProceedings((prev) => {
				return [...prev].map((v, i) => {
					let pending = { isPending: false };
					v.reservationDate.map((date, idx) => {
						if (date < today) pending.isPending = true;
					});
					return { ...v, ...pending };
				});
			});
		}
	}, [reservatioinList]);

	return (
    <>
		<ReservationListPage>
			<section className="page_top">
				<h2>예약내역</h2>
				<Tabs
					_tab={["신청자", "돌보미"]}
					_value={["user", "sitter"]}
					setSelectedTab={setSelectedTab}
				/>
			</section>
			<section className="page_body">
				{isFetching ? (
					<p>예약 내역을 불러오는 중입니다.</p>
				) : (
					<>
						<section>
							<h3>진행중인 예약</h3>
								<ul>
									{proceedings?.length > 0 ? (
										selectedTab === 'user' ? (
                      proceedings.map((v, i) => {
                        return (
                          <ReservationItem key={`reservation_${i}`} className="proceeding_reservations">
                            <Link to={`/reservation/detail/${selectedTab}/${v.reservationId}`} style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0}}></Link>
                            <p className="reservationInfo">
                              <strong>
                                {v.category.map((category, index) => (
                                  <span key={`category_${index}`}>
                                    {index > 0 ? ", " + category : category}
                                  </span>
                                ))}
                              </strong>
                              <br />
                              <strong>
                                {v.reservationDate.map((date, index) => (
                                  <span key={`date_${index}`}>
                                    {index > 0 ? ", " + date : date}
                                  </span>
                                ))}
                              </strong>
                            </p>
                            <div className="sitterInfo">
                              <h4>돌보미 정보</h4>
                              <div>
                                <span style={{ backgroundImage: `url(${v.imageUrl})`}}></span>
                                <p>
                                  <strong>{v.sitterName}</strong>
                                  <em>{v.address}</em><br />
                                  <span>{v.phoneNumber}</span>
                                </p>
                              </div>
                            </div>
                            <div className="buttons" style={{position: 'relative', zIndex: 2}}>
                              <StyledButton
                                _bgColor={"rgba(252, 146, 21, 0.1)"}
                                color={"#fc9215"}
                                _margin="0"
                                _title="일지보기"
                              />
                              {!v.isPending && (
                                <StyledButton
                                  _bgColor={"rgba(252, 146, 21, 0.1)"}
                                  color={"#fc9215"}
                                  _margin="0"
                                  _title="문의하기"
                                />
                              )}
                              {v.isPending && (
                                <StyledButton
                                  _margin="0"
                                  _title="리뷰 작성하기"
                                  _onClick={()=>{setModalType(modalContent.review);setReviewPageMode('write');setModalDisplay(true); dataToSend.current.data.sitterId = v.sitterId; dataToSend.current.reservationId = v.reservationId}}
                                />
                              )}
                            </div>
                            {v.isPending && <InformText>* 리뷰를 작성해야 서비스가 완료됩니다.</InformText>}
                          </ReservationItem>
                        );
                      })
                    ) : (
                      proceedings.map((v, i) => {
                        return (
                          <ReservationItem key={`reservation_${i}`} className="proceeding_reservations">
                            <Link to={`/reservation/detail/${selectedTab}/${v.reservationId}`} style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0}}></Link>
                            <p className="reservationInfo">
                              <strong>
                                {v.category.map((category, index) => (
                                  <span key={`category_${index}`}>
                                    {index > 0 ? ", " + category : category}
                                  </span>
                                ))}
                              </strong>
                              <br />
                              <strong>
                                {v.reservationDate.map((date, index) => (
                                  <span key={`date_${index}`}>
                                    {index > 0 ? ", " + date : date}
                                  </span>
                                ))}
                              </strong>
                            </p>
                            <div className="sitterInfo">
                              <h4>신청자 정보</h4>
                              <div>
                                <p>
                                  <strong>{v.userName}</strong>
                                  <span>{v.phoneNumber}</span>
                                </p>
                              </div>
                            </div>
                            <div className="buttons" style={{position: 'relative', zIndex: 2}}>
                              {!v.isPending && (
                                <StyledButton
                                  _margin="0"
                                  _title="일지 작성하기"
                                  _onClick={()=>{setModalType(modalContent.diary); setModalDisplay(true); reservationIdForDiary.current = v.reservationId;}}
                                />
                              )}
                            </div>
                            {v.isPending &&
                              (selectedTab === "user" ? (
                                <InformText>
                                  * 리뷰를 작성해야 서비스가 완료됩니다.
                                </InformText>
                              ) : (
                                <InformText>
                                  * 신청자가 리뷰를 작성해야 서비스가 완료됩니다.
                                </InformText>
                              ))}
                          </ReservationItem>
                        );
                      })
                    )
									) : (
										<NoResult>진행중인 예약 내역이 없습니다.</NoResult>
									)}
								</ul>
						</section>
						<section>
							<h3>지난 예약</h3>
							<ul>
								{pastReservation?.length > 0 ? (
									pastReservation.map((v, i) => {
										return (
											<ReservationItem
												key={`reservation_${i}`}
												className="past_reservations"
											>
												<p className="reservationInfo">
													<strong>
														{v.category.map((category, index) => (
															<span key={`category_${index}`}>
																{index > 0 ? ", " + category : category}
															</span>
														))}
													</strong>
													<strong
														className={`status ${
															v.reservationState === "취소완료"
																? "canceled"
																: "completed"
														}`}
													>
														{v.reservationState}
													</strong>
													<strong>
														{v.reservationDate.map((date, index) => (
															<span key={`date_${index}`}>
																{index > 0 ? ", " + date : date}
															</span>
														))}
													</strong>
												</p>
												{selectedTab === "user" ? (
													<p className="sitterInfo">
														<strong>{v.sitterName}</strong>
														<button
															type="button"
															onClick={() => navigate(`/detail/${v.sitterId}`)}
														>
															{v.sitterName}님 상세페이지
														</button>
													</p>
												) : (
													<p className="sitterInfo">
														<strong>{v.userName}</strong>
													</p>
												)}
                        {
                          v.reservationState !== '취소완료' && (
                            <div className="buttons">
                            <StyledButton _margin="0" _title="리뷰 보기" color={'#fc9215'} _bgColor={'#fff'} _border={'1px solid #fc9215'} _onClick={()=>{idForReview.current = v.reservationId; loadReview()}}/>
                            <StyledButton _margin="0" _title="돌봄일지 보기" color={'#fc9215'} _bgColor={'#fff'} _border={'1px solid #fc9215'} />
                            </div>
                          )
                        }
											</ReservationItem>
										);
									})
								) : (
									<NoResult>지난 예약 내역이 없습니다.</NoResult>
								)}
							</ul>
              {
                !buttonHide && <StyledButton _onClick={()=>morePastReviews()} _title="지난 예약 더보기"/>
              }
						</section>
					</>
				)}
			</section>
		</ReservationListPage>
    {
      modalType && (
        <Modal _display={modalDisplay} _confirm={modalType._confirm} _cancel={modalType._cancel} cancelOnclick={modalType.cancelFn} confirmOnClick={modalType.confirmFn}>
          {modalType.type === 'review' ? (
            <Review mode={reviewPageMode} reviewTextRef={reviewTextRef} reviewText={reviewText} starRef={starRef} errorMessage={errorMessage} reviewData={reviewData}/>
          ): modalType.type === 'diary' ? (
            <CareDiary mode={diaryPageMode} setDiaryData={setDiaryData} diaryData={diaryData} diaryStatus={diaryStatus}/>
          ) : modalType.type === 'reviewCancel' ? (
            <div className="text_area">
              <h3>리뷰 작성을 취소하시겠습니까? 취소할 경우 작성한 내용은 저장되지 않습니다.</h3>
            </div>
          ) : (
            <div className="text_area">
              <h3>일지 작성을 취소하시겠습니까? 취소할 경우 작성한 내용은 저장되지 않습니다.</h3>
            </div>
          )}
        </Modal>
      )
    }
    </>
	);
};

// 전부다 임시 css 입니다.
const ReservationItem = styled.li`
	position: relative;
	padding: 10px;
	border-radius: 10px;
	border: 1px solid #ddd;
	& + li {
		margin-top: 10px;
	}
	h4 {
		margin-top: 10px;
		& + div {
			display: flex;
			gap: 10px;
			align-items: center;
			font-size: 14px;
			& > span {
				width: 60px;
				height: 60px;
				border-radius: 50%;
				background-size: cover;
				background-repeat: no-repeat;
				background-position: center;
			}
		}
	}
	&.past_reservations {
		.reservationInfo {
			display: flex;
			gap: 10px;
			.status {
				&.canceled {
					color: red;
				}
				&.completed {
					color: green;
				}
			}
		}
		.sitterInfo {
			display: flex;
			gap: 10px;
			align-items: center;
			button {
				border-bottom: 1px solid #000;
				&:after {
					content: "";
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
  .buttons{
    margin: 20px 0;
    button + button{
      margin: 6px 0 0;
    }
  } 
`;
const ReservationListPage = styled.div`
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
const NoResult = styled.p`
	padding: 20px 15px;
	border-radius: 6px;
	background-color: rgba(120, 120, 120, 0.1);
`;
const Loading = styled.p`
	padding: 20px 15px;
	border-radius: 6px;
	background-color: rgba(120, 120, 120, 0.1);
`;
const InformText = styled.p`
	font-size: 13px;
	color: red;
`;
export default ReservationList;
