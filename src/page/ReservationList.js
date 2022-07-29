import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation } from 'react-query';
import { Link } from 'react-router-dom';
import { apis } from '../store/api';
import { chatApis } from "../store/chatApi";
import moment from 'moment';

import Tabs from '../elements/Tabs';
import { useNavigate } from 'react-router-dom';
import StyledButton from '../elements/StyledButton';
import Review from './Review';
import CareDiary from './CareDiary';
import Modal from '../elements/Modal';
import ChatList from "./ChatList";
import Alert from '../elements/Alert';

const ReservationList = ({socket, tab, setTab}) => {
  const navigate = useNavigate();
  const [pastReservation, setPastReservation] = useState();
  const [proceedings, setProceedings] = useState();
  const [selectedTab, setSelectedTab] = useState(tab);
  const [modalDisplay, setModalDisplay] = useState(false);
  const [modalType, setModalType] = useState(null);
  const reviewTextRef = useRef();
  const [reviewText, setReviewText] = useState();
  const starRef = useRef();
  const today = moment().format('YYYY/MM/DD');
  const [errorMessage, setErrorMessage] = useState(null);
  const [buttonHide, setButtonHide] = useState(true);
  const [reviewPageMode, setReviewPageMode] = useState('write');
  const diaryPageMode = useRef();
  const idForReview = useRef();
  const [diaryData, setDiaryData] = useState(null);
  const [diaryStatus, setDiaryStatus] = useState(null);
  const reservationIdForDiary = useRef();
  const timeoutRef = useRef();
  const setAlert = useRef({status: false, text: null});
  let alertTimeout; 
  const modifyData = useRef({ addImage: [], deleteImage: [] });
  const dataToSend = useRef({
    reservationId: null,
    data: {
      sitterId: null,
      reviewStar: null,
      reviewInfo: null,
    },
  });
  const [diarySave, setDiarySave] = useState(false);
  const chatInfo = useRef({
    sitterId: null,
    chatRoomId: null,
  });
  const [popup, setPopup] = useState({
    popup: false,
    socket: socket,
    id: null,
    username: null
  });
  const {
		mutate: reservatioinList,
    data: reservationListData,
	} = useMutation(() => apis.reservationList(selectedTab), {
		onSuccess: (data) => {
      console.log(data, 'list')
			setProceedings(data.data.proceedings);
			setPastReservation(data.data.pasts);
      if(data.data.pasts.length < 3){
        setButtonHide(true);
      }else{
        setButtonHide(false);
      }
		},
		onError: (data) => {
      if(selectedTab === 'sitter' && data.response.status === 402){
        setModalType(modalContent.noSitterInfo);
        setModalDisplay(true);
      }
		},
    onSettled: (data) => {
    },
		staleTime: Infinity,
	});
 
  const registerReviewApi = (reservationId, data) => {
    return apis.registerReview(reservationId, data);
  };
  const { mutate: saveReview } = useMutation(
    () =>
      registerReviewApi(
        dataToSend.current.reservationId,
        dataToSend.current.data
      ),
    {
      onSuccess: (data) => {
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
          },
        };
        reservatioinList();
        setAlert.current = {status: true, text: '리뷰를 등록했습니다.'};
        const timeout = setTimeout(() => {
          setAlert.current = {status: false, text: null};
        }, 3000);
        timeoutRef.current = timeout;
      },
      onError: (data) => {
      },
    }
  );
  const { mutate: morePastReviews } = useMutation(
    () =>
      apis.loadMorePastReservation(
        pastReservation[pastReservation.length - 1].reservationId,
        selectedTab
      ),
    {
      onSuccess: (data) => {
        if (data.data.reservations.length < 3) {
          setButtonHide(true);
          setAlert.current = {status: true, text: '지난 예약 리스트를 모두 불러왔습니다.'};
          const timeout = setTimeout(() => {
            setAlert.current = {status: false, text: null};
          }, 3000);
          timeoutRef.current = timeout;
          return;
        }
        setPastReservation((prev) => {
          return [...prev, ...data.data.reservations];
        });
      },
      onError: (data) => {
        if (data.response.status === 401) {
          setButtonHide(true);
          setAlert.current = {status: true, text: '추가로 불러올 지난 예약 리스트가 없습니다.'};
          const timeout = setTimeout(() => {
            setAlert.current = {status: false, text: null};
          }, 3000);
          timeoutRef.current = timeout;
        }
      },
    }
  );
  const { mutate: loadReview, data: reviewData } = useMutation(
    () => apis.loadReview(idForReview.current),
    {
      onSuccess: (data) => {
        setModalType(modalContent.reviewView);
        setReviewPageMode('clear');
        setModalDisplay(true);
      },
      onError: (data) => {
      },
    }
  );
  const request = useRef(0);

  const registerDiaryApi = (diaryData) => {
    if (diaryData?.inputValues.length < diaryData?.checked.length) {
      diaryData?.checked.pop();
    }
    const formData = new FormData();
    formData.append('checkList', JSON.stringify(diaryData.inputValues));
    formData.append('checkStatus', JSON.stringify(diaryData.checked));
    formData.append('diaryInfo', diaryData.text ? diaryData.text : " ");
    formData.append('diaryImage', JSON.stringify(diaryData.files));
    for (let i = 0; diaryData.files.length > i; i++) {
      formData.append('diaryImage', diaryData.files[i]);
    };
    if(request.current === 0)return apis.registerDiary(reservationIdForDiary.current, formData);
    request.current+=1;
  };
  const saveDiary = useQuery(['saveDiaryQuery', diaryData], ()=>registerDiaryApi(diaryData), {
    onSuccess: (data) => {
      setDiarySave(false);
      setModalDisplay(false);
      setModalType(null);
      setDiaryData(null);
      setDiaryStatus('clear');
      reservationIdForDiary.current = null;
      reservatioinList();
    },
    onError: (data) => {
    },
    enabled: !!diarySave,
  });
  const loadDiaryApi = (reservationIdForDiary) => {
    return apis.loadDiaryData(reservationIdForDiary);
  }
  const {mutate: loadDiaryData} = useMutation(()=>loadDiaryApi(reservationIdForDiary.current), {
    onSuccess: (data) => {
      const _data = {
        checkList: data.data.checkList?.length ? data.data.checkList?.length : 0,
        inputValues: data.data.checkList ? data.data.checkList : [],
        checked: data.data.checkStatus ? data.data.checkStatus : [],
        images: data.data.diaryImage.length,
        imageUrls: data.data.diaryImage,
        files: [],
        text: data.data.diaryInfo,
      }
      setDiaryData(_data);
      setDiaryStatus('get');
      if(selectedTab === 'user'){
        // 유저탭일 경우 돌봄일지 읽기만 가능
        diaryPageMode.current = 'readonly';
        setModalType(modalContent.diaryView);
      }else{
        // 돌보미 탭일 경우 
        const reservationId = reservationIdForDiary.current;
        const status = pastReservation.filter((v)=>v.reservationId === reservationId);
        if(status.length){
          // 지난 예약일 경우 읽기만 가능
          diaryPageMode.current = 'readonly';
          setModalType(modalContent.diaryView);
        }else{
          // 진행중인 예약일 경우 돌봄일지 작성 및 수정 가능
          setDiaryStatus('get');
          diaryPageMode.current = 'view';
          setModalType(modalContent.diary);
        }
      } 
      setModalDisplay(true);
    },
    onError: (data) => {
      if (selectedTab === 'user' && data.response.status === 400) {
        setModalType(modalContent.noDiary);
        setModalDisplay(true);
        return;
      }
      const reservationId = reservationIdForDiary.current;
      const status = pastReservation.filter((v)=>v.reservationId === reservationId);
      if(status.length){
        // 지난 예약일 경우 읽기만 가능
        diaryPageMode.current = 'readonly';
        setModalType(modalContent.diaryView);
      }else{
        // 진행중인 예약일 경우 돌봄일지 작성 및 수정 가능
        // setDiaryStatus('clear');
        diaryPageMode.current = 'write';
        setModalType(modalContent.diary);
      }
      setModalDisplay(true);
    },
  });

  const modifyDiaryApi = () => {
    if (diaryData?.inputValues.length < diaryData?.checked.length) {
      diaryData?.checked.pop();
    }
    const formData = new FormData();
    formData.append('checkList', JSON.stringify(diaryData.inputValues));
    formData.append('checkStatus', JSON.stringify(diaryData.checked));
    formData.append('diaryInfo', diaryData.text ? diaryData.text : " ");
    formData.append('deleteImage', JSON.stringify(modifyData.current.deleteImage));
    for(let i=0; modifyData.current.addImage.length > i; i++){
      formData.append('addImage', modifyData.current.addImage[i]);
    }
    return apis.modifyDiary(reservationIdForDiary.current, formData);
  };
  const { mutate: diaryModify } = useMutation(() => modifyDiaryApi(), {
    onSuccess: (data) => {
      setReviewPageMode('clear');
      modifyData.current = { addImage: [], deleteImage: [] };
      setModalDisplay(false);
      setModalType(null);
    },
    onError: (data) => {
    },
  });
  const {mutate: openChatRoom} = useMutation(() => chatApis.chatRoomPost(chatInfo.current.sitterId), {
    onSuccess: (data) => {
      chatInfo.current = {...chatInfo.current, chatRoomId: data.data.roomId}
      setPopup((prev) => {
        return {
          ...prev,
          popup:!popup.popup
        }
      })
    }
  });

  const confirmWritingReview = () => {
    if (starRef.current > 0 && reviewTextRef.current?.value.length > 0) {
      dataToSend.current.data.reviewStar = starRef.current;
      dataToSend.current.data.reviewInfo = reviewTextRef.current?.value;
      saveReview();
      setErrorMessage(null);
    } else {
      if (starRef.current <= 0 || !starRef.current) {
        setErrorMessage('별점을 입력해주세요.');
        return;
      }
      if (
        reviewTextRef.current?.value.length <= 0 ||
        !reviewTextRef.current?.value
      ) {
        setErrorMessage('리뷰 내용을 작성해주세요.');
        return;
      }
    }
  };
  const cancelWritingDiary = async () => {
    await setDiaryStatus('save');
    setModalType(modalContent.diaryCancel);
  };

  const confirmWritingDiary = () => {
    if (diaryPageMode.current === 'write') {
      // 최초 등록일 경우
      setDiaryStatus('save');
      setDiarySave(true);
      setAlert.current = {status: true, text: '일지 작성이 완료되었습니다.'};
      const timeout = setTimeout(() => {
        setAlert.current = {status: false, text: null};
      }, 3000);
      timeoutRef.current = timeout;
    } else {
      // 수정일 경우
      diaryModify();
      setAlert.current = {status: true, text: '일지를 수정했습니다.'};
      const timeout = setTimeout(() => {
        setAlert.current = {status: false, text: null};
      }, 3000);
      timeoutRef.current = timeout;
    }
  };
  const closeDiaryPage = () => {
    setModalDisplay(false);
    setModalType(null);
    reservationIdForDiary.current = null;
    if (diaryPageMode.current === 'write') {
      setDiaryStatus('clear');
    } else {
      setDiaryStatus(null);
    }
  };
  const modalContent = {
    review: {
      type: 'review',
      _alert: false,
      _confirm: '등록',
      _cancel: '취소',
      confirmFn: confirmWritingReview,
      cancelFn: () => {
        setReviewText(reviewTextRef.current?.value);
        setModalType(modalContent.reviewCancel);
      },
    },
    reviewView: {
      type: 'review',
      _alert: true,
      confirmFn: () => {
        setModalDisplay(false);
        setModalType(null);
      },
    },
    reviewCancel: {
      type: 'reviewCancel',
      _alert: false,
      _confirm: '리뷰 작성 취소',
      _cancel: '이어서 작성',
      confirmFn: () => {
        setModalDisplay(false);
        setModalType(null);
        setReviewText(null);
        starRef.current = null;
        dataToSend.current.data.sitterId = null;
        dataToSend.current.reservationId = null;
        setErrorMessage(null);
      },
      cancelFn: () => {
        setModalType(modalContent.review);
      },
    },
    diary: {
      type: 'diary',
      _alert: false,
      _confirm: '등록',
      _cancel: '취소',
      confirmFn: confirmWritingDiary,
      cancelFn: cancelWritingDiary,
    },
    diaryView: {
      type: 'diary',
      _alert: true,
      confirmFn: () => {
        setModalDisplay(false);
        setModalType(null);
        diaryPageMode.current = null;
        setDiaryStatus('clear');
      },
    },
    diaryCancel: {
      type: 'diaryCancel',
      _alert: false,
      _confirm: '일지 작성 취소',
      _cancel: '이어서 작성',
      confirmFn: closeDiaryPage,
      cancelFn: () => {
        setDiaryStatus('get');
        setModalType(modalContent.diary);
      },
    },
    noDiary: {
      type: 'noDiary',
      _alert: true,
      _confirm: '확인',
      confirmFn: () => setModalDisplay(false),
    },
    noSitterInfo: {
      type: 'noSitterInfo',
      _alert: false,
      _confirm: '돌보미 프로필 등록',
      _cancel: '취소',
      confirmFn: () => navigate('/mypage/sitterprofile'),
      cancelFn: () => navigate(0),
    },
  };
  useEffect(() => {
    reservatioinList();
    setProceedings([]);
    setPastReservation([]);
    setTab(selectedTab);
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
	}, [reservationListData]);

  useEffect(()=>{
    if(sessionStorage.getItem('reservationInfo')){
      sessionStorage.removeItem('reservationInfo');
    }
    const timeoutId = timeoutRef.current;
    return () => {
      clearTimeout(timeoutId);
    };
  },[])

  return (
    <>
      <ReservationListPage style={{ paddingBottom: '100px' }}>
        <section className='page_top'>
          <h2>예약</h2>
          <Tabs
            _tab={['사용자', '돌보미']}
            _value={['user', 'sitter']}
            _checked={selectedTab}
            setSelectedTab={setSelectedTab}
            _style={{margin: '0 -20px 42px'}}
          />
        </section>
        <section className='page_body'>
          <section>
            <h3>진행중인 예약</h3>
            <ul>
              {proceedings?.length > 0 ? (
                selectedTab === 'user' ? (
                  proceedings.map((v, i) => {
                    return (
                      <ReservationItem
                        key={`reservation_${i}`}
                        className='proceeding_reservations'
                      >
                        <Link
                          to={`/reservation/detail/${selectedTab}/${v.reservationId}`}
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 1,
                          }}
                        ></Link>
                        <ReservationTagContainer>
                          <div>
                            {v.category.map((category, index) => (
                              <Tag key={`category_${index}`}>
                                {category}
                              </Tag>
                            ))}
                          </div>
                          <div>
                            {v.reservationDate.map((date, index) => (
                              <ReserveDate key={`date_${index}`}>
                                {date}
                              </ReserveDate>
                            ))}
                          </div>
                        </ReservationTagContainer>
                        <ReservationInfoContainer
                          style={{ justifyContent: 'space-between' }}
                        >
                          <div className='sitterInfo'>
                            <SitterImage
                              style={{
                                backgroundImage: `url(${v.imageUrl})`,
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '75px',
                              }}
                            ></SitterImage>
                            <SitterInfo>
                              <p className='sitterName'>{v.sitterName}</p>
                              <p className='sitterAddress'>
                                <i className='ic-location' />
                                {v.address}
                              </p>
                              <p className='sitterPhone'>
                                <i className='ic-phone' />
                                {
                                  v.phoneNumber ? v.phoneNumber : '문의하기 기능을 이용해주세요.'
                                }
                              </p>
                              
                            </SitterInfo>
                          </div>
                          <div
                            className='buttons'
                            style={{ position: 'relative', zIndex: 2 }}
                          >
                            <StyledButton
                              _margin='0'
                              _title='돌봄일지 보기'
                              _onClick={() => {
                                reservationIdForDiary.current =
                                  v.reservationId;
                                loadDiaryData();
                              }}
                            />
                            {!v.isPending && (
                              <StyledButton
                                _bgColor='#ffffff'
                                color='#fc9215'
                                _margin='0'
                                _padding='7px 0px'
                                _title='문의하기'
                                _border='1px solid #FC9215'
                                _onClick={()=>{
                                  chatInfo.current = {...chatInfo.current, sitterId: v.sitterId}
                                  openChatRoom();
                                }}
                              />
                            )}
                            {v.isPending && (
                              <StyledButton
                                _margin='0'
                                _title='리뷰 작성하기'
                                _onClick={() => {
                                  setModalType(modalContent.review);
                                  setReviewPageMode('write');
                                  setModalDisplay(true);
                                  dataToSend.current.data.sitterId =
                                    v.sitterId;
                                  dataToSend.current.reservationId =
                                    v.reservationId;
                                }}
                              />
                            )}
                          </div>
                        </ReservationInfoContainer>
                        {v.isPending && (
                          <InformText>
                            * 리뷰를 작성해야 서비스가 완료됩니다.
                          </InformText>
                        )}
                      </ReservationItem>
                    );
                  })
                ) : (
                  proceedings.map((v, i) => {
                    return (
                      <ReservationItem
                        key={`reservation_${i}`}
                        className='proceeding_reservations'
                      >
                        <Link
                          to={`/reservation/detail/${selectedTab}/${v.reservationId}`}
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 1,
                          }}
                        ></Link>
                        <ReservationTagContainer>
                          <div>
                            {v.category.map((category, index) => (
                              <Tag key={`category_${index}`}>
                                {category}
                              </Tag>
                            ))}
                          </div>
                          <div>
                            {v.reservationDate.map((date, index) => (
                              <ReserveDate key={`date_${index}`}>
                                {date}
                              </ReserveDate>
                            ))}
                          </div>
                        </ReservationTagContainer>
                        <ReservationInfoContainer style={{justifyContent: 'space-between'}}>
                          <div className='sitterInfo'>
                            <SitterInfo>
                              <p className='sitterName'>{v.userName}</p>
                              <p className='sitterPhone'>
                                <i className='ic-phone' />
                                  {
                                    v.phoneNumber ? v.phoneNumber : '문의하기 기능을 이용해주세요.'
                                  }
                              </p>
                            </SitterInfo>
                          </div>
                          <div
                            className='buttons sitter'
                            style={{ position: 'relative', zIndex: 2 }}
                          >
                            {
                              v.diaryExist ? (
                                <StyledButton
                                  _margin='0'
                                  _padding='6px 0px'
                                  _title='일지 수정하기'
                                  _onClick={() => {
                                    reservationIdForDiary.current =
                                      v.reservationId;
                                    loadDiaryData();
                                  }}
                                />
                              ):(
                                <StyledButton
                                  _margin='0'
                                  _padding='6px 0px'
                                  _title='일지 작성하기'
                                  _onClick={() => {
                                    reservationIdForDiary.current =
                                      v.reservationId;
                                    diaryPageMode.current = 'write'
                                    setModalType(modalContent.diary);
                                    setModalDisplay(true);
                                    
                                  }}
                                />
                              )
                            }
                          </div>
                        </ReservationInfoContainer>
                        {v.isPending && (
                          <InformText>
                            신청자가 리뷰를 작성해야 서비스가
                            완료됩니다.
                          </InformText>
                        )}
                      </ReservationItem>
                    );
                  })
                )
              ) : (
                <>
                  {
                    reservationListData && <NoResult>진행중인 예약 내역이 없습니다.</NoResult>
                  }
                </>
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
                    >
                      <Link
                        to={`/reservation/detail/${selectedTab}/${v.reservationId}`}
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 1,
                        }}
                      ></Link>
                      <ReservationTagContainer>
                        <div>
                          {v.category.map((category, index) => (
                            <Tag key={`category_${index}`}>{category}</Tag>
                          ))}
                          {v.reservationState === '취소완료' ? (
                            <TagCancel>{v.reservationState}</TagCancel>
                          ) : <TagCompleted>{v.reservationState}</TagCompleted>}
                        </div>
                        <div>
                          {v.reservationDate.map((date, index) => (
                            <ReserveDate key={`date_${index}`}>
                              {date}
                            </ReserveDate>
                          ))}
                        </div>
                      </ReservationTagContainer>
                      <ReservationInfoContainer style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        {selectedTab === 'user' ? (
                          <SitterInfo className='sitterInfo user' style={{zIndex: 2, alignItems: 'center'}}>
                            <p className='sitterName'>{v.sitterName}</p>
                            <button
                              type='button'
                              onClick={() =>
                                navigate(`/detail/${v.sitterId}`)
                              }
                            >
                              {v.sitterName}님 상세페이지
                            </button>
                          </SitterInfo>
                        ) : (
                          <UserInfo>
                            <dl className='userName'>
                              <dt style={{color: '#676767'}}>신청자</dt>
                              <dd>{v.userName}</dd>
                            </dl>
                          </UserInfo>
                        )}
                        {v.reservationState !== '취소완료' && (
                          <div
                            className='buttons'
                            style={{ position: 'relative', zIndex: 2 }}
                          >
                            <StyledButton
                              _margin='0'
                              _title='리뷰 보기'
                              color={'#fc9215'}
                              _bgColor={'#fff'}
                              _border={'1px solid #fc9215'}
                              _onClick={() => {
                                idForReview.current = v.reservationId;
                                loadReview();
                              }}
                            />
                            {v.isPending && (
                              <StyledButton
                                _margin='0'
                                _title='돌봄일지 보기'
                                color={'#fc9215'}
                                _bgColor={'#fff'}
                                _border={'1px solid #fc9215'}
                                _onClick={() => {
                                  reservationIdForDiary.current =
                                    v.reservationId;
                                  loadDiaryData();
                                }}
                              />
                            )}
                          </div>
                        )}
                      </ReservationInfoContainer>
                      {v.isPending && (
                        <InformText>
                          리뷰를 작성해야 서비스가 완료됩니다.
                        </InformText>
                      )}
                    </ReservationItem>
                  );
                })
              ) : (
                <NoResult>지난 예약 내역이 없습니다.</NoResult>
              )}
            </ul>
            {!buttonHide && (
              <div style={{textAlign: 'center'}}>
                <LoadMoreButton type="button" onClick={() => {
                  morePastReviews();
                }}>지난 예약 더보기</LoadMoreButton>
              </div>
            )}
          </section>
        </section>
      </ReservationListPage>
      {modalType && (
        <Modal
          _display={modalDisplay}
          _alert={modalType._alert}
          _confirm={modalType._confirm}
          _cancel={modalType._cancel}
          cancelOnclick={modalType.cancelFn}
          confirmOnClick={modalType.confirmFn}
        >
          {modalType.type === 'review' ? (
            <Review
              mode={reviewPageMode}
              reviewTextRef={reviewTextRef}
              reviewText={reviewText}
              starRef={starRef}
              errorMessage={errorMessage}
              reviewData={reviewData}
            />
          ) : modalType.type === 'reviewView' ? (
            <Review
              mode={reviewPageMode}
              reviewTextRef={reviewTextRef}
              reviewText={reviewText}
              starRef={starRef}
              errorMessage={errorMessage}
              reviewData={reviewData}
            />
          ) : modalType.type === 'diary' ? (
            <CareDiary
              mode={diaryPageMode}
              setDiaryData={setDiaryData}
              diaryData={diaryData}
              diaryStatus={diaryStatus}
              modifyData={modifyData}
            />
          ) : modalType.type === 'reviewCancel' ? (
            <div className='text_area'>
              <p>
                리뷰 작성을 취소하시겠습니까? 취소할 경우 작성한 내용은 저장되지
                않습니다.
              </p>
            </div>
          ) : modalType.type === 'noSitterInfo' ? (
            <div className='text_area'>
              <p>등록된 돌보미 프로필이 없습니다.</p>
            </div>
          ) : modalType.type === 'noDiary' ? (
            <div className='text_area'>
              <p>
                등록된 돌봄일지가 없습니다.
              </p>
            </div>
          ) : (
            <div className='text_area'>
              <p>
                일지 작성을 취소하시겠습니까? 취소할 경우 작성한 내용은 저장되지
                않습니다.
              </p>
            </div>
          )}
        </Modal>
      )}
      {
        chatInfo.current?.chatRoomId && popup.popup && <ChatList socket={socket} room={chatInfo.current.chatRoomId} detailOnly={true} popup={popup.popup} setPopup={setPopup}/>
      }
      {setAlert.current.status && <Alert _text={setAlert.current.text}/>}
    </>
  );
};

