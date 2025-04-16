import { createBackendModule } from '@backstage/backend-plugin-api';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { createFileAction } from './actions/createFileAction';

export const myCustomActionModuleMyCustomAction = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'my-custom-action',
  register(env) {
    env.registerInit({
      deps: {
        scaffolder: scaffolderActionsExtensionPoint,
      },
      async init({ scaffolder }) {
        scaffolder.addActions(createFileAction());
      },
    });
  },
});