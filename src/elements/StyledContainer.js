import styled from "styled-components";

const StyledContainer = ({ children }) => {
  return <Container>{children}</Container>;
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  padding: 65px 16px;
`;

export default StyledContainer;
