import {Given, When, Then} from '@cucumber/cucumber';
import * as githubPage from '../page_objects/github.po';

Given(/^I open the GitHub page$/, async function() {
  return (await this.getTestController()).navigateTo(githubPage.url());
});

When(/^I am typing my search request "([^"]*)" on GitHub$/, async function(text) {
  return (await this.getTestController()).typeText(githubPage.searchButton(), text);
});

Then(/^I am pressing (.*) key on GitHub$/, async function(text) {
  return (await this.getTestController()).pressKey(text);
});

Then(/^I should see that the first GitHub's result is (.*)$/, async function(text) {
  const firstResult = await githubPage.firstSearchResult().textContent;
  (await this.getTestController()).expect(firstResult).contains(text);
});
