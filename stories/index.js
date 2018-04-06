import React from 'react';
import { Route } from 'react-router-dom';
import { storiesOf, action } from '@storybook/react';
import { setRoute } from '../.storybook/config';

import Container from '../src/components/Container';
import TopTitle from '../src/components/TopTitle';

// Pages
import { Login } from '../src/pages/Login/Login';
import { ChangePassword } from '../src/pages/Login/ChangePassword';
import { RecoveryEmail } from '../src/pages/Recovery/Email';
import { RecoveryCode } from '../src/pages/Recovery/Code';
import { RecoveryPassword } from '../src/pages/Recovery/Password';

import './style.less';

storiesOf('Pages/Login', module)
  .add('Default', () => <Login onSubmit={action('Submit')} />)
  .add('With Error', () => <Login onSubmit={action('Submit')} error='Invalid username or password' />);

storiesOf('Pages/Forced Change Password', module)
  .add('Default', () => <ChangePassword onSubmit={action('Submit')} />)

storiesOf('Pages/Recovery Password', module)
  .addDecorator(story => <Container><TopTitle black="PASSWORD" green="RECOVERY" />{story()}</Container>)
  .add('Email', () => <RecoveryEmail onSubmit={action('Submit')} />)
  .add('Code', () => <RecoveryCode onSubmit={action('Submit')} />)
  .add('Password', () => <RecoveryPassword onSubmit={action('Submit')} />);
