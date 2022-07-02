import React from 'react';
import { useParams, Link } from "react-router-dom";

const Mypage = () => {
	const id = useParams().id;
	return (
		<div>
			<h1>마이페이지</h1>
			<Link to={{pathname:`/mypage/myprofile/${id}`}}>
				<div className="item">내 프로필</div>
			</Link>
			<Link to={{pathname:`/mypage/petprofile/${id}`}}>
				<div className="item">반려동물 프로필</div>
			</Link>
			<Link to={{pathname:`/mypage/sitterprofile/${id}`}}>
				<div className="item">돌보미 프로필</div>
			</Link>
			<Link to={{pathname:`/pwchange/${id}`}}>
				<div className="item">비밀번호 변경</div>
			</Link>
		</div>
	);
}
export default Mypage;