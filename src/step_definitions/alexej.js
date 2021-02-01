import {Given, When, Then} from '@cucumber/cucumber';
import {$} from '../utils/index';

Given(/^I am on Alexej's homepage$/, async function() {
  return (await this.getTestController()).navigateTo('https://strelzow.dev');
});

When(/^I press on "About Me"$/, async function() {
  return (await this.getTestController()).click($('a[href="/about"]'));
});

Then(/^I see a handsome guy$/, async function() {
  (await this.getTestController()).expect(true).eql(false);
});