const LoadMoreButton = styled.button`
  padding: 0 16px;
  height: 38px;
  line-height: 36px;
  background: #FFFFFF;
  border: 1px solid rgba(120, 120, 120, 0.2);
  border-radius: 19px;
`
const ReservationItem = styled.li`
  position: relative;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid #ddd;
  margin-bottom: 16px;
  &.proceeding_reservations{
    .sitterInfo{
      p{
        margin-top: 5px;
      }
    }
  }
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
  }
  .buttons {
    flex-shrink: 0;
    width: 85px;
    button{
      font-size: 13px;
      height: 31px;
      padding: 6px 0;
    }
    button + button {
      margin: 6px 0 0;
    }
    &.sitter{
      width: 100px;
    }
  }
`;

const ReservationTagContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Tag = styled.span`
  background: rgba(120, 120, 120, 0.1);
  border-radius: 3px;
  padding: 3px 6px;
  color: #676767;
  margin-right: 4px;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
`;

const TagCancel = styled.span`
  background: rgba(240, 29, 29, 0.1);
  border-radius: 3px;
  padding: 3px 6px;
  color: #f01d1d;
  margin-right: 4px;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
`;

const TagCompleted = styled.span`
  background: rgba(113, 191, 10, 0.1);
  border-radius: 3px;
  padding: 3px 6px;
  color: #71BF0A;
  margin-right: 4px;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
`;

