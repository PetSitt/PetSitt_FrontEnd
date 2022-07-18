import React, {useState, useRef, useEffect} from 'react';
import styled from 'styled-components';
import StyledButton from '../elements/StyledButton';

const CareDiary = ({mode, setDiaryData, diaryData, diaryStatus}) => {
  const diaryPageRef = useRef();
  const [checkList, setCheckList] = useState(0);
  const [inputValues, setInputValues] = useState([]);
  const [checked, setChecked] = useState([]);
  const [images, setImages] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);
  const [files, setFiles] = useState([]);
  const [text, setText] = useState(null);
  const [datas, setDatas] = useState({checkList, inputValues, checked, images, imageUrls, files, text});
  useEffect(()=>{
    setDatas(()=>{
      return {checkList, inputValues, checked, images, imageUrls, files, text};
    })
  },[checkList, inputValues, checked, images, imageUrls, files, text]);
  const [dataForModify, setDataForModify] = useState();

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
    }
    if(diaryStatus === 'clear'){
      setCheckList(0);
      setInputValues([]);
      setChecked([]);
      setImages(0);
      setImageUrls([]);
      setFiles([]);
      setText(null);
    }
  },[diaryStatus]);
  


  // console.log(inputValues,checkList,checked,files);
  console.log(mode, datas)
  return (
    <CareDiaryPage ref={diaryPageRef}>
      <section>
        <h3>{mode === 'write' ? '돌봄 일지 작성' : '돌봄 일지'}</h3>
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
                    />
                    <span></span>
                  </label>
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
                </CheckList>
              )
            })
          }
          </ul>
          <StyledButton _title={'체크리스트 추가하기'} color={'#FC9215'} _bgColor={'transparent'} _border={'1px solid #FC9215'}
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
        </div>
        <div className="imageArea">
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
                        if (e.target.files[0]) {
                          if(mode === 'write'){
                            console.log('write mode~~~')
                            setFiles((prev)=>{
                              const _prev = [...prev];
                              _prev[i] = thisFile;
                              return _prev;
                            })
                            return;
                          }else{
                            console.log('view mode~~~')
                            setDatas((prev)=>{
                              let _new = prev.deleteImage ? {...prev} : {...datas};
                              _new.files.push(e.target.files[0]);
                              return _new;
                            });
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
                                const _prev = [...prev];
                                _prev[i] = event.target.result;
                                return _prev;
                              }else{
                                return [...prev, event.target.result];
                              }
                            })
                          };
                          reader.readAsDataURL(e.target.files[0]);
                          setImages((prev)=>{
                            if(prev < 6) return prev+1;
                          })
                        }
                      }}/>
                      <span style={{backgroundImage: `url(${imageUrls[i]&&imageUrls[i]})`}}>{imageUrls[i] && <button type="button" className="removeImageButton"
                        onClick={()=>{
                          console.log('cliocked', imageUrls[i].split(':')[0])
                          setDatas((prev)=>{
                            let _new = prev.addImage || prev.deleteImage ? {...prev} : {...datas};
                            if(_new.deleteImage){
                              _new.deleteImage.push(imageUrls[i]);
                            }else{
                              _new.deleteImage = [imageUrls[i]];
                            }
                            return _new;
                          });
                        }}
                      >삭제</button>}</span>
                    </label>
                  </FileItem>
                )
              })
            }
          </ul>
        </div>
        <div className="inputArea">
          <textarea placeholder='돌봄 일지를 작성해주세요.' onInput={(e)=>setText(e.target.value)} defaultValue={text&&text}></textarea>
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
    height: 200px;
    border: 1px solid #ddd;
    margin: 20px 0;
    textarea{
      display: block;
      width: 100%;
      height: 100%;
      padding: 10px;
      resize: none;

    }
  }
  .removeImageButton{
    position: absolute;
    right: 0;
    top: -20px;
    background: #fff;
    padding: 0 3px;
    line-height: 14px;
    font-size: 11px;
  }
`
const FileItem = styled.li`
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
        &::before,
        &::after{
          position: absolute;
          left: 0;
          right: 0;
          width: 10px;
          height: 1px;
          background-color: #999;
          content: '';
          margin: 0 auto;
          top: 50%;
        }
        &::after{
          transform: rotate(90deg);
        }
      }
    }

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
        width: 24px;
        height: 24px;
        border: 1px solid #ccc;
      }
      &:checked + span{
        border-color: #fc9215;
        background-color: #fc9215;
      }
    }
  }
  & > input{
    width: 100%;
    font-size: 14px;
    height: auto;
    padding: 0;
    line-height: 24px;
  }
  & > p{
    flex-basis: 100%;
    text-align: left;
    line-height: 1.3;
  }
`
export default CareDiary;