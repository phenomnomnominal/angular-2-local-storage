/// <reference types="core-js" />
import ILocalStorageEvent from './ILocalStorageEvent';
import LocalStorageServiceConfig from './LocalStorageServiceConfig';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
export declare class LocalStorageService {
    isSupported: boolean;
    errors$: Observable<string>;
    removeItems$: Observable<ILocalStorageEvent>;
    setItems$: Observable<ILocalStorageEvent>;
    warnings$: Observable<string>;
    private notifyOptions;
    private prefix;
    private storageType;
    private webStorage;
    private errors;
    private removeItems;
    private setItems;
    private warnings;
    constructor(config: LocalStorageServiceConfig);
    add(key: string, value: any): boolean;
    clearAll(regularExpression: string): boolean;
    deriveKey(key: string): string;
    get<T>(key: string): T;
    getStorageType(): string;
    keys(): Array<string>;
    length(): number;
    remove(...keys: Array<string>): boolean;
    set(key: string, value: any): boolean;
    private checkSupport();
    private setPrefix(prefix);
    private setStorageType(storageType);
    private setNotify(setItem, removeItem);
}
