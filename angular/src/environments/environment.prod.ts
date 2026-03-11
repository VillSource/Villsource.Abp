import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

const oAuthConfig = {
  issuer: 'https://localhost:44372/',
  redirectUri: baseUrl,
  clientId: 'Abp_App',
  responseType: 'code',
  scope: 'offline_access Abp',
  requireHttps: true,
};

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'Abp',
  },
  oAuthConfig,
  apis: {
    default: {
      url: 'https://localhost:44372',
      rootNamespace: 'Villsource.Abp',
    },
    AbpAccountPublic: {
      url: oAuthConfig.issuer,
      rootNamespace: 'AbpAccountPublic',
    },
  },
} as Environment;
