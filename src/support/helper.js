import {BASE_URL, GENERATE_CUCUMBER_HTML_REPORT, GENERATE_CUCUMBER_JUNIT_REPORT, METADATA_FILE, TEST_FAIL_FILE} from '../environment';
import {execSync} from 'child_process';
import {existsSync, readFileSync, unlinkSync, writeFileSync} from 'fs';
import fetch from 'node-fetch';
import logger from '../utils/logger';

export const isLiveModeOn = () => process.env.LIVE_MODE === 'on';

/**
 * The purpose of this temporary test-file is to capture TestCafes' TestController.
 * We basically create and run a dummy test and capture the TestController for future tests.
 *
 * @param {string} name The name of the test file
 */
export const createTestFile = (name) => {
  writeFileSync(
      name,
      `import { testControllerHolder } from "./src/support/test-controller-holder";
      fixture("TestController")
      test("capture", testControllerHolder.capture)`,
  );
};

/**
 * Add k/v-metadata to the env variable "E2E_META_BROWSER" which will then be display
 * in the metadata section of the final HTML report.
 * For processing see `cucumber-html.config.js`.
 *
 * @param {string} key The key
 * @param {string} value The value
 */
export const addMetadata = (key, value) => {
  const rawData = readFileSync(METADATA_FILE, 'utf-8');
  const json = JSON.parse(rawData);
  json[key] = value;
  writeFileSync('reports/metadata.json', JSON.stringify(json));
};

/**
 * Fetch relevant application versions and store as metadata.
 */
export const fetchAndAddVersionsToMetadata = () => {
  const responseHandler = (response) => (response.ok ? response.json() : {version: 'error'});
  const getVersion = (url) => fetch(url, {method: 'GET'}).then((response) => responseHandler(response));

  getVersion(`${BASE_URL}/version`)
      .then((res) => addMetadata('Some System', res.version))
      .catch((err) => logger.error('Caught error: ', err));
};

/**
 * Generates the HTML report if {@link GENERATE_CUCUMBER_HTML_REPORT} is `true`
 */
export const generateHtmlReport = () => {
  if (GENERATE_CUCUMBER_HTML_REPORT) {
    try {
      logger.info('Generating HTML report...');
      execSync(`node ${process.cwd()}/cucumber-html.config.js`);
    } catch (error) {
      logger.error('Could not generate cucumber html report', error);
    }
  }
};

/**
 * Generates the JUNIT report if {@link GENERATE_CUCUMBER_JUNIT_REPORT} is `true`
 */
export const generateJunitReport = () => {
  if (GENERATE_CUCUMBER_JUNIT_REPORT) {
    try {
      logger.info('Generating JUNIT report...');
      execSync(`node ${process.cwd()}/cucumber-junit.config.js`);
    } catch (error) {
      logger.error('Could not generate cucumber junit report', error);
    }
  }
};

/**
 * The purpose of this file is to notify the ci-build-server that at least one test/scenario failed.
 * The ci-build-server must then let the build fail (not pass).
 */
export const createTestFailFile = () => {
  logger.info('Writing test-fail file...');
  writeFileSync(`reports/${TEST_FAIL_FILE}`, '');
};

/**
 * Creates the temporary shared metadata file.
 * Its content gets displayed in the HTML report.
 */
export const createMetadataFile = () => {
  if (!existsSync(METADATA_FILE)) {
    logger.info('Writing metadata file...');
    writeFileSync(METADATA_FILE, '{}');
  }
};

/**
 * Deletes the temporary shared metadata file.
 */
export const removeMetadataFile = () => {
  if (existsSync(METADATA_FILE)) {
    logger.info('Removing metadata file...');
    unlinkSync(METADATA_FILE);
  }
};
