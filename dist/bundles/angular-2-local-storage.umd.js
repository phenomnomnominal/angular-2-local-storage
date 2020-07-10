(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('angular-2-local-storage', ['exports', '@angular/core', 'rxjs', 'rxjs/operators'], factory) :
    (global = global || self, factory(global['angular-2-local-storage'] = {}, global.ng.core, global.rxjs, global.rxjs.operators));
}(this, (function (exports, i0, rxjs, operators) { 'use strict';

    var LOCAL_STORAGE_SERVICE_CONFIG = new i0.InjectionToken('LOCAL_STORAGE_SERVICE_CONFIG');

    var LocalStorageModule = /** @class */ (function () {
        function LocalStorageModule() {
        }
        LocalStorageModule.forRoot = function (userConfig) {
            if (userConfig === void 0) { userConfig = {}; }
            return {
                ngModule: LocalStorageModule,
                providers: [
                    { provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: userConfig }
                ]
            };
        };
        return LocalStorageModule;
    }());
    LocalStorageModule.decorators = [
        { type: i0.NgModule }
    ];

    var DEPRECATED = 'This function is deprecated.';
    var LOCAL_STORAGE_NOT_SUPPORTED = 'LOCAL_STORAGE_NOT_SUPPORTED';
    var LocalStorageService = /** @class */ (function () {
        function LocalStorageService(config) {
            var _this = this;
            if (config === void 0) { config = {}; }
            this.isSupported = false;
            this.notifyOptions = {
                setItem: false,
                removeItem: false
            };
            this.prefix = 'ls';
            this.storageType = 'localStorage';
            this.errors = new rxjs.Subscriber();
            this.removeItems = new rxjs.Subscriber();
            this.setItems = new rxjs.Subscriber();
            this.warnings = new rxjs.Subscriber();
            var notifyOptions = config.notifyOptions, prefix = config.prefix, storageType = config.storageType;
            if (notifyOptions != null) {
                var setItem = notifyOptions.setItem, removeItem = notifyOptions.removeItem;
                this.setNotify(!!setItem, !!removeItem);
            }
            if (prefix != null) {
                this.setPrefix(prefix);
            }
            if (storageType != null) {
                this.setStorageType(storageType);
            }
            this.errors$ = new rxjs.Observable(function (observer) { return _this.errors = observer; }).pipe(operators.share());
            this.removeItems$ = new rxjs.Observable(function (observer) { return _this.removeItems = observer; }).pipe(operators.share());
            this.setItems$ = new rxjs.Observable(function (observer) { return _this.setItems = observer; }).pipe(operators.share());
            this.warnings$ = new rxjs.Observable(function (observer) { return _this.warnings = observer; }).pipe(operators.share());
            this.isSupported = this.checkSupport();
        }
        LocalStorageService.prototype.add = function (key, value) {
            if (console && console.warn) {
                console.warn(DEPRECATED);
                console.warn('Use `LocalStorageService.set` instead.');
            }
            return this.set(key, value);
        };
        LocalStorageService.prototype.clearAll = function (regularExpression) {
            // Setting both regular expressions independently
            // Empty strings result in catchall RegExp
            var prefixRegex = !!this.prefix ? new RegExp('^' + this.prefix) : new RegExp('');
            var testRegex = !!regularExpression ? new RegExp(regularExpression) : new RegExp('');
            if (!this.isSupported) {
                this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
                return false;
            }
            var prefixLength = this.prefix.length;
            for (var key in this.webStorage) {
                // Only remove items that are for this app and match the regular expression
                if (prefixRegex.test(key) && testRegex.test(key.substr(prefixLength))) {
                    try {
                        this.remove(key.substr(prefixLength));
                    }
                    catch (e) {
                        this.errors.next(e.message);
                        return false;
                    }
                }
            }
            return true;
        };
        LocalStorageService.prototype.deriveKey = function (key) {
            return "" + this.prefix + key;
        };
        LocalStorageService.prototype.get = function (key) {
            if (!this.isSupported) {
                this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
                return null;
            }
            var item = this.webStorage ? this.webStorage.getItem(this.deriveKey(key)) : null;
            // FIXME: not a perfect solution, since a valid 'null' string can't be stored
            if (!item || item === 'null') {
                return null;
            }
            try {
                return JSON.parse(item);
            }
            catch (e) {
                return null;
            }
        };
        LocalStorageService.prototype.getStorageType = function () {
            return this.storageType;
        };
        LocalStorageService.prototype.keys = function () {
            if (!this.isSupported) {
                this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
                return [];
            }
            var prefixLength = this.prefix.length;
            var keys = [];
            for (var key in this.webStorage) {
                // Only return keys that are for this app
                if (key.substr(0, prefixLength) === this.prefix) {
                    try {
                        keys.push(key.substr(prefixLength));
                    }
                    catch (e) {
                        this.errors.next(e.message);
                        return [];
                    }
                }
            }
            return keys;
        };
        LocalStorageService.prototype.length = function () {
            var count = 0;
            var storage = this.webStorage;
            for (var i = 0; i < storage.length; i++) {
                if (storage.key(i).indexOf(this.prefix) === 0) {
                    count += 1;
                }
            }
            return count;
        };
        LocalStorageService.prototype.remove = function () {
            var _this = this;
            var keys = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                keys[_i] = arguments[_i];
            }
            var result = true;
            keys.forEach(function (key) {
                if (!_this.isSupported) {
                    _this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
                    result = false;
                }
                try {
                    _this.webStorage.removeItem(_this.deriveKey(key));
                    if (_this.notifyOptions.removeItem) {
                        _this.removeItems.next({
                            key: key,
                            storageType: _this.storageType
                        });
                    }
                }
                catch (e) {
                    _this.errors.next(e.message);
                    result = false;
                }
            });
            return result;
        };
        LocalStorageService.prototype.set = function (key, value) {
            // Let's convert `undefined` values to `null` to get the value consistent
            if (value === undefined) {
                value = null;
            }
            else {
                value = JSON.stringify(value);
            }
            if (!this.isSupported) {
                this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
                return false;
            }
            try {
                if (this.webStorage) {
                    this.webStorage.setItem(this.deriveKey(key), value);
                }
                if (this.notifyOptions.setItem) {
                    this.setItems.next({
                        key: key,
                        newvalue: value,
                        storageType: this.storageType
                    });
                }
            }
            catch (e) {
                this.errors.next(e.message);
                return false;
            }
            return true;
        };
        LocalStorageService.prototype.checkSupport = function () {
            try {
                var supported = this.storageType in window
                    && window[this.storageType] !== null;
                if (supported) {
                    this.webStorage = window[this.storageType];
                    // When Safari (OS X or iOS) is in private browsing mode, it
                    // appears as though localStorage is available, but trying to
                    // call .setItem throws an exception.
                    //
                    // "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made
                    // to add something to storage that exceeded the quota."
                    var key = this.deriveKey("__" + Math.round(Math.random() * 1e7));
                    this.webStorage.setItem(key, '');
                    this.webStorage.removeItem(key);
                }
                return supported;
            }
            catch (e) {
                this.errors.next(e.message);
                return false;
            }
        };
        LocalStorageService.prototype.setPrefix = function (prefix) {
            this.prefix = prefix;
            // If there is a prefix set in the config let's use that with an appended
            // period for readability:
            var PERIOD = '.';
            if (this.prefix && !this.prefix.endsWith(PERIOD)) {
                this.prefix = !!this.prefix ? "" + this.prefix + PERIOD : '';
            }
        };
        LocalStorageService.prototype.setStorageType = function (storageType) {
            this.storageType = storageType;
        };
        LocalStorageService.prototype.setNotify = function (setItem, removeItem) {
            if (setItem != null) {
                this.notifyOptions.setItem = setItem;
            }
            if (removeItem != null) {
                this.notifyOptions.removeItem = removeItem;
            }
        };
        return LocalStorageService;
    }());
    LocalStorageService.ɵprov = i0.ɵɵdefineInjectable({ factory: function LocalStorageService_Factory() { return new LocalStorageService(i0.ɵɵinject(LOCAL_STORAGE_SERVICE_CONFIG, 8)); }, token: LocalStorageService, providedIn: "root" });
    LocalStorageService.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    LocalStorageService.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [LOCAL_STORAGE_SERVICE_CONFIG,] }] }
    ]; };

    /**
     * Generated bundle index. Do not edit.
     */

    exports.LocalStorageModule = LocalStorageModule;
    exports.LocalStorageService = LocalStorageService;
    exports.ɵa = LOCAL_STORAGE_SERVICE_CONFIG;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angular-2-local-storage.umd.js.map
