declare module "ILocalStorageEvent" {
    interface ILocalStorageEvent {
        key: string;
        newvalue?: any;
        storageType: string;
    }
    export default ILocalStorageEvent;
}
declare module "INotifyOptions" {
    interface INotifyOptions {
        setItem?: boolean;
        removeItem?: boolean;
    }
    export default INotifyOptions;
}
declare module "ILocalStorageServiceConfig" {
    import INotifyOptions from "INotifyOptions";
    interface ILocalStorageServiceConfig {
        notifyOptions?: INotifyOptions;
        prefix?: string;
        storageType?: 'sessionStorage' | 'localStorage';
    }
    export default ILocalStorageServiceConfig;
}
declare module "LocalStorageServiceConfig" {
    import { OpaqueToken } from '@angular/core';
    export const LOCAL_STORAGE_SERVICE_CONFIG: OpaqueToken;
}
declare module "LocalStorageService" {
    import ILocalStorageEvent from "ILocalStorageEvent";
    import ILocalStorageServiceConfig from "ILocalStorageServiceConfig";
    import { Observable } from 'rxjs/Rx';
    export class LocalStorageService {
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
        clearAll(regularExpression: string): boolean;
        deriveKey(key: string): string;
        get(key: string): any;
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
}
declare module "angular-2-local-storage" {
    export { LocalStorageService } from "LocalStorageService";
    export { LOCAL_STORAGE_SERVICE_CONFIG } from "LocalStorageServiceConfig";
}
