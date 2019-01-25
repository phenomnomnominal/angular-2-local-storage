import { ModuleWithProviders } from '@angular/core';
import { ILocalStorageServiceConfig } from './local-storage.config.interface';
export declare class LocalStorageModule {
    static forRoot(userConfig?: ILocalStorageServiceConfig): ModuleWithProviders;
}
