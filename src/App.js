import Router from './Router';
import styled from "styled-components";

function App() {
  return (
    <AppWrapper className="App">
      <Router />
    </AppWrapper>
  );
}

const AppWrapper = styled.div`
  max-width: 768px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
`

export default App;
