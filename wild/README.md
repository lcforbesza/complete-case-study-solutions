# Backstage Custom Action Implementation

This repository demonstrates a Backstage custom action with ID `my:custom:action` that creates a new file with user-specified content.

## Overview

[Backstage](https://backstage.io/) is an open-source platform for building developer portals. It can be extended with custom actions that perform specific tasks during template processing. This project implements a custom action that creates a new file with specified content.

## Implementation Details

### Custom Action

The custom action (`my:custom:action`) is designed to:
- Create a new file at a specified path
- Write user-specified content to the file
- Support template variables for dynamic content generation

### Project Structure

```
/
├── Dockerfile                  # Docker configuration for the demo
├── compose.yml                 # Docker Compose configuration
├── demo.js                     # Demo application showing the action
├── packages/
│   ├── backend/
│   │   └── src/
│   │       └── plugins/
│   │           └── scaffolder/
│   │               └── actions/
│   │                   └── custom-action.ts  # Custom action implementation
│   └── scaffolder-backend/
│       └── templates/
│           └── example-template.yaml         # Example template using the action
└── workspace/                  # Directory where files are created by the action
```

## How It Works

1. The custom action is defined with an ID of `my:custom:action`
2. It accepts two inputs:
   - `path`: Where to create the file
   - `contents`: What to write to the file
3. When executed, it:
   - Resolves the path relative to the workspace
   - Creates any necessary parent directories
   - Writes the specified content to the file

## Running the Demo

### Prerequisites

- Docker
- Docker Compose

### Setup and Run

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Build and start the Docker container:
   ```bash
   docker compose up --build
   ```

3. Access the demo at [http://localhost:3000](http://localhost:3000)

## Integration with Backstage

In a full Backstage implementation, this custom action would be integrated as follows:

1. **Register the action in the scaffolder plugin**:
   ```typescript
   // packages/backend/src/plugins/scaffolder.ts
   import { createFileAction } from './scaffolder/actions/custom-action';

   export default async function createPlugin(env) {
     // ...
     return await createRouter({
       // ...
       actions: [
         createFileAction(),
         // ...other actions
       ],
     });
   }
   ```

2. **Use the action in templates**:
   ```yaml
   # example-template.yaml
   steps:
     - id: create-file
       name: Create File
       action: my:custom:action
       input:
         path: "{{ parameters.fileName }}"
         contents: "{{ parameters.fileContents }}"
   ```

## Custom Action Code Explanation

The core functionality of the custom action is implemented in `packages/backend/src/plugins/scaffolder/actions/custom-action.ts`:

```typescript
export const createFileAction = () => {
  return createTemplateAction<{
    path: string;
    contents: string;
  }>({
    id: 'my:custom:action',
    schema: {
      input: {
        type: 'object',
        required: ['path', 'contents'],
        properties: {
          path: {
            type: 'string',
            title: 'File Path',
            description: 'Path where the file should be created',
          },
          contents: {
            type: 'string',
            title: 'File Contents',
            description: 'Contents of the file to be created',
          },
        },
      },
    },
    async handler(ctx) {
      const { path: filePath, contents } = ctx.input;
      
      // Resolve the absolute path
      const absolutePath = path.resolve(ctx.workspacePath, filePath);
      
      // Ensure the directory exists
      await fs.ensureDir(path.dirname(absolutePath));
      
      // Write the file contents
      await fs.writeFile(absolutePath, contents);
    },
  });
};
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.