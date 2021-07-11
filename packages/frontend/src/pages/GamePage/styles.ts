import styled from 'styled-components';

export const PageWrapper = styled.div`
  margin: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100vh;

  > .link-sharing {
    position: fixed;
    width: 300px;
    top: 0;
    left: calc(50% - 150px);
  }
`;
