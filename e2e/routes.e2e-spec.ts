import { AppPage } from './page-objects/app.po';

describe('xmpp-grid-broker App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should redirect to topics page', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
