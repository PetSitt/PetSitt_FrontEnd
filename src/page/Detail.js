import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "react-query";
import styled from "styled-components";
import { DateObject, Calendar } from "react-multi-date-picker";
import MapContainer from "./MapContainer";
import { apis } from "../store/api";

import Modal from '../elements/Modal';
import StyledButton from '../elements/StyledButton';
import Reviews from './Reviews';

const Detail = () => {
	const queryClient = useQueryClient();
	const param = useParams();
  const navigate = useNavigate();
	const sitterId = param.id;
	const [detail, setDetail] = useState();
	const today = new DateObject();
	const [date, setDate] = useState();
	const [dates, setDates] = useState(new Date());
  const [month, setMonth] = useState(new Date().getMonth()+1);
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
  const [unavailable, setUnavailable] = useState([]);
  const [services, setServices] = useState();
  const [servicesText, setServicesText] = useState([]);
  const [selectBoxToggle, setSelectBoxToggle] = useState({
    type: "",
    status: false,
  });
  const errorMessages = {
    'notLogin': '로그인 후 예약이 가능합니다.',
    'noDate': '날짜를 선택해주세요',
    'noService': '서비스를 선택해주세요.',
    'noPets': '등록된 반려견 정보가 없습니다.',
  }
  const [errorMessage, setErrorMessage] = useState(null);
  const reservationRef = useRef();
  const careSizeRef = useRef();
  const plusService = useRef();
  const reviewRef = useRef();
  const pageBodyRef = useRef();
  const floatingTabsRef = useRef();
  const selectAreaRef = useRef();
  const [modalDisplay, setModalDisplay] = useState(false)
  const [scrollY, setScrollY] = useState();
  const [scrollDirection, setScrollDirection] = useState();
  const datesTransformed = useRef([]);
  const hasPetInfo = useRef(null);
  const [floatingTabs, setFloatingTabs] = useState([
    {text: '서비스 예약하기', isActive: true, visibility: null, function: ()=>reservationRef.current.scrollIntoView({behavior: 'smooth'})},
    {text: '케어 가능한 반려견 사이즈', isActive: false, visibility: detail?.sitter.careSize.length > 0, function: ()=>careSizeRef.current.scrollIntoView({behavior: 'smooth'})},
    {text: '추가 제공 가능한 서비스', isActive: false, visibility: detail?.sitter.plusService.length, function: ()=>plusService.current.scrollIntoView({behavior: 'smooth'})},
    {text: '후기', isActive: false, visibility: null, function: ()=>reviewRef.current.scrollIntoView({behavior: 'smooth'})},
  ]) 
  const iconClasses = {
    '목욕 및 모발 관리' : 'ic-wash',
    '1박케어': 'ic-boarding',
    '데이케어': 'ic-daycare',
    '훈련': 'ic-prac',
    '산책': 'ic-stroll',
    '집앞 픽업 가능': 'ic-pickup',
    '응급 처치': 'ic-first-aid',
    '장기 예약 가능': 'ic-longterm',
    '퍼피 케어': 'ic-puppy',
    '노견 케어': 'ic-puppy',
    '실내놀이': 'ic-activity',
    '마당있음': 'ic-yard',
  };
  const disableDate = () => {
    const datesArray = [];
    detail.sitter.noDate.map(v=>{
      if (new Date(v).getMonth()+1 === month){
        datesArray.push(new Date(v).getDate())
      }
    })
    setUnavailable(datesArray);
  }
  const {
		isLoading: detailIsLoading,
		isSuccess,
		isFetched,
		data: detailData,
	} = useQuery("detail_data", () => apis.getUserDetail(sitterId), {
		onSuccess: (data) => {
			console.log(data.data, "data loaded");
      const _newPrice = data.data.sitter.servicePrice.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
      const _newData = {...data.data};
      _newData.sitter.servicePrice = _newPrice;
      setDetail(_newData);
      setServices(Array.from({length: data?.data?.sitter?.category.length}, () => false));
		},
		onError: (data) => {
			console.error(data);
		},
		staleTime: Infinity,
		refetchOnMount: "always",
	});
  const {mutate: openChatRoom} = useMutation(()=>apis.inquireToSitter(detail.sitter.sitterId), {
    onSuccess: (data)=>{
      console.log('문의하기 api success', data);
    },
    onError: (data) => {
      console.log('문의하기 api failed', data);
    }
  })
  const {data: checkRegisteredPet, refetch: petInfoRefetch} = useQuery('getPetInfoQuery', ()=>apis.getPetInfo(), {
    onSuccess: (data) => {
      if(data.data.check){
        hasPetInfo.current = true;
      }else{
        hasPetInfo.current = false;
      }
    },
    enabled: false,
  })
	const checkSelectArea = (e) => {
		if (!e.target.closest(".select_area") && !e.target.closest('.select_detail')) {
			setSelectBoxToggle({ type: "", status: false });
		}
	};
  const requestReservation = () => {
    let trueLength = 0;
    for (let i = 0; i < services.length; i++) {
      if (services[i]) {
        trueLength++;
      }
    }
    if (trueLength === 0) {
      setErrorMessage(errorMessages.noService);
      setModalDisplay(true);
      return;
    }
    if (dates.length === 0) {
      setErrorMessage(errorMessages.noDate);
      setModalDisplay(true);
      return;
    }
    const reservationInfo = {
      date: dates,
      service: servicesText,
      sitterName: detail.sitter.sitterName,
      price: detail.sitter.servicePrice,
      sitterId: detail.sitter.sitterId,
    }

    localStorage.setItem('reservationInfo', JSON.stringify(reservationInfo));
    navigate('/reservation');
  }
  useEffect(()=>{
    let elements = null; 
    if(selectBoxToggle.status && selectBoxToggle.type === 'date'){
      elements = document.querySelectorAll('.calendar_onModal .rmdp-day .sd');
    }else{
      elements = document.querySelectorAll('.calendar_onBody .rmdp-day .sd');
    }
    for(let i=0; i<elements.length; i++){
      for(let j=0; j<unavailable.length; j++){
        if(elements[i].innerText/1 === unavailable[j]){
          elements[i].parentNode.classList.add('rmdp-disabled');
        }
      }
    }
  },[unavailable])
  
  useEffect(()=>{
    if(detail){
      disableDate();
    }
  },[detail, month, selectBoxToggle]);

	useEffect(() => {
    // 날짜/서비스 선택하기 모달 활성화됐을 때 모달 외 배경 클릭하면 꺼지도록 이벤트 추가 
		window.addEventListener("click", checkSelectArea);
    // 로그인한 상태일 경우 등록된 반려견 정보 있는지 확인
    if(localStorage.getItem('accessToken') && localStorage.getItem('userName')){
      petInfoRefetch();
    }
		return()=>{
      window.removeEventListener("click", checkSelectArea);
      queryClient.invalidateQueries('detail_data');
			setDetail(null);
		}
	}, []);
  useEffect(()=>{
    if(services?.length > 0){
      setServicesText(()=>{
        const new_data = [];
        for (let i = 0; i < services.length; i++) {
          if (services[i]) {
            new_data.push(detail.sitter.category[i]);
          }
        }
        return new_data;
      });
    }
  }, [services]);

  useEffect(() => {
    if (date?.length >= 0) {
			const getDates = date.map((v,i) => {
				return v.format(v._format);
			});
      setDates(getDates);

      if(date?.length < 4){
        datesTransformed.current = [];
        for(let i = 0; i<date.length; i++){
          const dateItem = `${date[i].month.number < 10 ? '0' + date[i].month.number : date[i].month.number}. ${date[i].day} (${weekDays[date[i].weekDay.index]})`;
          datesTransformed.current.push(dateItem)
        }
      }else{
        const dateItem = `${date[0].month.number < 10 ? '0' + date[0].month.number : date[0].month.number}. ${date[0].day} (${weekDays[date[0].weekDay.index]})`;
        datesTransformed.current = [`${dateItem} 외 ${date.length - 1}개`]
      }
    }else{
      datesTransformed.current = [];
    }
    selectAreaRef.current?.classList.add('isActive');
  }, [date]);
  
  useEffect(()=>{
    if(scrollDirection === 'up'){
      selectAreaRef.current?.classList.add('isActive');
    }else{
      selectAreaRef.current?.classList.remove('isActive');
    }
    setSelectBoxToggle({ type: "", status: false });
  },[scrollDirection])

  const scrollEvent = (e) => {
    if(e.target.scrollTop >= pageBodyRef.current.offsetTop){
      floatingTabsRef.current.classList.add('isFixed');
    }else{
      floatingTabsRef.current.classList.remove('isFixed');
    }
  }

  if (detailIsLoading || !detail ) return <p>로딩중입니다</p>;
	return (
		<>
      <SitterDetailPage className="detailPageWrap" style={{paddingTop: 0}} onScroll={(e)=>{
        scrollEvent(e);
        setScrollY((prev)=>{
          if (prev > e.target.scrollTop) setScrollDirection('up');
          else setScrollDirection('down');
          return e.target.scrollTop;
        })
      }}>
        <section className="page_top">
          <section>
            <TopImage style={{backgroundImage: `url(${detail.sitter.mainImageUrl})`, margin: '0 -20px'}}></TopImage>
            <SitterProfile>
              <li className="profile">
                <span
                  style={{ backgroundImage: `url(${detail.sitter.imageUrl})` }}
                ></span>
              </li>
              <li className="user">
                <p className="userName">{detail.sitter.sitterName}</p>
                <p className="score">
                  <i className="ic-star"></i>
                  <strong>{detail.sitter.averageStar}</strong>({detail.sitter.reviewCount})
                </p>
              </li>
              <li className="address"><i className="ic-location"></i>{detail.sitter.address}</li>
              <li>
                <p className="rehire">재고용률 <strong>{detail.sitter.rehireRate}%</strong></p>	
              </li>
              <li className="introduce">
                <dl>
                  <dt>{detail.sitter.introTitle}</dt>
                  <dd>{detail.sitter.myIntro}</dd>
                </dl>
              </li>
            </SitterProfile>
          </section>
        </section>
        <section className="page_body" ref={pageBodyRef}>
          <FloatingTabsSection className="floatingTabs" ref={floatingTabsRef}>
            <ul>
              {
                floatingTabs.map((v,i)=>{
                  return (
                    <li key={`tab_${i}`}>
                      <button type="button" className={v.isActive ? 'isActive' : ''} onClick={()=>{
                        v.function();
                        for(let idx=0; idx<floatingTabs.length; idx++){
                          if(idx === i) floatingTabs[idx].isActive = true;
                          else floatingTabs[idx].isActive = false;
                        }

                      }}>{v.text}</button>
                    </li>
                  )
                })
              }
            </ul>
          </FloatingTabsSection>
          <section ref={reservationRef}>
            <h3 style={{ display: "flex", justifyContent: "space-between" }}>
              서비스 예약하기
              <p>
                <strong>{detail.sitter.servicePrice}원</strong>/일
              </p>
            </h3>
            <ServiceList>
              {detail.sitter.category.map((v, i) => {
                return (
                  <li key={`category_${i}`}>
                    <div>
                      <label>
                        <input type="checkbox" checked={services[i]} onChange={(e)=>{
                          setServices((prev)=>{
                            const new_data = [...prev];
                            new_data[i] = e.target.checked;
                            return new_data;
                          });
                          selectAreaRef.current.classList.add('isActive');
                        }}/>
                        <span>
                          <i className={iconClasses[v]}></i>
                          {v}
                        </span>
                      </label>
                    </div>
                  </li>
                );
              })}
            </ServiceList>
            <div>
              <Calendar
                className="calendar_onBody"
                value={date && date}
                onChange={setDate}
                multiple={true}
                format="YYYY/MM/DD"
                minDate={new Date()}
                maxDate={new Date(today.year + 1, today.month.number, today.day)}
                shadow={false}
                weekDays={weekDays}
                months={months}
                onMonthChange={(date) => setMonth(new Date(date).getMonth()+1)}
              />
            </div>
          </section>
          {
            detail.sitter.careSize.length > 0 && (
            <section ref={careSizeRef}>
              <h3>서비스 가능한 반려견 사이즈</h3>
              <ul className="serviceList">
                {detail.sitter.careSize.map((v, i) => {
                  return (
                    v && (
                    <li key={`careSize_${i}`}>
                      <i className="ic-check"></i><span>{i === 0 ? "소" : i === 1 ? "중" : "대"}</span>
                    </li>)
                  );
                })}
              </ul>
            </section>
            )
          }
          {
            detail.sitter.plusService.length > 0 && (
              <section ref={plusService}>
                <h3>추가 제공 가능한 서비스</h3>
                <ul className="serviceList">
                  {detail.sitter.plusService.map((v, i) => {
                    return <li key={`plusService_${i}`}><i className={iconClasses[v]}></i><span>{v}</span></li>;
                  })}
                </ul>
              </section>
            )
          }
          {
            detail.pets.length > 0 && (
              <section className="pets_info_section">
                <h3>{detail.sitter.sitterName}님과 함께사는 반려견</h3>
                <ul>
                  {detail.pets.map((v, i) => {
                    return (
                      <li key={`pet_${i}`}>
                        <span
                          className="pet_image"
                          style={{ backgroundImage: `url(${v.petImage})` }}
                        ></span>
                        <p className="pet_name">{v.petName}</p>
                        <p className="pet_type">{v.petAge}살 {v.petType}</p>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )
          }
          <section className="review_section" ref={reviewRef}>
            <h3>{detail.sitter.sitterName}님에 대한 후기</h3>
            {
              detail.sitter.reviewCount <= 0 ? (
                <p>{detail.sitter.sitterName}님에 대한 후기가 없습니다.</p>
              ) : (
                <>
                  <div className="summary">
                    <i className="ic-star" style={{fontSize: '24px'}}></i>
                    <strong style={{fontSize: '32px', fontWeight: '500'}}>{detail.sitter.averageStar}</strong>
                    <span>{detail.sitter.reviewCount}개의 후기</span>
                  </div>
                  <Reviews reviewCount={detail.sitter.reviewCount} sitterId={detail.sitter.sitterId}/>
                </>
              )
            }
          </section>
          <section>
            <h3>{detail.sitter.sitterName}님의 위치</h3>
            <MapWrapper>
              <MapContainer
                centerElement={{x: detail.sitter.x, y: detail.sitter.y, sitterName: detail.sitter.sitterName, reviewStar: detail.sitter.averageStar}}
                showOnly={true}
                _height="100%"
              />
            </MapWrapper>
            <p>{detail.sitter.address}</p>
          </section>
        </section>
        <ReservationFunctions>
          <div className="select_area" ref={selectAreaRef}>
            <div className={`select_detail service ${selectBoxToggle.status && selectBoxToggle.type === "service" ? 'isShow' : ''}`}>
                <h3>서비스 선택 <button type="button" className="closeSelectWrap" onClick={()=>setSelectBoxToggle({status: false, type: null})}>닫기</button></h3>
                <div>
                  <ServiceList>
                    {detail.sitter.category.map((v, i) => {
                      return (
                        <li key={`category_${i}`}>
                          <div>
                            <label>
                              <input
                                type="checkbox"
                                checked={services[i]}
                                onChange={(e) => {
                                  setServices((prev) => {
                                    const new_data = [...prev];
                                    new_data[i] = e.target.checked;
                                    return new_data;
                                  });
                                }}
                              />
                              <span>
                                <i className={iconClasses[v]}></i>
                                {v}
                              </span>
                            </label>
                          </div>
                        </li>
                      );
                    })}
                  </ServiceList>
                </div>
              </div>
              <div className={`select_detail date ${selectBoxToggle.status && selectBoxToggle.type === "date" ? 'isShow' : ''}`}>
                <h3>날짜 선택 <button type="button" className="closeSelectWrap" onClick={()=>setSelectBoxToggle({status: false, type: null})}>닫기</button></h3>
                <div>
                  <Calendar
                    className="calendar_onModal"
                    value={date && date}
                    onChange={setDate}
                    multiple={true}
                    format="YYYY/MM/DD"
                    minDate={new Date()}
                    maxDate={new Date(today.year + 1, today.month.number, today.day)}
                    shadow={false}
                    weekDays={weekDays}
                    months={months}
                    onMonthChange={(date) => setMonth(new Date(date).getMonth()+1)}
                  />
                </div>
              </div>
            <ul>
              <li
                onClick={() => {
                  setSelectBoxToggle(()=>{
                    if(selectBoxToggle.type === 'date'){
                      return { type: "service", status: true }
                    }else{
                      return { type: "service", status: !selectBoxToggle.status }
                    }
                  });
                }}
              >
                <span>서비스</span>
                <strong>
                  {servicesText.length > 0
                    ? servicesText.join(", ")
                    : "서비스를 선택해주세요."}
                </strong>
              </li>
              <li
                onClick={() => {
                  setMonth(new Date().getMonth()+1);
                  setSelectBoxToggle(()=>{
                    if(selectBoxToggle.type === 'service'){
                      return { type: "date", status: true }
                    }else{
                      return { type: "date", status: !selectBoxToggle.status }
                    }
                  });
                }}
              >
                <span>날짜</span>
                <strong>
                  {datesTransformed.current?.length > 0
                    ? (
                      <>
                        {
                          datesTransformed.current.map((date,idx)=>{
                            return (
                              idx > 0 ? ', ' + date : date
                            )
                          })
                        }
                      </>
                    )
                    : "날짜를 선택해주세요."}
                </strong>
              </li>
              <li className="price">
                <span>결제예정금액</span>
                <strong><em>{detail.sitter.servicePrice}</em>원/일</strong>
              </li>
            </ul>
          </div>
          <div className="buttons">
            <StyledButton
              _onClick={() => openChatRoom()}
              _bgColor={'rgba(252, 146, 21, 0.1)'}
              color={'#fc9215'}
              _title="문의하기"
              _margin="0"
            />
            <StyledButton
              _onClick={()=>{
                if(!localStorage.getItem('accessToken') || !localStorage.getItem('userName')){
                  // 로그인하지 않았을 경우 로그인 요청하는 Modal 노출
                  setErrorMessage(errorMessages.notLogin);
                  setModalDisplay(true);
                }else{
                  console.log('?')
                  // 등록된 반려견 정보가 있는지 확인
                  if(hasPetInfo.current){
                    console.log('1')
                    requestReservation();
                  }else{
                    console.log('2')
                    setErrorMessage(errorMessages.noPets);
                    setModalDisplay(true);
                  }
                }
              }}
              _title="예약하기"
              _margin="0"
            />
          </div>
        </ReservationFunctions>
      </SitterDetailPage>
      {
        (modalDisplay && errorMessage === errorMessages.notLogin) && (
          <Modal _display={modalDisplay} _alert={false} _confirm={'로그인하기'} _cancel={'취소'} cancelOnclick={()=>{setErrorMessage(null); setModalDisplay(false)}} confirmOnClick={()=>{navigate('/login')}}>
            <div className="text_area">
              <p>{errorMessage}</p>
            </div>
          </Modal>
        )}
        {(modalDisplay && errorMessage === errorMessages.noPets) && (
          <Modal _display={modalDisplay} _alert={false} _confirm={'반려견 프로필 등록하기'} _cancel={'취소'} cancelOnclick={()=>{setErrorMessage(null); setModalDisplay(false)}} confirmOnClick={()=>{navigate('/mypage/petprofile')}}>
            <div className="text_area">
              <p>등록된 반려견 프로필이 없습니다.</p>
              <p>반려견 프로필 등록 후 서비스를 신청해주세요.</p>
            </div>
          </Modal>
        )}
        {(modalDisplay && errorMessage !== errorMessages.notLogin && errorMessage !== errorMessages.noPets ) && (
          <Modal _display={modalDisplay} _alert={true} confirmOnClick={()=>{setErrorMessage(null); setModalDisplay(false); selectAreaRef.current.classList.add('isActive');}}>
            <div className="text_area">
              <p>{errorMessage}</p>
            </div>
          </Modal>
        )
      }
    </>
  );
};


const FloatingTabsSection = styled.section`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  overflow: hidden;
	overflow-x: auto;
	margin: 0 -20px;
	padding: 16px 20px;
  box-sizing: border-box;
  z-index: 2;
  background: linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 65%);
	&{-ms-overflow-style:none; }
	&::-webkit-scrollbar { display:none; }
  &.isFixed{
    position: fixed;
    padding: 16px 20px;
    margin: 0;
    @media (min-width: 768px){
      left: auto;
      right: 10%;
      width: 412px;
    }
  }
	ul{
		display: inline-flex;
		white-space: nowrap;
		gap: 10px;
    li{
      display: inline-block;
      button{
        padding: 0 12px;
        font-size: 14px;
        color: #787878;
        height: 32px;
        line-height: 32px;
        border-radius: 16px;
        box-sizing: border-box;
        border: 1px solid rgba(120, 120, 120, 0.2);
        background-color: #fff;
        &.isActive{
          color: #1A1A1A;
          border: 1px solid #1A1A1A;
          font-weight: 700;
        }
      }
    }
	}
`
const ReservationFunctions = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  background-color: #fff;
  @media (min-width: 768px){
    left: auto;
    right: 10%;
    width: 412px;
  }
  .select_detail {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 100%;
    z-index: 1;
    transform: translateY(100%);
    transition: ease-out 230ms;
    h3 {
      position: relative;
      line-height: 1;
      font-size: 18px;
      padding: 23px 16px 0;
      background-color: #fff;
      border-radius: 10px 10px 0 0;
    }
    .closeSelectWrap{
      position: absolute;
      right: 12px;
      top: 18px;
      width: 24px;
      height: 24px;
      font-size: 0;
      &::before,
      &::after{
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        height: 1px;
        width: 16px;
        margin: 0 auto;
        background-color: #1a1a1a;
        content: '';
      }
      &::before{
        transform: rotate(45deg);
      }
      &::after{
        transform: rotate(-45deg);
      }
    }
    & > div {
      padding: 16px 16px 23px;
      background-color: #fff;
    }
    &::before{
      opacity: 0;
      position: fixed;
      left: 0;
      right: 0;
      top: -100vh;
      height: 0;
      background-color: rgba(0,0,0,.4);
      content: '';
      z-index: -1;
      transition: ease-out opacity 230ms, step-end height 230ms;
    }
    &.isShow{
      transform: translateY(0);
      &::before{
        opacity: 1;
        height: 200vh;
        transition: ease-out opacity 230ms, step-start height;
        pointer-events: none;
      }
    }
    .rmdp-border{
      border: none;
    }
  }
  .select_area{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 100%;
    transform: translateY(100%);
    transition: ease-out 240ms;
    &.isActive{
      transform: translateY(0);
    }
    & > ul {
      position: relative;
      z-index: 2;
      border-top: 1px solid #C9C9C9;
      background-color: #fff;
      & > li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        height: 40px;
        padding: 0 20px;
        cursor: pointer;
        border-bottom: 1px solid #C9C9C9;
        &:last-of-type{
          border: none;
        }
        label {
          display: block;
          width: 100%;
        }
        span {
          color: #676767;
        }
        strong {
          font-size: 14px;
          font-weight: 500;
        }
        &.price{
          cursor: default;
          strong{
            font-weight: normal;
            color: #1A1A1A;
            em{
              color: #FC9215;
              font-weight: 500;
            }
          }
        }
      }
    }
    & + div{
      border-top: 1px solid #C9C9C9;
    }
  }
  .buttons {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px 30px;
    background-color: #fff;
    button {
      flex-basis: 50%;
    }
  }
`;
const SitterDetailPage = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  line-height: 1.4;
  & > section {
    &.page_top{
      section{
        padding-bottom: 48px;
      }
      &:after{
        content: '';
        display: block;
        height: 8px;
        background-color: rgba(245, 245, 245, 1);
        margin: 0 -20px;
      }
    }
    &.page_body{
      position: relative;
      padding: 50px 0 70px;
      .rmdp-border{
        margin-top: 46px;
      }
    }
    & > section{
      h3 {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 20px;
        line-height: 1.2;
        p{
          font-size: 14px;
          font-weight: normal;
          letter-spacing: .03em;
          strong{
            font-size: 18px;
            letter-spacing: normal;
          }
        }
      }
      & + section {
        padding: 70px 0 0;
      }
      &.floatingTabs + section{
        padding: 48px 0 0;
      }
      &.floatingTabs.isFixed + section{
        padding: 70px 0 0;
        margin-top: -22px;
      }
      &.pets_info_section {
        ul {
          display: flex;
          flex-direction: row;
          gap: 16px;
          li {
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
            align-items: center;
            justify-items: center;
            .pet_image {
              display: block;
              width: 60px;
              height: 60px;
              border-radius: 50%;
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat;
            }
            .pet_name{
              line-height: 1;
              margin: 10px 0 5px;
              font-weight: 500;
            }
            .pet_type{
              color: #676767;
              line-height: 1;
            }
          }
        }
      }
      &.review_section{
        line-height: 1;
        .summary{
          display: flex;
          gap: 12px;
          align-items: center;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(120, 120, 120, 0.2);
          i{
            margin-top: -4px;
          }
        }
        ul{
          li{
            padding: 24px 0;
            border-bottom: 1px solid rgba(120, 120, 120, 0.2);
            div{
              font-size: 14px;
              .name{
                display: block;
                font-weight: 500;
                font-size: 16px;
                margin-bottom: 8px;
              }
            }
            p{
              line-height: 1.6;
              color: #676767;
              margin-top: 13px;
            }
          }
        }
        .more_review{
          display: inline-block;
          color: #676767;
          height: 34px;
          line-height: 32px;
          padding: 0 12px;
          border: 1px solid rgba(120, 120, 120, 0.2);
          border-radius: 17px;
        }
      }
    }
    .serviceList{
      li{
        font-weight: 500;
        display: flex;
        align-items: center;
        i{
          font-size: 18px;
          flex-basis: 30px;
          flex-shrink: 0;
          &.ic-pickup{
            font-size: 22px;
          }
          &.ic-activity:before{
            margin-left: 1px;
          }
          &.ic-longterm:before {
            font-size: 20px;
            margin-left: 2px;
          }
        }
        & + li{
          margin-top: 8px;
        }
      }
    }
  }
`;
const TopImage = styled.div`
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 0;
  padding-bottom: 50.4%;
`
const SitterProfile = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: -40px;
  li {
    &.profile span {
      display: inline-block;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      border: 3px solid #fff;
      box-sizing: border-box;
    }
    &.user{
      display: flex;
      align-items: center;
      .userName{
        font-size: 21px;
        font-weight: 500;
      }
      .score{
        font-size: 14px;
        strong{
          font-weight: 500;
        }
        i{
          display: inline-block;
          width: 18px;
          height: 18px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          vertical-align: middle;
          margin: -4px 1px 0 8px;
        }
      }
    }
    &.address{
      color: #676767;
      margin: 10px 0;
      line-height: 1;
      i{
        display: inline-block;
        font-size: 20px;
        vertical-align: middle;
        margin-top: -3px;
        margin-right: 4px;
      }
    }
    .rehire{
      display: inline-block;
      font-size: 12px;
      font-weight: 500;
      background: rgba(252, 146, 21, 0.1);
      border-radius: 3px;
      color: #FC9215;
      padding: 0 6px;
      line-height: 20px;
    }
    &.introduce{
      margin-top: 36px;
      dt{
        line-height: 1.2;
      }
      dd{
        color: #676767;
        line-height: 1.4;
        margin-top: 8px;
      }
    }
  }
`;
const ServiceList = styled.ul`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  margin: 0 -5px;
  li{
    flex-basis: 50%;
    box-sizing: border-box;
    padding: 0 5px;
    label{
      position: relative;
      input{
        position: absolute;
        left: 0;
        top: 0;
        width: 0;
        height: 0;
        &:checked + span{
          border-color: #FC9215;
          color: #FC9215;
        }
      }
      i{
        display: block;
        font-size: 28px;
      }
      span{
        display: block;
        border: 2px solid rgba(120,120,120,.2);
        border-radius: 6px;
        padding: 20px 0;
        text-align: center;
        color: rgba(120,120,120,.7);
      }
    }
    &:nth-of-type(n+3){
      margin-top: 16px;
    }
  }
`
const MapWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 32.7272%;
  border-radius: 10px;
  overflow: hidden;
  & > div{
    position: absolute!important;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  & + p{
    font-size: 14px;
    line-height: 1.2;
    margin-top: 8px;
  }
`

export default Detail;

