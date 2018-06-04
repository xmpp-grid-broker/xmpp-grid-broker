import {ErrorToString} from '../../core';

/**
 * This class abstracts the loading and error handling
 * to simplify the usage of the a paged list ("load more").
 *
 * It accepts an async iterator of for the type T that will be rendered.
 */
export class IteratorListPager<T> {
  isLoaded = false;
  hasError = false;
  errorMessage: string;
  items: T[];
  hasMore: boolean;

  private iterator: AsyncIterableIterator<T>;
  private errorHandler: (error: any) => string;
  private readonly PAGE_SIZE = 10;


  public useIterator(iterator: AsyncIterableIterator<T>): Promise<void> {
    this.iterator = iterator;
    this.items = [];
    this.hasMore = false;
    this.errorMessage = undefined;
    this.errorHandler = ErrorToString;
    return this.loadMore();
  }

  // TODO: DO ERROR HANDLING IN SERVICES INSTEAD!
  public useErrorMapper(errorHandler: (error: any) => string) {
    this.errorHandler = errorHandler;
  }

  public loadMore(): Promise<void> {
    this.isLoaded = false;
    this.hasError = false;
    return this.loadNextPage()
      .then((loadedItems) => {
        this.items.push(...loadedItems);
        this.isLoaded = true;
      })
      .catch((error) => {
        this.hasError = true;
        this.errorMessage = this.errorHandler(error);
      });
  }

  private async loadNextPage(): Promise<T[]> {
    const unresolvedIterators = [];
    for (let i = 0; i < this.PAGE_SIZE; i++) {
      unresolvedIterators.push(this.iterator.next());
    }
    const result = [];
    const resolvedIterators = await Promise.all(unresolvedIterators);
    for (const next of resolvedIterators) {
      if (next.done) {
        this.hasMore = false;
        break;
      }
      result.push(next.value);
      this.hasMore = true;
    }

    return result;
  }
}
