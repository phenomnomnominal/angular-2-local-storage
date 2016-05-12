'use strict';

interface ILocalStorageService {
    // Properties:
    isSupported: boolean;

    // Functions:
    bind (): void;
    clearAll (regularExpression: string): boolean;
    deriveKey (key: string): string;
    get (key: string): any;
    getStorageType (): string;
    keys (): Array<string>;
    length (): number;
    remove (...keys: Array<string>): boolean;
    set (key: string, value: any): boolean;
    // bind: bindToScope,

    // Deprecated:
    add (key: string, value: any): boolean;
}

export default ILocalStorageService;
