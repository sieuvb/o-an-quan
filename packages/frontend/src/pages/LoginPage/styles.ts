import styled from 'styled-components';

export const ModalWrapper = styled.div`
  width: 600px;
  background: white;
  border-radius: 4px;
  margin: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .ant-tabs {
    width: 300px;
    .ant-tabs-nav-list {
      width: 100%;
      justify-content: space-around;
    }
    .ant-tabs-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      .btn-action {
        margin-top: 16px;
      }
    }
  }
`;
