import fs from 'fs-extra';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspacePath = path.join(__dirname, 'workspace'); // Defined at the top level

// Simulate the custom action
async function createFileAction(ctx) {
  console.log(`Creating file at ${ctx.input.path}`);
  
  // Resolve the absolute path
  const absolutePath = path.resolve(ctx.workspacePath, ctx.input.path);
  
  // Ensure the directory exists
  await fs.ensureDir(path.dirname(absolutePath));
  
  // Write the file contents
  await fs.writeFile(absolutePath, ctx.input.contents);
  
  console.log(`Successfully created file at ${absolutePath}`);
  return { success: true, path: absolutePath };
}

// Demo of using the action
async function runDemo() {
  await fs.ensureDir(workspacePath);
  
  const result = await createFileAction({
    workspacePath,
    input: {
      path: 'hello-world.txt',
      contents: 'Hello, Backstage custom action!'
    },
    logger: { info: console.log }
  });
  
  console.log('Demo result:', result);
  console.log('File contents:', await fs.readFile(path.join(workspacePath, 'hello-world.txt'), 'utf8'));
  
  return result;
}

// Create a simple web server to show the results
const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  
  try {
    const result = await runDemo();
    const fileContents = await fs.readFile(path.join(workspacePath, 'hello-world.txt'), 'utf8');
    
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Backstage Custom Action Demo</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
            .container { max-width: 800px; margin: 0 auto; }
            h1 { color: #7df3e1; }
            pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow: auto; }
            .card { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          </style>
        </head>
        <body style="background: #343b58;">
          <div class="container">
            <h1>Backstage Custom Action Demo</h1>
            <div class="card">
              <h2>Custom Action: my:custom:action</h2>
              <p>This action creates a new file with specified content.</p>
              
              <h3>Input Schema:</h3>
              <pre>
{
  "type": "object",
  "required": ["path", "contents"],
  "properties": {
    "path": {
      "type": "string",
      "title": "File Path",
      "description": "Path where the file should be created"
    },
    "contents": {
      "type": "string",
      "title": "File Contents",
      "description": "Contents of the file to be created"
    }
  }
}
              </pre>
              
              <h3>Demo Result:</h3>
              <pre>${JSON.stringify(result, null, 2)}</pre>
              
              <h3>Created File:</h3>
              <p>Path: <code>${path.join(workspacePath, 'hello-world.txt')}</code></p>
              <p>Contents:</p>
              <pre>${fileContents}</pre>
            </div>
            
            <div class="card">
              <h2>Integration with Backstage</h2>
              <p>In a full Backstage implementation, this action would be registered in the scaffolder plugin:</p>
              <pre>
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
              </pre>
              
              <p>And used in templates like this:</p>
              <pre>
# example-template.yaml
steps:
  - id: create-file
    name: Create File
    action: my:custom:action
    input:
      path: "{{ parameters.fileName }}"
      contents: "{{ parameters.fileContents }}"
              </pre>
            </div>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error running demo:', error);
    res.statusCode = 500;
    res.end(`<h1>Error</h1><pre>${error.stack}</pre>`);
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Demo server running at http://localhost:${PORT}`);
});
