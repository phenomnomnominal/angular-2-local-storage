import { INotifyOptions } from './notify-options.interface';
import { InjectionToken } from '@angular/core';

export const LOCAL_STORAGE_SERVICE_CONFIG = new InjectionToken<string>('LOCAL_STORAGE_SERVICE_CONFIG');

export interface ILocalStorageServiceConfig {
    // Properties:
    notifyOptions?: INotifyOptions;
    prefix?: string;
    storageType?: 'sessionStorage' | 'localStorage';
}
