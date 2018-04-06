import React from 'react';
import { Switch } from 'react-router';
import { Route } from '../../routing';
import LoginPage from './Login';
import ChangePasswordPage from './ChangePassword';

export default () => (
  <Switch>
    <Route path="/login/change-password" component={ChangePasswordPage} />
    <Route path="/" component={LoginPage} />
  </Switch>
);
