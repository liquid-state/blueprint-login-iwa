import { takeEvery, getContext, call, put, race, take } from 'redux-saga/effects';
import { replace } from 'react-router-redux';
import {
  LOGIN_RESPONSE_SUCCESS,
  LOGIN_RESPONSE_CHANGE_PASSWORD,
  LOGIN_RESPONSE_MFA_REQUIRED,
} from '@liquid-state/iwa-cognito-identity/dist/const';

import { getAuthenticator } from '@liquid-state/iwa-cognito-identity';
import { LOGIN_SUBMITTED, LOGIN_CHANGE_PASSWORD_SUBMITTED } from '../const';
import { loginSucceeded, loginFailed, loginChangePasswordRequired } from '../actions';

export default function* authenticationSaga() {
  yield takeEvery(LOGIN_SUBMITTED, onLoginSubmitted);
}

export function* onLoginSubmitted({ payload: { username, password } }) {
  const app = yield getContext('app');
  const auth = yield call(getAuthenticator, app);
  try {
    const result = yield call(auth.login.bind(auth), { username, password });
    yield continueLoginWithResult(auth, result);
  } catch (e) {
    yield put(loginFailed(e.error));
  }
}

const continueLoginWithResult = (auth, result) => {
  switch (result.code) {
    case LOGIN_RESPONSE_SUCCESS:
      return put(loginSucceeded(result.identity, result.credentials));
    case LOGIN_RESPONSE_MFA_REQUIRED:
      return put(loginFailed('Requires MFA, Not Implemented Yet'));
    case LOGIN_RESPONSE_CHANGE_PASSWORD:
      return call(changePasswordRequired, auth);
    default:
      return null;
  }
};

function* changePasswordRequired(auth) {
  yield put(replace('/login/change-password'));
  yield put(loginChangePasswordRequired());

  const { submit, restart } = yield race({
    submit: take(LOGIN_CHANGE_PASSWORD_SUBMITTED),
    restart: take(LOGIN_SUBMITTED),
  });
  if (restart) {
    // The user has restarted the login process, abort this one.
    return;
  }
  const newPassword = submit.payload.password;
  try {
    const result = yield call(auth.completeChangePassword.bind(auth), newPassword);
    yield continueLoginWithResult(auth, result);
  } catch (e) {
    put(loginFailed(e.error));
  }
}
