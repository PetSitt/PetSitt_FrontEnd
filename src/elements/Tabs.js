import React, {useState} from 'react';
import styled from 'styled-components';

const Tabs = ({_tab, _value, _checked, setSelectedTab}) => {
  const [item, setItem] = useState(_tab);
  return (
    <TabGroup>
      {
        item.map((v,i)=>{
          return (
            <li key={`tab_${i}`}>
              <label>
              <input type="radio" name="tab" defaultChecked={_checked===_value[i]} onChange={()=>setSelectedTab(_value[i])}/>
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
  color: rgba(120, 120, 120, 0.7);
  margin-bottom: 42px;
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
            font-weight: 500;
            color: #FC9215;
            border-bottom: 2px solid #FC9215;
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