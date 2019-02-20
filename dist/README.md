# angular-2-local-storage

LocalStorageService for Angular with mostly the same API (and most of the code) from [angular-local-storage](https://github.com/grevory/angular-local-storage).

AoT compatible.

## Differences

* No events broadcast on $rootScope - LocalStorageService exposes observables for `errors$`, `removeItems$`, `setItems$` and `warning$` if you really need something to happen when something happens.
* The `bind` function doesn't work anymore (there is a stub so this can still be a drop-in, but it'll do nothing).

## Install

`npm install angular-2-local-storage`

## Usage

You can optionally configure the module:

```typescript
import { LocalStorageModule } from 'angular-2-local-storage';

@NgModule({
    imports: [
        LocalStorageModule.forRoot({
            prefix: 'my-app',
            storageType: 'localStorage'
        })
    ],
    declarations: [
        ..
    ],
    providers: [
        ..
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

Then you can use it in a component:

```typescript
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
    // ...
})
export class SomeComponent {
    constructor (
        private _localStorageService: LocalStorageService
    ) {
        // YAY!
    }
}

```

### Configuration options

`import { ILocalStorageServiceConfig } from 'angular-2-local-storage';` for type information about the configuration object.
