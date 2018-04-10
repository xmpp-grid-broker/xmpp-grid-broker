import {browser} from 'protractor';
import {TopicsOverviewPage} from './page-objects/topics-overview.po';

describe('Routes', () => {
  let topicsOverview: TopicsOverviewPage;

  beforeEach(() => {
    topicsOverview = new TopicsOverviewPage();
  });

  it('root should redirect to topics overview', () => {
    browser.get('/');
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + topicsOverview.landingUrl);
  });
});
