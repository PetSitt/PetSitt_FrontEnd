import { useEffect, useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Modal from "../elements/Modal";
import NavBox from "../elements/NavBox";
import StyledContainer from "../elements/StyledContainer";
import { apis } from "../store/api";

const Petprofile = () => {
  const id = useRef();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [petId ,setPetId] = useState(false);
  const queryClient = useQueryClient();
  const {
    isLoading,
    data: petprofileData,
    isSuccess: petSuccessGet,
  } = useQuery("petprofile", apis.petprofileGet, {
    staleTime: Infinity,
  });
  const [values, setValues] = useState(petprofileData.data.petprofile);

  const {
    mutate: delect,
    error,
    isSuccess: petSuccessDelete,
  } = useMutation((petId) => apis.petprofileDelete(petId), {
    onSuccess: (data) => {
      console.log("onSuccess:",data)
      queryClient.invalidateQueries("petprofile");
    },
    onError: (data) => {
      console.log("onError:",data)
    }
  });

  useEffect(() => {
    (petSuccessGet || petSuccessDelete) &&
      setValues(petprofileData.data.petprofile);
  }, [petSuccessGet, petSuccessDelete, petprofileData.data.petprofile]);

  return (
    <>
      <StyledContainer>
        <NavBox _title="반려동물 프로필" />
        {values.length > 0 ? (
          values.map((el, idx) => {
            const { petId, petName, petType, petImage } = el;
            console.log(petId, petName, idx)
            return (
              <PetList key={petId}>
                <PetInfo>
                  <div
                    className="bgImg"
                    style={{ backgroundImage: `url(${petImage})` }}
                  ></div>
                  <div>
                    <p className="petName">{petName} {petId}</p>
                    <p className="petType">{petType}</p>
                  </div>
                </PetInfo>
                <EditButton>
                  <button
                    onClick={() => {
                      navigate(`/mypage/${petId}/petprofileform`, {
                        state: { data: el },
                      });
                    }}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(true);
                      id.current = petId
                    }}
                  >
                    삭제
                  </button>
                </EditButton>
              </PetList>
            );
          })
        ) : (
          <PetProfileInsertBox>
            <h3>등록한 반려동물이 없어요</h3>
            <p>반려동물 프로필을 등록해보세요</p>
            <PetProfileInsertButton
              onClick={() => {
                navigate("/mypage/petprofileform");
              }}
            >
              반려동물 등록하기
            </PetProfileInsertButton>
          </PetProfileInsertBox>
        )}
        {values.length >= 1 && values.length < 3 ? (
          <PetAddBox>
            <PetProfileInsertButton
              onClick={() => {
                navigate("/mypage/petprofileform");
              }}
            >
              반려동물 추가하기
            </PetProfileInsertButton>
          </PetAddBox>
        ) : null}
      </StyledContainer>
    {
      <Modal
      _display={showModal}
      _confirm="삭제"
      _cancel="취소"
      _alert
      confirmOnClick={() => {
        delect(id.current);
        setShowModal(false);
      }}
      cancelOnclick={() => {
        setShowModal(false);
        id.current = "";
      }}
    >
      <ModalText>
          <h2>반려동물 프로필 삭제</h2>
          <p>
            해당 반려동물의
            <br /> 프로필을 삭제하시겠습니까?
          </p>
        </ModalText>
      </Modal>
    }
    </>
  );
};

const PetList = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ModalText = styled.div`
  h2 {
    font-weight: 700;
    font-size: 18px;
    line-height: 22px;
    margin-bottom: 24px;
  }
  p {
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;
  }
`;

const PetAddBox = styled.div`
  margin: 48px auto;
`;

const PetInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  .bgImg {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: inline-block;
    background-position: center;
    background-size: cover;
    vertical-align: middle;
    margin-right: 16px;
  }
  .petName {
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
  }
  .petType {
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #676767;
  }
`;

const EditButton = styled.div`
  button {
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: rgba(120, 120, 120, 0.7);
    &:first-child {
      padding-right: 12px;
    }
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
export default Petprofile;
