import { getContext, put, take } from 'redux-saga/effects';
import { replace } from 'react-router-redux';
import { passwordReset, completePasswordReset } from './password-reset';
import { passwordResetComplete, passwordResetCodeInvalid, passwordResetPasswordInvalid } from '../actions';
import { PASSWORD_RESET_CODE_SUBMITTED, PASSWORD_RESET_PASSWORD_SUBMITTED } from '../const';

const app = { key: 'app' };
const auth = { key: 'auth', beginResetPassword: () => { }, completeResetPassword: () => { } };

describe('passwordReset', () => {
  it('Completes correctly with a valid email', () => {
    const gen = passwordReset({ payload: { email: 'test@example.com' } });
    const getApp = gen.next();
    expect(getApp.value).toMatchObject(getContext('app'));

    const getAuth = gen.next(app);
    expect(getAuth.value.CALL).toBeDefined();
    expect(getAuth.value.CALL.args[0]).toBe(app);

    const beginReset = gen.next(auth);
    expect(beginReset.value.CALL).toBeDefined();
    expect(beginReset.value.CALL.args[0]).toBe('test@example.com');

    const redirect = gen.next();
    expect(redirect.value).toMatchObject(put(replace('/recovery/2')));

    const callContinue = gen.next();
    expect(callContinue.value.CALL).toBeDefined();
    expect(callContinue.value.CALL.args[0]).toBe(auth);

    const setComplete = gen.next();
    expect(setComplete.value).toMatchObject(put(passwordResetComplete()));

    const redirectToLogin = gen.next();
    expect(redirectToLogin.value).toMatchObject(put(replace('/')));
    expect(redirectToLogin.done).toBeFalsy();
  });

  it('Returns early with invalid email', () => {
    const gen = passwordReset({ payload: { email: 'invalid@example.com' } });
    const getApp = gen.next();
    expect(getApp.value).toMatchObject(getContext('app'));

    const getAuth = gen.next(app);
    expect(getAuth.value.CALL).toBeDefined();
    expect(getAuth.value.CALL.args[0]).toMatchObject(app);

    const beginReset = gen.next(auth);
    expect(beginReset.value.CALL).toBeDefined();
    expect(beginReset.value.CALL.args[0]).toBe('invalid@example.com');

    const end = gen.throw({ code: 'UserNotFoundException' });
    expect(end.done).toBeTruthy();
  });
});

describe('completePasswordReset', () => {
  it('Collects a code and new password', () => {
    const gen = completePasswordReset(auth);

    const takeCode = gen.next();
    expect(takeCode.value).toMatchObject(take(PASSWORD_RESET_CODE_SUBMITTED));

    const moveForward = gen.next();
    expect(moveForward.value).toMatchObject(put(replace('/recovery/3')));

    const takePassword = gen.next();
    expect(takePassword.value).toMatchObject(take(PASSWORD_RESET_PASSWORD_SUBMITTED));
  });

  it('Calls completeResetPassword with collected code and password', () => {
    const gen = completePasswordReset(auth);
    const code = 111111;
    const password = 'password';

    // Skip forward.
    gen.next();
    gen.next({ payload: { code } });
    gen.next();

    const call = gen.next({ payload: { password } });
    expect(call.value.CALL).toBeDefined();
    expect(call.value.CALL.args[0]).toBe(code);
    expect(call.value.CALL.args[1]).toBe(password);
  });

  it('Ends if completeResetPassword returns', () => {
    const gen = completePasswordReset(auth);

    gen.next();
    gen.next({ payload: { code: 111111 } });
    gen.next();
    gen.next({ payload: { password: 'test' } });

    const done = gen.next();
    expect(done.done).toBeTruthy();
  });

  it('Recollects code and password when code is invalid.', () => {
    const gen = completePasswordReset(auth);

    gen.next();
    gen.next({ payload: { code: 111111 } });
    gen.next();
    gen.next({ payload: { password: 'test' } });

    // Trigger the CodeMismatch Error
    const redirect = gen.throw({ code: 'CodeMismatchException' });
    expect(redirect.value).toMatchObject(put(replace('/recovery/2')));

    const setError = gen.next();
    expect(setError.value).toMatchObject(put(passwordResetCodeInvalid('Invalid code')));

    // Collect new code
    expect(gen.next().value).toMatchObject(take(PASSWORD_RESET_CODE_SUBMITTED));

    // Redirect to new password once a new code is submitted.
    expect(gen.next({ payload: { code: 1111 } }).value).toMatchObject(put(replace('/recovery/3')));

    // Collect a new password
    expect(gen.next().value).toMatchObject(take(PASSWORD_RESET_PASSWORD_SUBMITTED));

    // Call complete again with the new details
    const newCall = gen.next({ payload: { password: 'newpassword' } });
    expect(newCall.value.CALL).toBeDefined();
    expect(newCall.value.CALL.args[0]).toBe(1111);
    expect(newCall.value.CALL.args[1]).toBe('newpassword');

    // Finished
    expect(gen.next().done).toBeTruthy();
  });

  it('Recollects password when password is invalid', () => {
    const gen = completePasswordReset(auth);

    gen.next();
    gen.next({ payload: { code: 111111 } });
    gen.next();
    gen.next({ payload: { password: 'test' } });

    // Trigger the CodeMismatch Error
    const setError = gen.throw({ code: 'AnythingElse' });
    expect(setError.value).toMatchObject(put(passwordResetPasswordInvalid('This password cannot be used, please select a new password')));

    // Collect a new password
    expect(gen.next().value).toMatchObject(take(PASSWORD_RESET_PASSWORD_SUBMITTED));

    // Recall with new values
    const newCall = gen.next({ payload: { password: 'newpassword' } });
    expect(newCall.value.CALL).toBeDefined();
    expect(newCall.value.CALL.args[0]).toBe(111111);
    expect(newCall.value.CALL.args[1]).toBe('newpassword');

    expect(gen.next().done).toBeTruthy();
  });
});
