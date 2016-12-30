import { ISearchResult } from './isearch-result';

export interface ISearchManager {
  search(query: string): Promise<ISearchResult>;
}
