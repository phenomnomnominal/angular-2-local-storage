import { INotifyOptions } from './notify-options.interface';

export interface ILocalStorageServiceConfig {
    // Properties:
    notifyOptions?: INotifyOptions;
    prefix?: string;
    storageType?: 'sessionStorage' | 'localStorage';
}
