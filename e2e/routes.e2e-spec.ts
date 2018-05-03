import {browser} from 'protractor';
import {TopicsOverviewPage} from './page-objects/topics-overview.po';

browser.waitForAngularEnabled(false)

describe('Routes', () => {
  let topicsOverview: TopicsOverviewPage;

  beforeEach(() => {
    topicsOverview = new TopicsOverviewPage();
  });

  it('root should redirect to topics overview', (done) => {
    browser.get('/');

    const resolve = () => {
      expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + topicsOverview.landingUrl);
      done();
    };

    setTimeout(resolve, 10000);
  });
});
