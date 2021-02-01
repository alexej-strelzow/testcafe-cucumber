/**
 * Configures the TestController
 *
 * @param {object} tc: The TestController
 */
const onTestControllerSet = async (tc) => await tc.maximizeWindow();
export const testControllerConfig = () => ({onTestControllerSet});
