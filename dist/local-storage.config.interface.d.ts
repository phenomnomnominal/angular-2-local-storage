import { INotifyOptions } from './notify-options.interface';
export interface ILocalStorageServiceConfig {
    notifyOptions?: INotifyOptions;
    prefix?: string;
    storageType?: 'sessionStorage' | 'localStorage';
}
