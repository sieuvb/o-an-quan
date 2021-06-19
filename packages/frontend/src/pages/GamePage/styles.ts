import styled from 'styled-components';

export const PageWrapper = styled.div`
  margin: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100vh;

  > .link-sharing {
    position: absolute;
    width: 300px;
    top: 35%;
    left: calc(50% - 150px);
  }
`;
