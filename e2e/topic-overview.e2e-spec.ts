import {TopicOverviewRootCollectionsTab, TopicsOverviewPage} from './page-objects/topics-overview.po';
import {browser} from 'protractor';


describe('TopicOverview', () => {
  let page: TopicsOverviewPage;

  beforeEach(async () => {
    page = new TopicsOverviewPage();
    await page.navigateTo();
  });

  it('should go to the default tab on launch', () => {
    expect(browser.getCurrentUrl()).toEqual(page.tab.fullUrl);
  });

  it('should have new topic button', async () => {
    const buttonPresent = await page.newTopicButton.isPresent();
    expect(buttonPresent).toBe(true);
  });

  it('should go to new topic on button click', async () => {
    const newPage = await page.clickNewTopic();
    expect(browser.getCurrentUrl()).toBe(newPage.fullUrl);
  });

  it('should have new collection button', async () => {
    const buttonPresent = await page.newCollectionButton.isPresent();
    expect(buttonPresent).toBe(true);
  });

  it('should got to new collection on button click', async () => {
    const newPage = await page.clickNewCollection();
    expect(browser.getCurrentUrl()).toBe(newPage.fullUrl);
  });

  xit('should have the three tabs');



  describe('TopicOverviewRootCollectionsTab', () => {
    let tab: TopicOverviewRootCollectionsTab;

    beforeEach(async () => {
      tab = new TopicOverviewRootCollectionsTab();
      await page.navigateToTab(tab);
    });


    xit('should list all default root collections', () => {
      // and not the leaf topics
    });
  });
});
