/**
 * Form 데이터 전송할때 공통으로 사용하는 함수. 이 함수로 인해 useState를 재사용 가능함.
 * @param {Stting | DataValues | Function}
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
