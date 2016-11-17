import { OpaqueToken } from '@angular/core';
import ILocalStorageServiceConfig from "./ILocalStorageServiceConfig";
import INotifyOptions from "./INotifyOptions";
export default class LocalStorageServiceConfig implements ILocalStorageServiceConfig {
    notifyOptions: INotifyOptions;
    prefix: string;
    storageType: 'sessionStorage' | 'localStorage';
}
export declare const LOCAL_STORAGE_SERVICE_CONFIG: OpaqueToken;
