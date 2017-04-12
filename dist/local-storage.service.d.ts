import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import { ILocalStorageEvent } from './local-storage-events.interface';
import { ILocalStorageServiceConfig } from './local-storage.config.interface';
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
    constructor(config: ILocalStorageServiceConfig);
    add(key: string, value: any): boolean;
    clearAll(regularExpression?: string): boolean;
    deriveKey(key: string): string;
    get<T>(key: string): T;
    getStorageType(): string;
    keys(): Array<string>;
    length(): number;
    remove(...keys: Array<string>): boolean;
    set(key: string, value: any): boolean;
    /**
     * Store an transient item in the configured storage type.
     * Transient items can be cleared separatly to other storage items i.e. upon user log out
     */
    setTransient(key: string, value: any): boolean;
    /**
     * Clear all items that were marked as transient
     */
    clearTransientItems(): void;
    private markAsTransient(key);
    private unMarkTransientKey(key);
    private checkSupport();
    private setPrefix(prefix);
    private setStorageType(storageType);
    private setNotify(setItem, removeItem);
}
