/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { LOCAL_STORAGE_SERVICE_CONFIG } from './local-storage.config.interface';
export class LocalStorageModule {
    /**
     * @param {?=} userConfig
     * @return {?}
     */
    static forRoot(userConfig = {}) {
        return {
            ngModule: LocalStorageModule,
            providers: [
                { provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: userConfig }
            ]
        };
    }
}
LocalStorageModule.decorators = [
    { type: NgModule }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWwtc3RvcmFnZS5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLTItbG9jYWwtc3RvcmFnZS8iLCJzb3VyY2VzIjpbImxvY2FsLXN0b3JhZ2UubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQXVCLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU5RCxPQUFPLEVBQThCLDRCQUE0QixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFHNUcsTUFBTSxPQUFPLGtCQUFrQjs7Ozs7SUFDM0IsTUFBTSxDQUFDLE9BQU8sQ0FBRSxhQUF5QyxFQUFFO1FBQ3ZELE9BQU87WUFDSCxRQUFRLEVBQUUsa0JBQWtCO1lBQzVCLFNBQVMsRUFBRTtnQkFDUCxFQUFFLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFO2FBQ2xFO1NBQ0osQ0FBQTtJQUNMLENBQUM7OztZQVRKLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBJTG9jYWxTdG9yYWdlU2VydmljZUNvbmZpZywgTE9DQUxfU1RPUkFHRV9TRVJWSUNFX0NPTkZJRyB9IGZyb20gJy4vbG9jYWwtc3RvcmFnZS5jb25maWcuaW50ZXJmYWNlJztcblxuQE5nTW9kdWxlKClcbmV4cG9ydCBjbGFzcyBMb2NhbFN0b3JhZ2VNb2R1bGUge1xuICAgIHN0YXRpYyBmb3JSb290ICh1c2VyQ29uZmlnOiBJTG9jYWxTdG9yYWdlU2VydmljZUNvbmZpZyA9IHt9KTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBuZ01vZHVsZTogTG9jYWxTdG9yYWdlTW9kdWxlLFxuICAgICAgICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgICAgICAgICAgeyBwcm92aWRlOiBMT0NBTF9TVE9SQUdFX1NFUlZJQ0VfQ09ORklHLCB1c2VWYWx1ZTogdXNlckNvbmZpZyB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=