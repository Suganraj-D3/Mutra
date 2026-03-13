import { AuthConfig } from 'angular-oauth2-oidc';

export const authCodeFlowConfig: AuthConfig = {
  issuer: 'http://localhost:8080/realms/mutra',
  redirectUri: window.location.origin+'/dashboard',
  clientId: 'mutra-angular-client',
  responseType: 'code',
  scope: 'openid profile email',
  requireHttps: false,
  showDebugInformation: true
};