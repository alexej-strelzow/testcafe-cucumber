import {Selector} from 'testcafe';
import {testControllerHolder} from '../support/test-controller-holder';

/**
 * Internal factory that creates an extended Selector when running with Cucumber.
 * Holds an instance of TestCafes' TestController to be able to write short (synchronous) selectors.
 * <pre>
 * $('a.fancy-button').count // synchronous way - requires instance of TestController
 * vs
 * (await $('a.fancy-button')).count // asynchronous way - using {@link testControllerHolder#get} internally
 * </pre>
 */
class SelectorFactory {
  static t;

  /**
   * Initialized the SelectorFactory
   */
  static init() {
    const onTestControllerSet = (tc) => SelectorFactory.setTestController(tc);
    const listener = () => ({onTestControllerSet});
    testControllerHolder.register(listener);
  }

  /**
   * Puts the TestController into the factory
   *
   * @param {TestController} t The TestController
   */
  static setTestController(t) {
    if (!SelectorFactory.t) {
      SelectorFactory.t = t;
    }
  }

  /**
   * Destroy the SelectorFactory's TestController
   */
  static destroy() {
    SelectorFactory.t = undefined;
  }

  /**
   * Main method of the factory.
   * Creates a new instance of the Selector which works with TestCafe and Cucumber (needs "boundTestRun" property).
   *
   * @param {string} init See Selector
   * @param {object} options See Selector
   * @return {Selector} The bound selector if the TestController is available
   */
  static of(init, options) {
    const selector = Selector(init, options);

    return SelectorFactory.hasTestController() ? SelectorFactory.bind(selector) : selector;
  }

  /**
   * @return {boolean} True if the SelectorFactory has the TestController
   */
  static hasTestController() {
    return !!SelectorFactory.t;
  }

  /**
   * Binds the TestController to the Selector at hand
   *
   * @param {Selector} selector The Selector
   * @return {Selector} The bound Selector
   */
  static bind(selector) {
    return Selector(selector).with({boundTestRun: SelectorFactory.t});
  }
}

/**
 * Initialized and destroys the {@link SelectorFactory}.
 * See support/hooks.js
 */
export class SelectorFactoryInitializer {
  /**
   * Initialize the SelectorFactory
   */
  static init() {
    SelectorFactory.init();
  }

  /**
   * Destroy the SelectorFactory
   */
  static destroy() {
    SelectorFactory.destroy();
  }
}

/**
 * The transparent custom selector that works with tests run by TestCafe and Cucumber.
 * It basically wrapps the Selector function and appends the "boundTestRun" property if needed.
 * see {@link SelectorFactory#of}
 *
 * @param {string} init See Selector
 * @param {object} options See Selector
 * @return {Selector} The bound selector
 */
export function $(init, options) {
  return SelectorFactory.of(init, options);
}

/**
 * Selector that selects for the custom attribute [data-testid]
 *
 * @param {string} value The value of the data-testid custom attribute
 * @return {Selector|jQuery|HTMLElement} The configured custom Selector
 */
export function selectByTestId(value) {
  return $(`*[data-testid="${value}"]`);
}
