# Backstage Custom Action Implementation

## Overview
This project implements a custom action in Backstage with the ID `my:custom:action`. The custom action creates a new file with specified content in a Backstage template workspace.

## Project Structure

Key components:
- **Custom Action Module**: Located in `plugins/my-custom-action-backend-module-my-custom-action/`
- **Custom Action Implementation**: Located in `plugins/my-custom-action-backend-module-my-custom-action/src/actions/createFileAction.ts`
- **Custom Template**: Located in `examples/template/my-custom-template/template.yaml`

## Implementation Details

### Custom Action
The custom action (`my:custom:action`) accepts two inputs:
- `filename`: The name of the file to create
- `content`: The content to write to the file

When executed, the action creates a file with the specified name and content in the Backstage workspace directory.

```typescript
// From createFileAction.ts
export const createFileAction = () => {
  return createTemplateAction({
    id: 'my:custom:action',
    description: 'Creates a new file with specified content',
    schema: {
      input: z.object({
        filename: z.string().describe('The name of the file to create'),
        content: z.string().describe('The content to write to the file'),
      }),
    },
    async handler(ctx) {
      const { filename, content } = ctx.input;
      
      // Log the action being performed
      ctx.logger.info(`Creating file ${filename} with custom content`);
      
      // Create the file at the workspace path
      const filePath = resolveSafeChildPath(ctx.workspacePath, filename);
      await fs.writeFile(filePath, content);
      
      // Log the successful completion
      ctx.logger.info(`Successfully created file ${filePath}`);
    },
  });
};
```

### Registration
The custom action is registered with Backstage using the Backend System module:

```typescript
// From module.ts
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
```

### Custom Template
The custom template uses the `my:custom:action` to create a file based on user input:

```yaml
# From template.yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: my-custom-template
  title: My Custom Template
  description: A template that uses my custom action to create a file
spec:
  owner: guests
  type: website
  parameters:
    - title: Enter the filename
      properties:
        filename:
          title: Filename
          type: string
          description: Name of the file to create
          default: my-custom-file.txt
    - title: Enter the content
      properties:
        content:
          title: Content
          type: string
          description: Content to write to the file
          default: Hello from my custom action!
  steps:
    - id: create-file
      name: Create File
      action: my:custom:action
      input:
        filename: ${{ parameters.filename }}
        content: ${{ parameters.content }}
```

## Running the Project Locally

To run this project locally:

1. Clone the repository
2. Install dependencies:
   ```bash
   cd wild3/backstage
   yarn install
   ```
3. Start the Backstage app:
   ```bash
   yarn dev
   ```
4. Navigate to http://localhost:3000/create to see the template with the custom action

## Containerization
The repository includes Dockerfile and docker-compose.yml files for containerizing the application. Note that there are platform-specific dependencies that may require additional configuration based on your environment.

## Notes for Reviewers
- The custom action ID is `my:custom:action` as required
- The action has been successfully registered and appears in the template catalog
- The action successfully creates files with custom content when used in a template

## Dependencies
- Node.js
- Yarn
- Backstage
- Docker (for containerization)