import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import styled from "styled-components";
import Button from "../elements/Button";
import Input from "../elements/Input";
import { apis } from "../store/api";


const IdFind = () => {
  const mobileRef = useRef();
  const [findId, setFindId] = useState(false);
  const [numberState, setNumberState] = useState();
  const [foundId, setFoundId] = useState();
  
  const checkId = (data) => {
    console.log(data)
    return apis.idFind(data);
  }

  const {data: find_id_query, isLoading:findIdLoading,  isSuccess: idFound} = useQuery(["find_id", numberState], () => checkId({phoneNumber: numberState}), {
    onSuccess: (data) => {
      console.log('success', data)
    },
		onError: (data) => {
			console.log(data, 'error');
      window.alert(data.response.data.errorMessage)
		},
    enabled: !!findId,
    staleTime: Infinity,
  })
  useEffect(()=>{
    setFoundId(find_id_query?.data.user.userEmail)
  },[idFound])
  
  if(findIdLoading) return null;
  

  return (
		<DivBox>
			<h1>아이디 찾기</h1>
			<label className="inner required">
				<p className="tit">핸드폰번호</p>
				<Input _width="100%" _height="44px" _placeholder="'-'없이 입력해주세요" _type="text" _name={"mobileNumber"} _ref={mobileRef} onChange={(e)=>setNumberState(e.target.value)} required />
				{/* { values.userEmail && <Message className={`${isId ? "success" : "error"}`}>{idMessage}</Message>} */}
			</label>
			<Button type="button" _width="130px" onClick={()=>setFindId(true)}>아이디(이메일) 찾기</Button>
		</DivBox>
	);
}

const DivBox = styled.div`
	h1 {
		font-size: 34px;
		font-weight: 600;
	}
	.inner {
		&.required {
			.tit {
				font-size: 22px;
				display: inline-block;
				position: relative;
				::after {
					content: '';
					display: inline-block;
					width: 6px;
					height: 6px;
					border-radius: 50%;
					background-color: rgb(255, 107, 107);
					position: absolute;
					top: 0px;
					right: -12px;
				}
			}
		}
	}
`

const Message = styled.p`
  font-size: 13px;
  align-self: flex-start;
  padding: 5px 0;
  color: ${(props) => (props.className === "success" ? "green" : "red")}
`

export default IdFind;