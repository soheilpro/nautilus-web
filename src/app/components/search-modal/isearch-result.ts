import { IIssue} from '../../application';

export interface ISearchResult {
  key: string;
  type: string;
  item: IIssue;
}
