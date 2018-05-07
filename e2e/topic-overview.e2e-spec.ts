import {
  TopicOverviewAllCollectionsTab,
  TopicOverviewAllTopicsTab,
  TopicOverviewRootCollectionsTab,
  TopicsOverviewPage
} from './page-objects/topics-overview.po';
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

  it('should go to new collection on button click', async () => {
    const newPage = await page.clickNewCollection();
    expect(browser.getCurrentUrl()).toBe(newPage.fullUrl);
  });

  describe('TopicOverviewRootCollectionsTab', () => {
    let tab: TopicOverviewRootCollectionsTab;

    beforeEach(async () => {
      tab = new TopicOverviewRootCollectionsTab();
      await page.navigateToTab(tab);
    });

    it('should have the tabs url', () => {
      expect(browser.getCurrentUrl()).toEqual(page.tab.fullUrl);
    });


    it('should list all default root collections', async () => {
      const expectedTopics = ['collection1', 'collection2', 'topic1', 'topic2'];
      expect(await tab.list.listContent()).toEqual(expectedTopics);
    });
  });

  describe('TopicOverviewAllTopicsTab', () => {
    let tab: TopicOverviewAllTopicsTab;

    beforeEach(async () => {
      tab = new TopicOverviewAllTopicsTab();
      await page.navigateToTab(tab);
    });

    it('should have the tabs url', () => {
      expect(browser.getCurrentUrl()).toEqual(page.tab.fullUrl);
    });


    it('should list all default topics', async () => {
      const expectedTopics = ['topic1', 'topic1.1', 'topic2'];
      expect(await tab.list.listContent()).toEqual(expectedTopics);
    });
  });

  describe('TopicOverviewAllCollectionsTab', () => {
    let tab: TopicOverviewAllCollectionsTab;

    beforeEach(async () => {
      tab = new TopicOverviewAllCollectionsTab();
      await page.navigateToTab(tab);
    });

    it('should have the tabs url', () => {
      expect(browser.getCurrentUrl()).toEqual(page.tab.fullUrl);
    });


    it('should list all default collections', async () => {
      const expectedTopics = ['collection1', 'collection1.1', 'collection2'];
      expect(await tab.list.listContent()).toEqual(expectedTopics);
    });
  });
});
