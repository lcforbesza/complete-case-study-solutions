import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import fs from 'fs-extra';
import path from 'path';

/**
 * Custom action to create a new file with specified content
 * Action ID: my:custom:action
 */
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
      
      // Log for debugging purposes
      ctx.logger.info(`Creating file at ${filePath}`);
      
      // Resolve the absolute path
      const absolutePath = path.resolve(ctx.workspacePath, filePath);
      
      // Ensure the directory exists
      await fs.ensureDir(path.dirname(absolutePath));
      
      // Write the file contents
      await fs.writeFile(absolutePath, contents);
      
      // Log successful completion
      ctx.logger.info(`Successfully created file at ${absolutePath}`);
    },
  });
};
