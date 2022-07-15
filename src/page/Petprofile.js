import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { apis } from "../store/api";

const Petprofile = () => {
  const queryClient = useQueryClient();
  const {isLoading, data: petprofileData, isSuccess: petSuccessGet} = useQuery("petprofile", apis.petprofileGet);
  const [values, setValues] = useState(petprofileData.data.petprofile);

  const { mutate: delect, error, isSuccess: petSuccessDelete,} = useMutation(apis.petprofileDelete, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("petprofile");
    },
  });

  useEffect(() => {
    (petSuccessGet || petSuccessDelete) &&
      setValues(petprofileData.data.petprofile);
  }, [petSuccessGet, petSuccessDelete, petprofileData.data.petprofile]);

  return (
    <PetprofileInner>
      <h1>반려동물 프로필</h1>
      {values.length > 0 ? (
        values.map((el, idx) => {
          const { petId, petName, petType, petImage } = el;
          return (
            <div key={petId} className="petprofileItem">
              <div>
                <span
                  className="bgImg"
                  style={{ backgroundImage: `url(${petImage})` }}
                ></span>
                <span>
                  {petName}
                  <span>{petType}</span>
                </span>
              </div>
              <div>
                <Link
                  to={`/mypage/${petId}/petprofileform`}
                  state={{ data: el }}
                >
                  수정
                </Link>
                <button
                  onClick={() => {
                    delect(petId);
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <Link to={{ pathname: `/mypage/petprofileform` }}>
          <button>반려동물을 등록하세요</button>
        </Link>
      )}
    </PetprofileInner>
  );
};

const PetprofileInner = styled.div`
  .petprofileItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    .bgImg {
      width: 100px;
      height: 100px;
      display: inline-block;
      background-position: center;
      background-size: cover;
      vertical-align: middle;
    }
  }
`;
export default Petprofile;
