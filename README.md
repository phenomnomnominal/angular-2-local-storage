# angular-2-local-storage

LocalStorageService for Angular 2 with mostly the same API (and most of the code) from [angular-local-storage](https://github.com/grevory/angular-local-storage)

## Differences:

* No events broadcast on $rootScope - LocalStorageService exposes observables for `errors$`, `removeItems$`, `setItems$` and `warning$` if you really need something to happen when something happens.
* The `bind` function doesn't work anymore (there is a stub so this can still be a drop-in, but it'll do nothing).

## Usage:

First you need to configure the service:

```typescript
import ILocalStorageServiceConfigOptions from './ILocalStorageServiceConfigOptions';
import { LOCAL_STORAGE_SERVICE_CONFIG } from './LocalStorageServiceConfigOptions';
import { LocalStorageService } from './LocalStorageService';

// Create config options (see ILocalStorageServiceConfigOptions) for deets:
let localStorageServiceConfig: ILocalStorageServiceConfigOptions = {
    prefix: 'my-app',
    storageType: 'sessionStorage'
};
// Provide the config to the service:
const LOCAL_STORAGE_CONFIG_PROVIDER: Provider = provide(LOCAL_STORAGE_SERVICE_CONFIG, {
    useValue: localStorageServiceConfig
});

// Use the provider:
bootstrap(AppComponent, [LOCAL_STORAGE_CONFIG_PROVIDER, LocalStorageService]);
```

Then you can use it in a component:

```typescript
import { LocalStorageService } from './shared/LocalStorageService';

@Component({
    // ...
})
export class SomeComponent {
    constructor (
        private localStorageService: LocalStorageService
    ) {
        // YAY!
    }
}

```
