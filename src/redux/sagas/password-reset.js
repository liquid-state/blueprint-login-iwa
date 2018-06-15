import { takeLatest, getContext, put, call, take } from 'redux-saga/effects';
import { replace } from 'react-router-redux';
import { getAuthenticator } from '@liquid-state/iwa-cognito-identity';
import { PASSWORD_RESET_STARTED, PASSWORD_RESET_CODE_SUBMITTED, PASSWORD_RESET_PASSWORD_SUBMITTED } from '../const';
import { passwordResetCodeInvalid, passwordResetPasswordInvalid, passwordResetComplete } from '../actions';


export default function* passwordResetSaga() {
  yield takeLatest(PASSWORD_RESET_STARTED, passwordReset);
}

export function* passwordReset({ payload: { email } }) {
  const app = yield getContext('app');
  const authenticator = yield call(getAuthenticator, app);
  try {
    yield call(authenticator.beginResetPassword.bind(authenticator), email);
    yield put(replace('/recovery/2'));
  } catch (e) {
    if (e.code === 'UserNotFoundException') {
      // Invalid user, just abort now.
      return;
    }
    throw e;
  }

  yield call(completePasswordReset, authenticator);

  yield put(passwordResetComplete());
  yield put(replace('/'));
}

/* eslint-disable prefer-destructuring */
export function* completePasswordReset(authenticator) {
  const codeSubmitted = yield take(PASSWORD_RESET_CODE_SUBMITTED);
  yield put(replace('/recovery/3'));
  const passwordSubmitted = yield take(PASSWORD_RESET_PASSWORD_SUBMITTED);

  let { payload: { code } } = codeSubmitted;
  let { payload: { password } } = passwordSubmitted;

  while (true) {
    try {
      yield call(authenticator.completeResetPassword.bind(authenticator), code, password);
      break;
    } catch (e) {
      if (e.code === 'CodeMismatchException') {
        yield put(replace('/recovery/2'));
        yield put(passwordResetCodeInvalid('Invalid code'));
        code = (yield take(PASSWORD_RESET_CODE_SUBMITTED)).payload.code;
        yield put(replace('/recovery/3'));
        password = (yield take(PASSWORD_RESET_PASSWORD_SUBMITTED)).payload.password;
      } else {
        yield put(passwordResetPasswordInvalid('This password cannot be used, please select a new password'));
        password = (yield take(PASSWORD_RESET_PASSWORD_SUBMITTED)).payload.password;
      }
    }
  }
}
