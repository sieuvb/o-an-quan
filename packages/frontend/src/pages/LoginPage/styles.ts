import { Form } from 'antd';
import styled from 'styled-components';

export const PageWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

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
