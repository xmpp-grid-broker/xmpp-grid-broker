import {browser} from 'protractor';
import {TopicsOverviewPage} from './page-objects/topics-overview.po';
import {Helpers} from './helpers';

describe('Routes', () => {
  let topicsOverview: TopicsOverviewPage;

  beforeEach(() => {
    topicsOverview = new TopicsOverviewPage();
  });

  it('root should redirect to topics overview', async(done) => {
    browser.get('/');
    await Helpers.noSpinners();

    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + topicsOverview.landingUrl);
    done();
  });
});
