# angular-2-local-storage

LocalStorageService for Angular 2 with mostly the same API (and most of the code) from [angular-local-storage](https://github.com/grevory/angular-local-storage)

## Differences:

* No events broadcast on $rootScope - LocalStorageService exposes observables for `errors$`, `removeItems$`, `setItems$` and `warning$` if you really need something to happen when something happens.
* The `bind` function doesn't work anymore (there is a stub so this can still be a drop-in, but it'll do nothing).

## Install:

`npm install angular-2-local-storage`

## Usage:

### With angular-cli:

With the latest angular-cli (WebPack), no config is required.

For older versions (SystemJS based) see the comments here for configuration:
[Issue #20](https://github.com/phenomnomnominal/angular-2-local-storage/issues/20)

### With TypeScript

Nothing to configure, the typings are included in the package.

### In your app:

First you need to configure the service:

```typescript
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';

// Create config options (see ILocalStorageServiceConfigOptions) for deets:
let localStorageServiceConfig = {
    prefix: 'my-app',
    storageType: 'sessionStorage'
};

// Use the provider:
@NgModule({
    imports: [
        ..
    ],
    declarations: [
        ..
    ],
    providers: [
        LocalStorageService,
        {
            provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
    ],
    bootstrap: [AppComponent]
})
```

Then you can use it in a component:

```typescript
import { LocalStorageService } from 'angular-2-local-storage';

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
