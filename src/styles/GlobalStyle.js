import { createGlobalStyle } from "styled-components";
import { reset } from "styled-reset";

const GlobalStyles = createGlobalStyle`
  @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.4/dist/web/static/pretendard.css");
  ${reset};
  * {
    box-sizing: border-box;
    font-family: 'Pretendard', sans-serif;
  }
  body {
    color: ${({ theme }) => theme.colors.black};
    background-color: ${({ theme }) => theme.colors.white};
    font-family: 'Pretendard', sans-serif;
    
  }
  a {
    color: ${({ theme }) => theme.colors.black};
    text-decoration: none;
    
    &:hover {
      color: ${({ theme }) => theme.colors.black};
    }
  }
  button, 
  input,
  textarea {
    color: ${({ theme }) => theme.colors.black};
    background-color: transparent;
    border: none;
    outline: none;
  }
  textarea {
    resize: none;
  }
  button {
    padding: 0;
    cursor: pointer;
  }
  
  
`;

export default GlobalStyles;