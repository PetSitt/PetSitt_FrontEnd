import { useMutation } from "react-query";
import styled from "styled-components";
import { apis } from "../store/api";

const PwChange = () => {
	// useMutation 세팅 함수
	const {mutate} = useMutation(apis.passwordFind, {
    onSuccess: (data) => {
			console.log(data)
    },
		onError: (data) => {
			console.log(data)
		}
  });

	// 전송하는 함수
	const handleSubmit = (e) => {
		e.preventDefault();
  };

	return (
		<Form onSubmit={handleSubmit}>
			<h1>비밀번호 변경</h1>
			
		</Form>
	);
}

const Form = styled.form`
	
`



export default PwChange;