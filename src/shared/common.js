/**
 * Form 데이터 전송할때 공통으로 사용하는 함수. 이 함수로 인해 useState를 재사용 가능함.
 * @param {string | DataValues | Function}
 * @example
 * handleChange("petSpay", Boolean(e.target.id), setValues);
 */
export const handleChange = (name, value, setFun) => {
  setFun((prevValues) => {
    return {
      ...prevValues,
      [name]: value,
    };
  });
};

/**
 * 숫자 3가지에 콤수를 추가 할수 있습니다.
 * @param {string}
 * @example
 * comma("20000");
 */
export const comma = (str) => {
	str = String(str);
	return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
};

/**
 * 숫자 3가지에 콤수를 뺄수 있습니다.
 * @param {string}
 * @example
 * comma("20000");
 */
export const uncomma = (str) => {
	str = String(str);
	return str.replace(/[^\d]+/g, '');
};

/** 윈도우창 리사이즈 함수 */
export const setScreenSize = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}