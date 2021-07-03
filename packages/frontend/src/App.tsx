import React from 'react';
import { appModel } from 'models';
import { GamePage, LoginPage } from 'pages';
import { observer } from 'mobx-react-lite';
import { BrowserRouter as Router } from 'react-router-dom';

const App = observer(() => {
  const { init, shouldLogin } = appModel;
  React.useEffect(() => {
    init();
  }, []);
  const RenderComponent = shouldLogin ? LoginPage : GamePage;
  return (
    <Router>
      {/* <GamePage /> */}
      <RenderComponent />
    </Router>
  );
});

export default App;
