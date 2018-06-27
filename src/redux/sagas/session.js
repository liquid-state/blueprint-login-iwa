import { takeEvery, fork, call, put, getContext } from 'redux-saga/effects';
import IdentityPlugin from '@liquid-state/iwa-identity';
import { configureCognito } from '@liquid-state/iwa-cognito-identity';

import { LOGIN_SUCCEEDED, SESSION_ESTABLISHED } from '../const';
import { sessionEstablished } from '../actions';

const setPermissionsForKey = key => (
  key
    .addWritePermission('iwa', 'login')
    .addWritePermission('iwa', 'registration')
    .addReadPermission('iwa', 'home')
);

export default function* sessionSaga() {
  yield takeEvery(LOGIN_SUCCEEDED, establishSessionFromLogin);
  yield takeEvery(SESSION_ESTABLISHED, sessionEstablishmentComplete);

  yield fork(initialise);
}

function* initialise() {
  const app = yield getContext('app');
  yield call(configureCognito, app, setPermissionsForKey);
  const idProvider = app.use(IdentityPlugin).forService('cognito');
  const identity = yield call(idProvider.getIdentity.bind(idProvider));
  if (identity.isAuthenticated) {
    yield put(sessionEstablished());
  }
}

function* sessionEstablishmentComplete() {
  const router = yield getContext('router');
  const path = yield call(router.resolve.bind(router), '/', 'home');
  // Navigate with replace.
  yield call(router.navigate.bind(router), path, true);
}

function* establishSessionFromLogin({ payload: { identity, credentials } }) {
  const app = yield getContext('app');
  const idProvider = app.use(IdentityPlugin).forService('cognito');
  yield call(idProvider.update.bind(idProvider), identity, credentials);
  yield put(sessionEstablished());
}
