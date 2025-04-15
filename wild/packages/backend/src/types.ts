import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { PluginCacheManager } from '@backstage/backend-common';
import { PluginDatabaseManager } from '@backstage/backend-common';
import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { PermissionEvaluator } from '@backstage/plugin-permission-common';
import { TokenManager } from '@backstage/backend-common';
import { HttpAuthService } from '@backstage/backend-common';

export type PluginEnvironment = {
  logger: Logger;
  database: PluginDatabaseManager;
  cache: PluginCacheManager;
  config: Config;
  reader: any;
  discovery: PluginEndpointDiscovery;
  tokenManager: TokenManager;
  scheduler: any;
  permissions: PermissionEvaluator;
  identity: IdentityApi;
  httpAuth: HttpAuthService;
};
