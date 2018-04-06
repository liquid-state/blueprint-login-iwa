import * as AWS from 'aws-sdk/global';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { Messages } from '@liquid-state/iwa-core';
import KeyValuePlugin from '@liquid-state/iwa-keyvalue';
import IdentityPlugin, { IdentityStore } from '@liquid-state/iwa-identity';
import CognitoIdentity, { CognitoAuthenticator } from '@liquid-state/iwa-cognito-identity';

const COGNITO_SETTINGS = [
  'AWS_USER_POOL_ID',
  'AWS_IDENTITY_POOL_ID',
  'AWS_USER_POOL_CLIENT_ID',
  'AWS_REGION',
];

export const configureCognito = async (app) => {
  const settings = await app.communicator.send(Messages.config.get(...COGNITO_SETTINGS));
  const {
    AWS_USER_POOL_ID,
    AWS_USER_POOL_CLIENT_ID,
    AWS_IDENTITY_POOL_ID,
    AWS_REGION,
  } = settings;

  AWS.config.update({ region: AWS_REGION.value });

  const userPool = new CognitoUserPool({
    UserPoolId: AWS_USER_POOL_ID.value,
    ClientId: AWS_USER_POOL_CLIENT_ID.value,
  });

  const kv = app.use(KeyValuePlugin);
  const idStore = new IdentityStore(kv, {
    setPermissionsForKey: key => key
      .addWritePermission('iwa', 'login')
      .addWritePermission('iwa', 'registration')
      .addWritePermission('iwa', 'home'),
  });

  app.use(IdentityPlugin)
    .addProvider('cognito', new CognitoIdentity(userPool, AWS_IDENTITY_POOL_ID.value, idStore));
};

export const getAuthenticator = async (app) => {
  const settings = await app.communicator.send(Messages.config.get(...COGNITO_SETTINGS));
  const userPool = new CognitoUserPool({
    UserPoolId: settings.AWS_USER_POOL_ID.value,
    ClientId: settings.AWS_USER_POOL_CLIENT_ID.value,
  });
  return new CognitoAuthenticator(userPool);
};
