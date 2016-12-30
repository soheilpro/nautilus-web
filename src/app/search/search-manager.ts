import { ISearchManager } from './isearch-manager';
import { ISearchResult } from './isearch-result';

export class SearchManager implements ISearchManager {
  search(query: string) {
    let searchResult: ISearchResult = {
      items: [{
        type: 'Issue',
        title: 'Sample issue',
        subTitle: 'some text',
      }]
    };

    return Promise.resolve(searchResult);
  }
}
