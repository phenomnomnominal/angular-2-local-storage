'use strict';

// Interfaces:
import ILocalStorageEvent from './ILocalStorageEvent';
import ILocalStorageServiceConfigOptions from './ILocalStorageServiceConfigOptions';
import INotifyOptions from './INotifyOptions';

// Angular:
import { Inject, Injectable } from '@angular/core';

// Dependencies:
import { LOCAL_STORAGE_SERVICE_CONFIG_OPTIONS } from './LocalStorageServiceConfigOptions';

// Constants:
const DEPRECATED: string = 'This function is deprecated.';
const LOCAL_STORAGE_NOT_SUPPORTED: string = 'LOCAL_STORAGE_NOT_SUPPORTED';
const NO_OP = () => {};

@Injectable()
export class LocalStorageService {
    public isSupported: boolean = false;

    private notifyOptions: INotifyOptions = {
        setItem: false,
        removeItem: false
    };
    private prefix: string = 'ls';
    private storageType: 'sessionStorage' | 'localStorage' = 'localStorage';
    private webStorage: Storage;

    private onError: (message: string) => void = NO_OP;
    private onRemoveItem: (event: ILocalStorageEvent) => void = NO_OP;
    private onSetItem: (event: ILocalStorageEvent) => void = NO_OP;
    private onWarning: (message: string) => void = NO_OP;

    constructor (
        @Inject(LOCAL_STORAGE_SERVICE_CONFIG_OPTIONS) config: ILocalStorageServiceConfigOptions
    ) {
        let { notifyOptions, prefix, storageType } = config;
        let { onError, onRemoveItem, onSetItem, onWarning } = config;

        if (notifyOptions != null) {
            let { setItem, removeItem } = notifyOptions;
            this.setNotify(setItem, removeItem);
        }
        if (prefix != null) {
           this.setPrefix(prefix);
        }
        if (storageType != null) {
            this.setStorageType(storageType);
        }

        if (onError) {
            this.onError = onError;
        }
        if (onRemoveItem) {
            this.onRemoveItem = onRemoveItem;
        }
        if (onSetItem) {
            this.onSetItem = onSetItem;
        }
        if (onWarning) {
            this.onWarning = onWarning;
        }

        this.isSupported = this.checkSupport();
    }

    public add (key: string, value: any): boolean {
        if (console && console.warn) {
            console.warn(DEPRECATED);
            console.warn('Use `LocalStorageService.set` instead.');
        }

        return this.set(key, value);
    }

    public clearAll (regularExpression: string): boolean {
        // Setting both regular expressions independently
        // Empty strings result in catchall RegExp
        let prefixRegex = !!this.prefix ? new RegExp('^' + this.prefix) : new RegExp('');
        let testRegex = !!regularExpression ? new RegExp(regularExpression) : new RegExp('');

        if (!this.isSupported) {
            this.onWarning(LOCAL_STORAGE_NOT_SUPPORTED);
            return false;
        }

        let prefixLength = this.prefix.length;

        for (let key in this.webStorage) {
            // Only remove items that are for this app and match the regular expression
            if (prefixRegex.test(key) && testRegex.test(key.substr(prefixLength))) {
                try {
                    this.remove(key.substr(prefixLength));
                } catch (e) {
                    this.onError(e.message);
                    return false;
                }
            }
        }
        return true;
    }

    public deriveKey (key: string): string {
        return `${this.prefix}${key}`;
    }

    public get (key: string): any {
        if (!this.isSupported) {
            this.onWarning(LOCAL_STORAGE_NOT_SUPPORTED);
            return false;
        }

        let item = this.webStorage ? this.webStorage.getItem(this.deriveKey(key)) : null;
        // FIXME: not a perfect solution, since a valid 'null' string can't be stored
        if (!item || item === 'null') {
            return null;
        }

        try {
            return JSON.parse(item);
        } catch (e) {
            return item;
        }
    }

    public getStorageType (): string {
        return this.storageType;
    }

    public keys (): Array<string> {
        if (!this.isSupported) {
            this.onWarning(LOCAL_STORAGE_NOT_SUPPORTED);
            return [];
        }

        let prefixLength = this.prefix.length;
        let keys = [];
        for (let key in this.webStorage) {
            // Only return keys that are for this app
            if (key.substr(0, prefixLength) === this.prefix) {
                try {
                    keys.push(key.substr(prefixLength));
                } catch (e) {
                    this.onError(e.message);
                    return [];
                }
            }
        }
        return keys;
    }

    public length (): number {
        let count = 0;
        let storage = this.webStorage;
        for(let i = 0; i < storage.length; i++) {
            if (storage.key(i).indexOf(this.prefix) === 0) {
                count += 1;
            }
        }
        return count;
    }

    public remove (...keys: Array<string>): boolean {
        let result = true;
        keys.forEach((key: string) => {
            if (!this.isSupported) {
                this.onWarning(LOCAL_STORAGE_NOT_SUPPORTED);
                result = false;
            }

            try {
                this.webStorage.removeItem(this.deriveKey(key));
                if (this.notifyOptions.removeItem) {
                    this.onRemoveItem({
                        key: key,
                        storageType: this.storageType
                    });
                }
            } catch (e) {
                this.onError(e.message);
                result = false;
            }
        });
        return result;
    }

    public set (key: string, value: any): boolean {
        // Let's convert `undefined` values to `null` to get the value consistent
        if (value === undefined) {
            value = null;
        } else {
            value = JSON.stringify(value);
        }

        if (!this.isSupported) {
            this.onWarning(LOCAL_STORAGE_NOT_SUPPORTED);
            return false;
        }

        try {
            if (this.webStorage) {
                this.webStorage.setItem(this.deriveKey(key), value);
            }
            if (this.notifyOptions.setItem) {
                this.onSetItem({
                    key: key,
                    newvalue: value,
                    storageType: this.storageType
                });
            }
        } catch (e) {
            this.onError(e.message);
            return false;
        }
        return true;
    }

    private checkSupport (): boolean {
        try {
            let supported = this.storageType in window
                         && window[this.storageType] !== null;

            if (supported) {
                this.webStorage = window[this.storageType];

                // When Safari (OS X or iOS) is in private browsing mode, it
                // appears as though localStorage is available, but trying to
                // call .setItem throws an exception.
                //
                // "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made
                // to add something to storage that exceeded the quota."
                let key = this.deriveKey(`__${Math.round(Math.random() * 1e7)}`);
                this.webStorage.setItem(key, '');
                this.webStorage.removeItem(key);
            }

            return supported;
        } catch (e) {
            this.onError(e.message);
            return false;
        }
    }

    private setPrefix (prefix: string): void {
        this.prefix = prefix;

        // If there is a prefix set in the config let's use that with an appended
        // period for readability:
        const PERIOD: string = '.';
        if (this.prefix && this.prefix.endsWith(PERIOD)) {
            this.prefix = !!this.prefix ? `${this.prefix}${PERIOD}` : '';
        }
    }

    private setStorageType (storageType: 'sessionStorage' | 'localStorage'): void {
        this.storageType = storageType;
    }

    private setNotify (setItem: boolean, removeItem: boolean): void {
        if (setItem != null) {
            this.notifyOptions.setItem = setItem;
        }
        if (removeItem != null) {
            this.notifyOptions.removeItem = removeItem;
        }
    }
}
