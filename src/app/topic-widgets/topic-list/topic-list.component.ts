import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Topic} from '../../core/models/topic';
import {IteratorListPager} from '../../shared/list/iterator-list-pager';

@Component({
  selector: 'xgb-topics',
  templateUrl: './topic-list.component.html'
})
export class TopicListComponent {
  @Input() topicList: IteratorListPager<Topic>;
  @Output() topicClicked = new EventEmitter<Topic>();

  topicClick(node: Topic) {
    this.topicClicked.next(node);
  }

}
