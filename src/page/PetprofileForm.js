import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { apis } from '../store/api';
import { handleChange } from '../shared/common';
import StyledContainer from '../elements/StyledContainer';
import NavBox from '../elements/NavBox';
import InputBox from '../elements/InputBox';
import StyledButton from '../elements/StyledButton';

const INITIAL_VALUES = {
  petName: '',
  petAge: '',
  petWeight: '',
  petType: '',
  petSpay: false,
  petIntro: '',
  petImage: {},
};

const PetprofileForm = () => {
  const location = useLocation();
  const data = location.state;
  const [values, setValues] = useState(data ? data.data : INITIAL_VALUES);
  const [txt, setTxt] = useState(data ? data.data : false);
  const [imageSrc, setImageSrc] = useState('');
  const navigate = useNavigate();
  const photoInput = useRef();

  const handleClickRadioButton = (e) => {
    const { name } = e.target;
    setTxt(Boolean(Number(e.target.value)));
    handleChange(name, Boolean(Number(e.target.id)), setValues);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value, setValues);
  };

  // const handleFileChange = (e) => {
  //   const { name, files } = e.target;
  //   handleChange(name, files[0], setValues);
  // };

  const handleClickUpload = () => {
    photoInput.current.click();
  };

  // 이미지 미리보기 보여주는 함수
  const encodeFileToBase64 = (fileBlob) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);

    handleChange('petImage', fileBlob, setValues);

    return new Promise(async (resolve) => {
      reader.onload = () => {
        setImageSrc(reader.result);
        resolve();
      };
    });
  };

  const queryClient = useQueryClient();

  // useMutation 생성하는 세팅 함수
  const {
    mutate: create,
    error,
    isSuccess,
  } = useMutation(apis.petprofilePost, {
    onSuccess: () => {
      //무효화 시킴
      queryClient.invalidateQueries('petprofile');
      // navigate("/mypage/petprofile");
    },
    onError: (data) => {
      console.log(data);
    },
  });

  // useMutation 수정하는 세팅 함수
  const { mutate: update } = useMutation(apis.petprofilePatch, {
    onSuccess: (data) => {
      queryClient.setQueryData(['petprofile', values.petId], data);
      queryClient.invalidateQueries('petprofile');
      navigate('/mypage/petprofile');
    },
    onError: (data) => {
      console.log(data);
    },
  });

  // 등록 및 수정하는 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('petName', values.petName);
    formData.append('petAge', values.petAge);
    formData.append('petWeight', values.petWeight);
    formData.append('petType', values.petType);
    formData.append('petSpay', values.petSpay);
    formData.append('petIntro', values.petIntro);
    formData.append('petImage', values.petImage);

    const fields = {
      id: values.petId,
      data: formData,
    };
    data ? update(fields) : create(formData);
  };

  return (
    <StyledContainer>
      <NavBox _title='반려동물 프로필' />
      {!isSuccess ? (
        <Form onSubmit={handleSubmit}>
          <ImageBox onClick={handleClickUpload}>
            <PreviewImage
              src={imageSrc || '/images/placeholder_150.png'}
              width='90'
              alt='petPhoto'
            />
            <input
              type='file'
              id='petImage'
              name='petImage'
              ref={photoInput}
              accept='image/png, image/jpeg'
              style={{ display: 'none', paddingTop: '8px' }}
              onChange={(e) => {
                encodeFileToBase64(e.target.files[0]);
              }}
            />
            <i className="ic-camera"></i>
          </ImageBox>
          {/* <input
            type='file'
            accept='image/png, image/jpeg'
            name='petImage'
            onChange={handleFileChange}
          /> */}
          <InputBox>
            <label className='tit'>이름</label>
            <input
              type='text'
              name='petName'
              placeholder='이름을 적어주세요.'
              onChange={handleInputChange}
              defaultValue={data && values.petName}
            />
          </InputBox>
          <InputBox>
            <label className='tit'>나이</label>
            <input
              type='text'
              name='petAge'
              placeholder='나이를 적어주세요.'
              onChange={handleInputChange}
              defaultValue={data && values.petAge}
            />
          </InputBox>
          <InputBox outlined>
            <label className='tit'>몸무게</label>
            <input
              type='text'
              name='petWeight'
              placeholder='몸무게를 적어주세요.'
              onChange={handleInputChange}
              defaultValue={data && values.petWeight}
            />
          </InputBox>
          <RadioBox>
            <label className='tit'>중성화</label>
            <RadioGroup>
              <label htmlFor='1'>
                <input
                  id='1'
                  type='radio'
                  value={1}
                  name='petSpay'
                  defaultChecked={
                    data ? values.petSpay : values.petSpay && true
                  }
                  onChange={handleClickRadioButton}
                />
                수술 했음
              </label>
              <label htmlFor='0'>
                <input
                  id='0'
                  type='radio'
                  value={0}
                  name='petSpay'
                  defaultChecked={
                    data ? !values.petSpay : !values.petSpay && true
                  }
                  onChange={handleClickRadioButton}
                />
                수술 하지 않음
              </label>
            </RadioGroup>
          </RadioBox>

          <InputBox>
            <label htmlFor='kind' className='tit'>
              품종
            </label>
            <input
              type='text'
              id='kind'
              name='petType'
              placeholder='품종을 적어주세요.'
              onChange={handleInputChange}
              defaultValue={data && values.petType}
            />
          </InputBox>
          <InputBox>
            <label htmlFor='intro' className='tit'>
              반려동물 소개글
            </label>
            <textarea
              type='text'
              id='intro'
              name='petIntro'
              onChange={handleInputChange}
              placeholder='성격 취미 등을 적어주세요.'
              defaultValue={data && values.petIntro}
            ></textarea>
          </InputBox>
          <StyledButton _title='등록하기' />
        </Form>
      ) : (
        <PetProfileInsertBox>
          <h3>등록한 반려동물이 없어요</h3>
          <p>반려동물 프로필을 등록해보세요</p>
          <PetProfileInsertButton
            onClick={() => {
              navigate('/petprofileform');
            }}
          >
            반려동물 등록하기
          </PetProfileInsertButton>
        </PetProfileInsertBox>
      )}
    </StyledContainer>
  );
};

