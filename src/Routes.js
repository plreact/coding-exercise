import { object } from 'prop-types';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router/immutable';

import Main from './containers/Main';
import Login from './containers/Login';

function Routes({ history }) {
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path='/' component={Main} />
        <Route exact path='/login' component={Login} />
      </Switch>
    </ConnectedRouter>
  );
}

Routes.propTypes = {
  history: object.isRequired
};

export default Routes;
