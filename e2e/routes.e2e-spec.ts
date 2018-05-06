import {browser} from 'protractor';
import {TopicOverviewRootCollectionsTab} from './page-objects/topics-overview.po';
import {AppPage} from './page-objects/app.po';


describe('Routes', () => {
  it('root should redirect to topics overview', async() => {
    const appPage = new AppPage();
    await appPage.navigateTo();

    const destination = new TopicOverviewRootCollectionsTab();
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + destination.landingUrl);
  });
});
