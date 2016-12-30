import { ISearchResult } from './isearch-result';

export interface ISearchResultProvider {
  getPrefix(): string;
  search(query: string): Promise<ISearchResult>;
}
