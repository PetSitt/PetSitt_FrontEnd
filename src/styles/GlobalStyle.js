import { createGlobalStyle } from 'styled-components';
import { reset } from 'styled-reset';
import 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css';
const GlobalStyles = createGlobalStyle`
  ${reset};

  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

  * {
    box-sizing: border-box;
    font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
  }
  body {
    color: ${({ theme }) => theme.colors.black};
    background-color: ${({ theme }) => theme.colors.white};
    font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
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
    border-radius: 0;
    -webkit-border-radius: 0;
    @media screen and (max-width: 400px){
      font-size: 14px;
      &::placeholder{
        font-size: 14px;
      }
    }
  }
  textarea {
    resize: none;
  }
  button {
    padding: 0;
    cursor: pointer;
  }

  /* Datepicker */
  .rmdp-wrapper,
  .rmdp-top-class,
  .rmdp-calendar,
  .rmdp-day-picker,
  .rmdp-day-picker > div  {
    width: 100%;
  }
  .rmdp-day, .rmdp-week-day{
    display: flex;
    width: 14.285714%;
    height: 0;
    padding-top: 7.142857%;
    padding-bottom: 7.142857%;
    align-items: center;
    justify-content: center;
  }
  .rmdp-day span{
    left: 6px;
    right: 6px;
    top: 6px;
    bottom: 6px;
    font-size: 14px;
    color: #1a1a1a;
  }
  .rmdp-day.rmdp-today span{
    border: 1px solid #FC9215;
    box-sizing: border-box;
    background-color: transparent;
    color: #000;
  }
  .rmdp-day.rmdp-disabled.rmdp-today span{
    border: none;
  }
  .rmdp-day:not(.rmdp-disabled):not(.rmdp-day-hidden) span:hover{
    background-color: transparent;
    color: #000;
  }
  .rmdp-day.rmdp-selected span:not(.highlight),
  .rmdp-day.rmdp-selected span:not(.highlight):hover{
    box-shadow: none;
    background-color: #FC9215;
    color: #fff;
  }
  .rmdp-border{
    border-radius: 10px;
    border-color: rgba(120,120,120,.4);
  }
  .rmdp-header-values{
    font-size: 18px;
    font-weight: 700;
  }
  .rmdp-arrow-container{
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
  }
  .rmdp-header{
    padding: 0 14px;
  }
  .rmdp-arrow-container i{
    width: 11px;
    height: 11px;
    border-top: 2px solid #000;
    margin: 0;
    padding: 0;
  }
  .rmdp-arrow-container.rmdp-right i{
    border-right: 2px solid #000;
    border-bottom: 2px solid #000;
    border-top: none;

  }
  .rmdp-arrow-container.rmdp-left i{
    border: none;
    border-right: 2px solid #000;
    border-bottom: 2px solid #000;
  }
  .rmdp-arrow-container.disabled .rmdp-arrow, .rmdp-arrow-container.disabled:hover .rmdp-arrow{
    border-color: #000;
    opacity: .2;
  }
  .rmdp-arrow-container:hover{
    background-color: transparent;
    box-shadow: none;
  }
  .rmdp-arrow-container:hover .rmdp-arrow{
    border-color: #000;
  }
  .rmdp-week-day{
    font-size: 14px;
    color: #676767;
    font-weight: normal;
  }
  .rmdp-disabled{
    pointer-events: none;
  }
  .rmdp-day.rmdp-deactive span,
  .rmdp-day.rmdp-disabled span{
    color: rgba(120,120,120,.4);
    text-decoration: line-through;
  }
 
  
  
  
  
`;

export default GlobalStyles;
