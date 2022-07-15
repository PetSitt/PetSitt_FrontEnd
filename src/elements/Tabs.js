import React, {useState} from 'react';
import styled from 'styled-components';

const Tabs = ({_tab, _value, setSelectedTab}) => {
  const [item, setItem] = useState(_tab);
  return (
    <TabGroup>
      {
        item.map((v,i)=>{
          return (
            <li key={`tab_${i}`}>
              <label>
              <input type="radio" name="tab" defaultChecked={i===0} onChange={()=>setSelectedTab(_value[i])}/>
                <span>{v}</span>
              </label>
            </li>
          )
        })
      }
    </TabGroup>
  )
}


const TabGroup = styled.ul`
  display: flex;
  align-items: center;
  border-radius: 6px;
  border: 1px solid #FC9215;
  color: #FC9215;
  li{
    flex: 1;
    label{
      position: relative;
      text-align: center;
      line-height: 40px;
      input{
        position: absolute;
        left: 0;
        top: 0;
        width: 0;
        &:checked{
          &+span{
            background-color: #FC9215;
            color: #fff;
          }
        }
      }
      span{
        display: block;
        text-align: center;
      }
    }

  }
`;
export default Tabs;