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
  items: T[] = [];
  hasMore: boolean;

  private iterator: AsyncIterableIterator<T>;
  private errorHandler: (error: any) => string;
  private readonly PAGE_SIZE = 10;


  public useIterator(iterator: AsyncIterableIterator<T>) {
    this.iterator = iterator;
    this.hasMore = false;
    this.loadMore();
  }

  public useErrorMapper(errorHandler: (error: any) => string) {
    this.errorHandler = errorHandler;
  }

  public loadMore() {
    this.isLoaded = false;
    this.hasError = false;
    this.loadNextPage()
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
    const unresolvedItrs = [];
    for (let i = 0; i < this.PAGE_SIZE; i++) {
      unresolvedItrs.push(this.iterator.next());
    }
    const result = [];
    const resolvedItrs = await Promise.all(unresolvedItrs);
    for (const next of resolvedItrs) {
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
