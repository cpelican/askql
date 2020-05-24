import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, join, parse, relative } from 'path';
import { process } from './js.jest.transformer';

declare var jestTestPath: string;

const testPath = jestTestPath;
const rootDir = join(__dirname, '../src');
const testDir = relative(rootDir, dirname(jestTestPath));
const targetDir = join(rootDir, '../dist', testDir);

const { name: testName, ext: fileExt } = parse(jestTestPath);

const targetPath = join(targetDir, `${testName}.js`);

test(`builds ${targetPath}`, async () => {
  const src: string = await readFile(jestTestPath, { encoding: 'utf-8' });
  expect(src).toBeDefined();

  const compiledSource = process(src, testPath);
  expect(compiledSource).toBeDefined();

  // TODO sourceMap for TS ?

  await mkdir(targetDir, { recursive: true });
  await writeFile(targetPath, compiledSource);
});