import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TopicChooserComponent} from './topic-chooser.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';

describe('TopicChooserComponent', () => {
  let component: TopicChooserComponent;
  let fixture: ComponentFixture<TopicChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [TopicChooserComponent]
    });
  }));

  const getTopicItemsElement = (): any[] => {
    return fixture.debugElement.query(By.css('.topic-items')).nativeElement.children;
  };
  const getAddButton = (): HTMLButtonElement => {
    return fixture.debugElement.nativeElement.querySelector('button[type=submit]');
  };
  const getInputField = (): HTMLInputElement => {
    return fixture.debugElement.nativeElement.querySelector('input[type=text]');
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicChooserComponent);
    component = fixture.componentInstance;
    component.writeValue('Topic#1\nTopic#2');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should render all topics on bind', () => {
    const topicItemsElement = getTopicItemsElement();

    expect(topicItemsElement.length).toBe(2 * 2); // 2 topics + 2 buttons
    expect(topicItemsElement[0].innerText).toBe('Topic#1');
    expect(topicItemsElement[2].innerText).toBe('Topic#2');

  });

  it('it should remove a topic when remove is clicked', () => {
    component.registerOnChange(() => {
    });

    const removeButton = getTopicItemsElement()[1].querySelector('button');
    removeButton.click();

    fixture.detectChanges();
    expect(getTopicItemsElement().length).toBe(2);

  });

  it('it should notify OnChangeFn when item is removed', (done) => {
    component.registerOnChange((arg) => {
      const topics = arg.split('\n');
      expect(topics.length).toBe(1);
      expect(topics).toContain('Topic#1');
      done();
    });

    const removeButton = getTopicItemsElement()[3].querySelector('button');
    removeButton.click();

    fixture.detectChanges();
  });

  it('it should add a topic when add is clicked', () => {
    component.registerOnChange(() => {
    });

    const inputField = getInputField();
    inputField.value = 'Topic#3';
    inputField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    getAddButton().click();
    fixture.detectChanges();
    expect(getTopicItemsElement().length).toBe(6);
    expect(getTopicItemsElement()[4].innerText).toBe('Topic#3');

  });


  it('it should notify OnChangeFn when new item is added', (done) => {
    component.registerOnChange((arg) => {
      const topics = arg.split('\n');
      expect(topics.length).toBe(3);
      expect(topics[0]).toBe('Topic#1');
      expect(topics[1]).toBe('Topic#2');
      expect(topics[2]).toBe('Topic#3');
      done();
    });

    expect(getAddButton().disabled).toBe(true);

    const inputField = getInputField();
    inputField.value = 'Topic#3';
    inputField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(getAddButton().disabled).toBe(false);
    getAddButton().click();
    fixture.detectChanges();

  });

  it('it should prevent adding duplicates', () => {
    component.registerOnChange(() => {
      fail();
    });

    const inputField = getInputField();
    inputField.value = 'Topic#1';
    inputField.dispatchEvent(new Event('input'));
    inputField.dispatchEvent(new Event('textInput'));
    fixture.detectChanges();

    getAddButton().click();
    fixture.detectChanges();
    expect(getTopicItemsElement().length).toBe(4); // still 4 elements..
  });
});
