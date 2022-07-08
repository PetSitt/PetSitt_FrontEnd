import React from 'react';
import { Link } from "react-router-dom";
import { Cookies } from "react-cookie";
import Button from '../elements/Button';

const Mypage = () => {
	const cookies = new Cookies();
	const isLogin = cookies.get('accessToken');
	return (
		<div>
			<h1>마이페이지</h1>
			{isLogin ?(
				<>
					<Link to={{pathname:`/mypage/myprofile`}}>
						<div className="item">내 프로필</div>
					</Link>
					<Link to={{pathname:`/mypage/petprofile`}}>
						<div className="item">반려동물 프로필</div>
					</Link>
					<Link to={{pathname:`/mypage/sitterprofile`}}>
						<div className="item">돌보미 프로필</div>
					</Link>
					<Link to={{pathname:`/pwchange`}}>
						<div className="item">비밀번호 변경</div>
					</Link>
				</> ) : (
				<>
					<p>로그인한 사용자만 접속할수 있습니다.</p>
					<Link to="/login"><Button>로그인하기</Button></Link>
				</>
				)
			}
		</div>
	);
}
export default Mypage;