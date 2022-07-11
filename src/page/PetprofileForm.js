import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { apis } from "../store/api";
import { handleChange } from "../shared/common";

const INITIAL_VALUES = {
  petName: "",
  petAge: "",
  petWeight: "",
  petType: "",
  petSpay: false,
  petIntro: "",
  petImage: {},
};

const PetprofileForm = () => {
  const location = useLocation();
  const data = location.state;
  const [values, setValues] = useState(data ? data.data : INITIAL_VALUES);
  const [txt, setTxt] = useState(data ? data.data : false);
  const navigate = useNavigate();

  const handleClickRadioButton = (e) => {
    const { name } = e.target;
    setTxt(Boolean(Number(e.target.value)));
    handleChange(name, Boolean(Number(e.target.id)), setValues);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value, setValues);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    handleChange(name, files[0], setValues);
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
      queryClient.invalidateQueries("petprofile");
      navigate("/mypage/petprofile");
    },
    onError: (data) => {
      console.log(data);
    },
  });

  // useMutation 수정하는 세팅 함수
  const { mutate: update } = useMutation(apis.petprofilePatch, {
    onSuccess: (data) => {
      queryClient.setQueryData(["petprofile", values.petId], data);
      queryClient.invalidateQueries("petprofile");
      navigate("/mypage/petprofile");
    },
    onError: (data) => {
      console.log(data);
    },
  });

  // 등록 및 수정하는 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("petName", values.petName);
    formData.append("petAge", values.petAge);
    formData.append("petWeight", values.petWeight);
    formData.append("petType", values.petType);
    formData.append("petSpay", values.petSpay);
    formData.append("petIntro", values.petIntro);
    formData.append("petImage", values.petImage);
    const fields = {
      id: values.petId,
      data: formData,
    };
    data ? update(fields) : create(formData);
  };

  return (
    <PetprofileInner>
      <h1>반려동물 프로필</h1>
      {!isSuccess ? (
        <Form onSubmit={handleSubmit}>
          <p className="tit">반려동물 사진</p>
          <input
            type="file"
            accept="image/png, image/jpeg"
            name="petImage"
            onChange={handleFileChange}
          />
          <p className="tit">이름</p>
          <input
            type="text"
            name="petName"
            onChange={handleInputChange}
            defaultValue={data && values.petName}
          />
          <p className="tit">나이</p>
          <input
            type="text"
            name="petAge"
            onChange={handleInputChange}
            defaultValue={data && values.petAge}
          />
          <p className="tit">몸무게</p>
          <input
            type="text"
            name="petWeight"
            onChange={handleInputChange}
            defaultValue={data && values.petWeight}
          />
          <p className="tit">중성화</p>
          <div>
            <input
              id="1"
              type="radio"
              value={1}
              name="petSpay"
              defaultChecked={data ? values.petSpay : values.petSpay && true}
              onChange={handleClickRadioButton}
            />
            <label htmlFor="1">했어요</label>

            <input
              id="0"
              type="radio"
              value={0}
              name="petSpay"
              defaultChecked={data ? !values.petSpay : !values.petSpay && true}
              onChange={handleClickRadioButton}
            />
            <label htmlFor="0">안했어요</label>
          </div>
          <div>
            <label htmlFor="kind" className="tit">
              품종
            </label>
            <input
              type="text"
              id="kind"
              name="petType"
              onChange={handleInputChange}
              defaultValue={data && values.petType}
            />
          </div>
          <div>
            <label htmlFor="intro" className="tit">
              반려동물 소개글(성격 취미 등)
            </label>
            <textarea
              type="text"
              id="intro"
              name="petIntro"
              onChange={handleInputChange}
              defaultValue={data && values.petIntro}
            ></textarea>
          </div>

          <button>전송</button>
        </Form>
      ) : (
        <Link to={{ pathname: `/petprofileform` }}>
          <p>반려동물을 등록하세요</p>
        </Link>
      )}
    </PetprofileInner>
  );
};

const PetprofileInner = styled.div``;
const Form = styled.form`
  input,
  textarea {
    border: 1px solid #000;
  }
`;
export default PetprofileForm;
