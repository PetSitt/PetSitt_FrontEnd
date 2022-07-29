import React, {useState, useRef, useEffect} from 'react';
import styled from 'styled-components';
import StyledButton from '../elements/StyledButton';

const CareDiary = ({mode, setDiaryData, diaryData, diaryStatus, modifyData}) => {
  const diaryPageRef = useRef();
  const [checkList, setCheckList] = useState(0);
  const [inputValues, setInputValues] = useState([]);
  const [checked, setChecked] = useState([]);
  const [images, setImages] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);
  const [files, setFiles] = useState([]);
  const [text, setText] = useState(null);
  const [datas, setDatas] = useState({checkList, inputValues, checked, images, imageUrls, files, text});
  const [dataForModify, setDataForModify] = useState({addImage: [], deleteImage: []});
  useEffect(()=>{
    setDatas(()=>{
      return {checkList, inputValues, checked, images, imageUrls, files, text};
    })
  },[checkList, inputValues, checked, images, imageUrls, files, text, dataForModify]);

  console.log(imageUrls)

  useEffect(()=>{
    setDiaryData(datas);
  },[datas]); // state 하나 바뀔때마다 refresh 되니까 비효율적인 것 같은데...

  useEffect(()=>{
    if(diaryStatus === 'get') {
      setCheckList(diaryData.checkList);
      setInputValues(diaryData.inputValues);
      setChecked(diaryData.checked);
      setImages(diaryData.images);
      setImageUrls(diaryData.imageUrls);
      setFiles(diaryData.files);
      setText(diaryData.text);
      if(mode.current === 'view'){ // 수정모드일 경우
        setDataForModify(modifyData.current);
      }
    }
    if(diaryStatus === 'clear'){
      setCheckList(0);
      setInputValues([]);
      setChecked([]);
      setImages(0);
      setImageUrls([]);
      setFiles([]);
      setText(null);
      if(mode.current === 'view'){ // 수정모드일 경우
        setDataForModify({addImage: [], deleteImage: []});
      }
    }
    if(diaryStatus === 'save'){ // 수정모드일 때 데이터 저장
      modifyData.current = dataForModify;
    }
  },[diaryStatus]);

  return (
    <CareDiaryPage ref={diaryPageRef}>
      <section>
        <h3>{mode.current === 'write' ? '돌봄 일지 작성' : '돌봄 일지'}</h3>
        <div className="checklistArea">
          <ul>
          {
            Array.from({length: checkList}, (v,i)=>{
              return(
                <CheckList key={`checklist_${i}`}>
                  <label>
                    <input type="checkbox" checked={checked[i]} onChange={(e)=>{
                      setChecked((prev)=>{
                        const _prev = [...prev];
                        if(e.target.checked){
                          _prev[i] = true;
                        }else{
                          _prev[i] = false;
                        }
                        return _prev;
                      })
                    }}
                    disabled={mode.current === 'readonly'}
                    />
                    <span><i className='ic-check'></i></span>
                  </label>
                  {
                    mode.current === 'readonly' ? (
                      <p>{inputValues[i]}</p>
                    ) : (
                      <>
                        <input placeholder="체크리스트를 작성해주세요." type="text" 
                          defaultValue={inputValues[i]&&inputValues[i]}
                          onChange={(e)=>{
                            if(e.target.value.trim().length > 0){
                              setInputValues((prev)=>{
                                const _prev = [...prev];
                                _prev[i] = e.target.value;
                                return _prev;
                              })
                            }
                          }}
                          onBlur={(e)=>{
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'block';
                            if(e.target.value.trim().length <= 0){
                              setInputValues((prev)=>{
                                if(prev.length > 0){
                                  return [...prev].filter((text,idx)=>idx !== i);
                                }else{
                                  return [...prev];
                                }
                              });
                              setCheckList((prev)=>{
                                return prev - 1;
                              })
                              setChecked((prev)=>{
                                return [...prev].filter((check, idx)=>idx!==i);
                              })
                            }
                          }}
                          />
                          <p style={{display: 'none'}}
                          onClick={(e)=>{
                            e.target.style.display = 'none';
                            e.target.previousElementSibling.style.display = 'block';
                            e.target.previousElementSibling.focus();
                            if(inputValues.length < checkList){
                              setCheckList(inputValues.length);
                              setChecked((prev)=>{
                                const _prev = [...prev];
                                const new_checked = [];
                                for(let i=0; i<_prev.length; i++){
                                  for(let j=0; j<inputValues.length; j++){
                                    if(i === j) new_checked.push(_prev[i]);
                                  }
                                }
                                return new_checked;
                              })
                            }
                          }}
                          >{inputValues[i] && inputValues[i]}</p>
                      </>
                    )
                  }
                  
                </CheckList>
              )
            })
          }
          </ul>
          {
            mode.current !== 'readonly' && (
              <StyledButton _title={'체크리스트 추가하기'} color={'#FC9215'} _bgColor={'transparent'} _border={'1px solid #FC9215'} _margin={'20px 0 0'}
                _onClick={()=>{
                  if(inputValues.length < checkList){
                    setCheckList(inputValues.length);
                  }else{
                    setChecked((prev)=>{
                      return [...prev, false];
                    });
                  }
                  setCheckList((prev)=>{
                    return prev + 1;
                  })
                }}
              />
            )
          }
        </div>
        <div className="imageArea" style={{margin: '16px 0 24px'}}>
          {
            mode.current === 'readonly' ? (
              <ul style={{display: 'flex', margin: '-3px'}}>
                {
                Array.from({length: imageUrls.length}, (v,i)=>{
                  return(
                    <FileItem key={`image_${i}`}>
                      <label>
                        <input/>
                        <span style={{backgroundImage: `url(${imageUrls[i]&&imageUrls[i]})`}}></span>
                      </label>
                    </FileItem>
                  )
                })
              }
              </ul>
            ) : (
              <ul style={{display: 'flex', margin: '-3px'}}>
              {
                Array.from({length: images < 6 ? images+1 : 6}, (v,i)=>{
                  return(
                    <FileItem key={`image_${i}`}>
                      <label>
                        <input type="file" onChange={(e) => {
                          e.preventDefault();
                          const thisInput = e.target;
                          const thisFile = e.target.files[0];
                          console.log('onchange',e.target.files[0])
                          if (e.target.files[0]) {
                            console.log('업로드 성공',e.target.files[0])
                            if(mode.current === 'write'){
                              // 일지 처음 등록할 때
                              setFiles((prev)=>{
                                const _prev = [...prev];
                                _prev[i] = thisFile;
                                return _prev;
                              })
                            }else{
                              // 일지 수정할 때
                              setDataForModify((prev)=>{
                                const _new = {...prev};
                                _new.addImage.push(thisFile);
                                return _new;
                              })
                            }
                            const reader = new FileReader();
                            reader.onload = function (event) {
                              thisInput.nextElementSibling.setAttribute(
                                "style",
                                `background-image: url(${event.target.result})`
                              );
                              thisInput.nextElementSibling.setAttribute("class", "hasImage");
                              setImageUrls((prev)=>{
                                if(prev[i]){
                                  console.log('있음', prev, i)
                                  const _prev = [...prev];
                                  _prev[i] = event.target.result;
                                  return _prev;
                                }else{
                                  console.log('없음', prev, i)

                                  return [...prev, event.target.result];
                                }
                              })
                            };
                            reader.readAsDataURL(e.target.files[0]);
                            setImages((prev)=>{
                              if(prev < 6) return prev+1;
                            })
                          }
                        }} disabled={mode.current === 'readonly'}/>
                      <span style={{backgroundImage: `url(${imageUrls[i]&&imageUrls[i]})`}}>{imageUrls[i] && <button type="button" className="removeImageButton"
                          onClick={(e)=>{
                            e.preventDefault();
                            if(mode === 'write'){
                              // 작성 모드일 경우
                              // 미리보기 이미지 배열에서 해당 주소 삭제
                              setImageUrls((prev)=>{
                                const _new = [...prev].filter((image,idx)=>i !== idx);
                                return _new;
                              });
                              setFiles((prev)=>{
                                const _new = [...prev].filter((file,idx)=>i !== idx);
                                return _new;
                              });
                            }else{
                              // 수정 모드일 경우
                              // 미리보기 이미지 배열에서 해당 주소 삭제
                              setImageUrls((prev)=>{ 
                                const _new = [...prev].filter((image,idx)=>i !== idx);
                                return _new;
                              });
                              if(imageUrls[i].split(':')[0] === 'https'){
                                setDataForModify((prev)=>{
                                  const _new = {...prev};
                                  _new.deleteImage.push(imageUrls[i]);
                                  return _new;
                                })
                              }else{
                                let index = 0;
                                let addFileIndex = i;
                                while(index < i){
                                  // 기존에 등록한 이미지 말고 file로 새로 등록한 이미지 파일 중에서 삭제할 파일 index 찾기
                                  if(imageUrls[index].split(':')[0] === 'https'){
                                    addFileIndex--;
                                  }
                                  index ++;
                                };
                                setDataForModify((prev)=>{
                                  const _new_addImage = [...prev.addImage].filter((file,fileIndex)=>{
                                    return fileIndex !== addFileIndex;
                                  });
                                  const _new = {...prev, addImage: _new_addImage};
                                  return _new;
                                });
                              }
                              e.target.parentNode.previousElementSibling.value = null;
                              e.target.parentNode.classList.remove('hasImage');
                            }
                            setImages((prev)=>prev-1);
                          }}
                        >삭제</button>}</span>
                      </label>
                    </FileItem>
                  )
                })
              }
            </ul>
            )
          }
          
        </div>
        <div className="inputArea">
          <textarea placeholder={mode === 'readonly' ? '등록된 돌봄일지 내용이 없습니다.' : '돌봄 일지를 작성해주세요.'} onInput={(e)=>setText(e.target.value)} defaultValue={text&&text} disabled={mode.current === 'readonly'}></textarea>
        </div>
      </section>
    </CareDiaryPage>
  )
}

