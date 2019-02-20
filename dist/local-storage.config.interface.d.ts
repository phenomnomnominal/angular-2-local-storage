import { INotifyOptions } from './notify-options.interface';
import { InjectionToken } from '@angular/core';
export declare const LOCAL_STORAGE_SERVICE_CONFIG: InjectionToken<string>;
export interface ILocalStorageServiceConfig {
    notifyOptions?: INotifyOptions;
    prefix?: string;
    storageType?: 'sessionStorage' | 'localStorage';
}
