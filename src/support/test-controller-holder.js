/**
 * Controls the lifecycle and visibility of TestCafe's TestController for Cucubmer.
 */
class TestControllerHolderImpl {
  static instance;

  // TODO: intended not to be static
  static testController;
  static testControllerListener = [];
  static captureResolver;
  static getResolver;

  /**
   * Private constructor (Singleton!)
   */
  constructor() {}

  /**
   * Returns the instance of this class
   *
   * @return {TestControllerHolderImpl} instance of this class
   */
  static getInstance() {
    if (!TestControllerHolderImpl.instance) {
      TestControllerHolderImpl.instance = new TestControllerHolderImpl();
    }
    return TestControllerHolderImpl.instance;
  }

  /**
   * Captures TestCafe's TestController
   *
   * @param {TestController} t TestCafe's TestController
   * @return {Promise<TestController>} A promise of the TestController
   */
  capture(t) {
    TestControllerHolderImpl.testController = t;

    TestControllerHolderImpl?.testControllerListener.forEach((l) => l.onTestControllerSet(t));

    if (TestControllerHolderImpl.getResolver) {
      TestControllerHolderImpl.getResolver(t);
    }

    return new Promise((resolve) => (TestControllerHolderImpl.captureResolver = resolve));
  }

  /**
   * Registers a function which gets fired after the TestController got caputred
   *
   * @param {function} fn The "listener"
   */
  register(fn) {
    TestControllerHolderImpl?.testControllerListener.push(fn());
  }

  /**
   * Destroy the TestController
   */
  destroy() {
    TestControllerHolderImpl.testController = undefined;

    if (TestControllerHolderImpl.captureResolver) {
      TestControllerHolderImpl.captureResolver();
    }
  }

  /**
   * Returns the TestController
   *
   * @return {Promise<TestController>} The TestController
   */
  get() {
    return new Promise((resolve) => {
      if (TestControllerHolderImpl.testController) {
        // already captured
        resolve(TestControllerHolderImpl.testController);
      } else {
        // resolve (later) when captured
        TestControllerHolderImpl.getResolver = resolve;
      }
    });
  }
}

export const testControllerHolder = TestControllerHolderImpl.getInstance();