const ReserveDate = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #676767;
`;

const ReservationInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 10px;
  word-break: keep-all;
  .sitterInfo {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-evenly;
    button {
      border-bottom: 1px solid #000;
      margin-left: 10px;
      padding: 4px 0;
      &:after {
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
`;

const SitterInfo = styled.div` 
  .sitterName {
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
  }
  .sitterAddress,
  .sitterPhone {
    position: relative;
    padding-left: 15px;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: #676767;
    i {
      position: absolute;
      left: 0;
      top: 0;
      margin-right: 2px;
      vertical-align: bottom;
    }
  }
  .ic-phone{
    font-size: 12px;
    margin-left: -2px;
  }
  
`;

const UserInfo = styled.div`
  .userName {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    dt{
      position: relative;
      padding-right: 6px;
      margin-right: 6px;
      &:before{
        position: absolute;
        right: 0;
        width: 1px;
        height: 14px;
        top: 50%;
        margin-top: -6px;
        content: '';
        background-color: #ccc;
      }
    }
  }
`
const SitterImage = styled.div`
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  border-radius: 10px;
  margin-top: 8px;
  margin-right: 11px;
  border: 1px solid #e9e9e9;
  @media (min-width: 375px){
    width: 50px;
    height: 50px;
  }
`;

const ReservationListPage = styled.div`
  line-height: 1.2;
  h2 {
    font-weight: 700;
    font-size: 24px;
    line-height: 29px;
    margin-bottom: 17px;
  }
  h3 {
    font-weight: 400;
    font-size: 21px;
    line-height: 25px;
    margin-bottom: 24px;
  }
`;
const NoResult = styled.p`
  font-size: 15px;
  padding: 20px 15px;
  border-radius: 6px;
  background-color: rgba(120, 120, 120, 0.1);
  margin-bottom: 36px;
`;
const Loading = styled.p`
  padding: 20px 15px;
  border-radius: 6px;
  background-color: rgba(120, 120, 120, 0.1);
`;
const InformText = styled.p`
  font-size: 12px;
  color: #F01D1D;
  margin-top: 10px;
  border-top: 1px solid #e9e9e9;
  padding-top: 10px;
`;
export default ReservationList;
