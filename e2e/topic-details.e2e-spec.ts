import {browser} from 'protractor';
import {TopicDetailsConfigurationTab, TopicDetailsPage} from './page-objects/topic-details.po';
import {Spinner} from './page-elements/spinner';
import {ToastContent} from './page-elements/toast';


fdescribe('TopicDetails', () => {
  const defaultTopicId = 'topic1.1';
  let page: TopicDetailsPage;

  beforeEach(async () => {
    page = new TopicDetailsPage(defaultTopicId);
    await page.navigateTo();
  });

  it('should go to the default tab on launch', () => {
    expect(browser.getCurrentUrl()).toEqual(page.tab.fullUrl);
  });

  it('should have the topics id as title', async () => {
    expect(await page.getTitle()).toBe(defaultTopicId);
  });

  describe('TopicDetailsConfigurationTab', () => {
    let tab: TopicDetailsConfigurationTab;

    beforeEach(async () => {
      tab = new TopicDetailsConfigurationTab(defaultTopicId, page);
      await page.navigateToTab(tab);
    });

    it('should have the tabs url', () => {
      expect(browser.getCurrentUrl()).toEqual(page.tab.fullUrl);
    });

    it('should have a current topic id input', async () => {
      expect(await tab.form.getFieldValue('nodeID')).toBe(defaultTopicId);
    });

    it('should save a new topic title', async () => {
      const titleValue = 'julietta';
      await tab.form.setFieldValue('title', titleValue);
      await tab.formSubmit();
      await Spinner.waitOnNone();

      const toastContents = await tab.toast.messages;
      expect(toastContents.length).toBe(1);
      expect(await toastContents[0]).toEqual(new ToastContent(
        'Form successfully updated!',
        true
      ));
      expect(await tab.form.getFieldValue('nodeID')).toEqual(defaultTopicId);
      expect(await tab.form.getFieldValue('title')).toEqual(titleValue);
    });

  });
});
