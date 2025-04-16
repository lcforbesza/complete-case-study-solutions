import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import fs from 'fs-extra';
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import { z } from 'zod';

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