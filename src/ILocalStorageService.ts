'use strict';

import { Observable } from 'rxjs/Rx';

interface ILocalStorageService {
    // Properties:
    isSupported: boolean;

    // Events:
    errors$: Observable<string>;
    removeItems$: Observable<string>;
    setItems$: Observable<string>;
    warnings$: Observable<string>;

    // Functions:
    clearAll (regularExpression: string): boolean;
    deriveKey (key: string): string;
    get <T> (key: string): T;
    getStorageType (): string;
    keys (): Array<string>;
    length (): number;
    remove (...keys: Array<string>): boolean;
    set (key: string, value: any): boolean;
    bind (): void;

    // Deprecated:
    add (key: string, value: any): boolean;
}

export default ILocalStorageService;
