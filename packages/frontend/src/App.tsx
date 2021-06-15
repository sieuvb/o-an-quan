import React from 'react';
import { LoginPage } from 'pages/LoginPage/LoginPage';
import { appModel } from 'models';

const App = () => {
  console.log(appModel.test);
  const RenderComponent = LoginPage;
  return <RenderComponent />;
};
export default App;
