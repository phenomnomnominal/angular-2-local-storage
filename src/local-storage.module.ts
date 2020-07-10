import { ModuleWithProviders, NgModule } from '@angular/core';

import { ILocalStorageServiceConfig, LOCAL_STORAGE_SERVICE_CONFIG } from './local-storage.config.interface';

@NgModule()
export class LocalStorageModule {
    static forRoot (userConfig: ILocalStorageServiceConfig = {}): ModuleWithProviders<LocalStorageModule> {
        return {
            ngModule: LocalStorageModule,
            providers: [
                { provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: userConfig }
            ]
        }
    }
}
