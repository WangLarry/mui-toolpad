import * as path from 'path';
import { test, expect } from '../../playwright/localTest';
import { ToolpadRuntime } from '../../models/ToolpadRuntime';
import { ToolpadEditor } from '../../models/ToolpadEditor';
import { fileReplace } from '../../utils/fs';

test.use({
  ignoreConsoleErrors: [
    // Chrome:
    /Cannot read properties of null/,
    // firefox:
    /throws\.error is null/,
    // Intentionally thrown
    /BOOM!/,
  ],
});

test.use({
  localAppConfig: {
    template: path.resolve(__dirname, './fixture'),
    cmd: 'dev',
  },
});

test('functions basics', async ({ page }) => {
  const runtimeModel = new ToolpadRuntime(page);
  await runtimeModel.gotoPage('page1');

  await page.locator('text="hello, message: hello world"').waitFor({ state: 'visible' });
  await page.locator('text="throws, error.message: BOOM!"').waitFor({ state: 'visible' });
  await page.locator('text="throws, data undefined"').waitFor({ state: 'visible' });
  await page.locator('text="echo, parameter: bound foo parameter"').waitFor({ state: 'visible' });
  await page.locator('text="echo, secret: Some bar secret"').waitFor({ state: 'visible' });
});

test('function editor reload', async ({ page, localApp }) => {
  const editorModel = new ToolpadEditor(page);
  await editorModel.goto();

  await expect(editorModel.appCanvas.getByText('edited hello')).toBeVisible();

  const queriesFilePath = path.resolve(localApp.dir, './toolpad/queries.ts');
  await fileReplace(queriesFilePath, "'edited hello'", "'edited goodbye!!!'");

  // TODO: make this unnecessary:
  await page.reload();

  await expect(editorModel.appCanvas.getByText('edited goodbye!!!')).toBeVisible();
});