const CareDiaryPage = styled.div`
  h3{
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    text-align: center;
  }
  .socreArea{
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: center;
  }
  .inputArea{
    height: 140px;
    border: 1px solid #ddd;
    margin: 16px 0 0;
    border-radius: 6px;
    overflow: hidden;
    textarea{
      display: block;
      width: 100%;
      height: 100%;
      padding: 12px 16px;
      resize: none;
      font-size: 16px;
      &::placeholder{
        color:rgba(120,120,120,.7);
      }
    }
  }
  .removeImageButton{
    position: absolute;
    right: -5px;
    top: -5px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: #000;
    &::before,
    &::after{
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      width: 10px;
      height: 1px;
      background-color: #fff;
      content: '';
      transform: rotate(-45deg);
      margin: 0 auto;
    }
    &::after{
      transform: rotate(45deg);
    }
  }
`
const FileItem = styled.li`
  position: relative;
  flex-basis: 16.6666%;
  flex-shrink: 0;
  flex-grow: 0;
  padding: 3px;
  box-sizing: border-box;
  label{
    position: relative;
    input{
      position: absolute;
      left: 0;
      top: 0;
      width: 0;
      height: 0;
      margin: 0;
      & + span{
        position: relative;
        display: block;
        height: 0;
        padding-bottom: 100%;
        background-size: cover;
        background-repeat: no-repeat;
        background-color: #eee;
        background-position: center;
        border-radius: 6px;
      }
    }
    & > span{
      position: relative;
      display: block;
      height: 0;
      padding-bottom: 100%;
      background-size: cover;
      background-repeat: no-repeat;
      background-color: #eee;
      background-position: center;
      border: 1px solid #e9e9e9;
    }
  }
  &:last-of-type span::before,
  &:last-of-type span::after{
    position: absolute;
    left: 0;
    right: 0;
    width: 10px;
    height: 1px;
    background-color: #999;
    content: '';
    margin: 0 auto;
    top: 50%;
    z-index: 1;
  }
  &:last-of-type span::after{
    transform: rotate(90deg);
  }
  &:last-of-type span.hasImage::before,
  &:last-of-type span.hasImage::after{
    display: none;
  }
`
const CheckList = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 5px;
  & + li{
    margin-top: 10px;
  }
  label{
    position: relative;
    flex-shrink: 0;
    input{
      position: absolute;
      left: 0;
      top: 0;
      width: 0;
      height: 0;
      & + span{
        display: block;
        width: 20px;
        height: 20px;
        border: 1px solid rgba(120,120,120,.7);
        border-radius: 3px;
        i{
          display: inline-block;
          line-height: 19px;
          color: rgba(120,120,120,.2);
        }
      }
      &:checked + span{
        border-color: #fc9215;
        background-color: #fc9215;
        i{
          color: #fff;
        }
      }
    }
  }
  & > input{
    width: 100%;
    font-size: 16px;
    height: auto;
    padding: 0;
    line-height: 1.3;
  }
  & > p{
    font-size: 16px!important;
    flex-basis: 100%;
    text-align: left;
    line-height: 1.3;
  }
`
export default CareDiary;