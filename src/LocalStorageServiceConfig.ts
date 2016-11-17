'use strict';

import { OpaqueToken } from '@angular/core';
import ILocalStorageServiceConfig from "./ILocalStorageServiceConfig";
import INotifyOptions from "./INotifyOptions";

export default class LocalStorageServiceConfig implements ILocalStorageServiceConfig {

    public notifyOptions: INotifyOptions;
    public prefix: string;
    public storageType: 'sessionStorage' | 'localStorage';

}

const LOCAL_STORAGE_SERVICE_CONFIG_TOKEN: string = 'LOCAL_STORAGE_SERVICE_CONFIG';
export const LOCAL_STORAGE_SERVICE_CONFIG = new OpaqueToken(LOCAL_STORAGE_SERVICE_CONFIG_TOKEN);
