'use strict';

// Interfaces:
import INotifyOptions from './INotifyOptions';

interface ILocalStorageServiceConfigOptions {
    // Properties:
    notifyOptions?: INotifyOptions;
    prefix?: string;
    storageType?: 'sessionStorage' | 'localStorage';
}

export default ILocalStorageServiceConfigOptions;
