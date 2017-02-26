import { IConfiguration } from './iconfiguration';

export interface ISavedConfiguration {
  id: string;
  name: string;
  configuration: IConfiguration;
}