const Form = styled.form`
  input[type='text'] {
    width: 100%;
    min-height: 48px;
    background: #ffffff;
    border: 1px solid rgba(120, 120, 120, 0.4);
    border-radius: 6px;
    padding: 12px;
  }

  textarea {
    width: 100%;
    min-height: 140px;
    background: #ffffff;
    border: 1px solid rgba(120, 120, 120, 0.4);
    border-radius: 6px;
    padding: 15px 13px;
    ::placeholder {
      font-size: 16px;
      line-height: 19px;
      color: rgba(120, 120, 120, 0.7);
    }
  }
`;

const ImageBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const PreviewImage = styled.img`
  border-radius: 50%;
  cursor: pointer;
`;

const RadioBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 24px;
`;

const RadioGroup = styled.div`
  margin-top: 10px;
  label {
    margin: 0;
    padding-right: 10px;
  }

  input[type='radio'] {
    width: auto;
    appearance: none;
    outline: 0;
    box-shadow: none;
    border: none;
    padding: 0 10px 0 0;
    margin: 0;
  }

  input[type='radio']:before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 24px;
    margin-left: 3px;
    border: 1px solid #8b8b8b;
    border-radius: 100%;
    vertical-align: middle;
    cursor: pointer;
  }

  input[type='radio']:checked:before {
    content: '';
    width: 16px;
    height: 16px;
    background-color: #ffffff;
    border: 5px solid #fc9215;
  }
`;

const PetProfileInsertBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 180px;
  h3 {
    font-weight: 700;
    font-size: 18px;
    line-height: 22px;
    padding-bottom: 16px;
  }

  p {
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #676767;
    padding-bottom: 24px;
  }
`;

const PetProfileInsertButton = styled.button`
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  padding: 12px 20px;
  background: #ffffff;
  border: 1px solid #fc9215;
  border-radius: 54px;
  color: #fc9215;
`;

export default PetprofileForm;
