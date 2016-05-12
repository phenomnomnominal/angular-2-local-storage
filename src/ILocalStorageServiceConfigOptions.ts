'use strict';

// Interfaces:
import ILocalStorageEvent from './ILocalStorageEvent';
import INotifyOptions from './INotifyOptions';

interface ILocalStorageServiceConfigOptions {
    // Properties:
    notifyOptions?: INotifyOptions;
    prefix?: string;
    storageType?: 'sessionStorage' | 'localStorage';

    // Event handlers:
    onError? (message: string): void;
    onRemoveItem? (event: ILocalStorageEvent): void;
    onSetItem? (event: ILocalStorageEvent): void;
    onWarning? (message: string): void;
}

export default ILocalStorageServiceConfigOptions;
