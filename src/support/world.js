import {base64Sync} from 'base64-img';
import {testControllerHolder} from './test-controller-holder';
import {setDefaultTimeout, setWorldConstructor} from '@cucumber/cucumber';
import {isLiveModeOn} from './helper';
import logger from '../utils/logger';
const screenshot = require('screenshot-desktop');

const DEFAULT_TIMEOUT = isLiveModeOn() ? 60 * 60 * 1000 : 30 * 1000;

/**
 * The cucumber world.
 * Every step (GIVEN, WHEN, THEN) gets called from this context.
 * Meaning you can use `this` to access functions of the world (e.g. `getTestController`).
 *
 * @param {function} attach Attaches a screenshot to the report
 * @constructor
 */
function CustomWorld({attach}) {
  /**
   * This function is crucial for the Given-Part of each feature as it provides the TestController
   *
   * @return {Promise} The TestController as Promise
   */
  this.getTestController = () => testControllerHolder.get();

  /**
   * function that attaches the attachment (e.g. screenshot) to the report
   */
  this.attach = attach;

  /**
   * Adds embeddings to the "After"-step (see report.json):
   * "embeddings": [{ "data": "base64 encoded image", "mime_type": "image/png" }]
   */
  this.addScreenshotToReport = async function() {
    await (await this.getTestController())
        .takeScreenshot()
        .then(this.attachScreenshotToReport)
        .catch(async (error) => {
        // Workaround for https://github.com/DevExpress/testcafe/issues/4231
          logger.error('encountered an error during taking screenshot, retry using another library...', error);
          await screenshot({format: 'png'}).then((image) => {
            logger.info('screenshot taken!');
            return this.attachScreenshotInPngFormatToReport(image);
          });
        });
  };

  /**
   * Adds the screenshot under the given path to the json report
   *
   * @param {string} pathToScreenshot The path under which the screenshot has been saved
   * @return {void}
   */
  this.attachScreenshotToReport = (pathToScreenshot) => {
    const imgInBase64 = base64Sync(pathToScreenshot);
    const imageConvertForCuc = imgInBase64.substring(imgInBase64.indexOf(',') + 1);
    return attach(imageConvertForCuc, 'image/png');
  };

  /**
   * Adds the screenshot to the json report
   *
   * @param {object} pngImage the image in png format
   * @return {void}
   */
  this.attachScreenshotInPngFormatToReport = (pngImage) => attach(pngImage, 'image/png');
}

setDefaultTimeout(DEFAULT_TIMEOUT);

setWorldConstructor(CustomWorld);
