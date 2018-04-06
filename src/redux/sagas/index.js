import { fork } from 'redux-saga/effects';

import authenticationSaga from './authentication';
import passwordResetSaga from './password-reset';
import sessionSaga from './session';

function* root() {
  yield fork(authenticationSaga);
  yield fork(sessionSaga);
  yield fork(passwordResetSaga);
}

export default root;
