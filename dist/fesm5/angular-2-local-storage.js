import { InjectionToken, NgModule, Inject, Injectable, Optional, defineInjectable, inject } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { share } from 'rxjs/operators';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var LOCAL_STORAGE_SERVICE_CONFIG = new InjectionToken('LOCAL_STORAGE_SERVICE_CONFIG');

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var LocalStorageModule = /** @class */ (function () {
    function LocalStorageModule() {
    }
    /**
     * @param {?=} userConfig
     * @return {?}
     */
    LocalStorageModule.forRoot = /**
     * @param {?=} userConfig
     * @return {?}
     */
    function (userConfig) {
        if (userConfig === void 0) { userConfig = {}; }
        return {
            ngModule: LocalStorageModule,
            providers: [
                { provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: userConfig }
            ]
        };
    };
    LocalStorageModule.decorators = [
        { type: NgModule }
    ];
    return LocalStorageModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var DEPRECATED = 'This function is deprecated.';
/** @type {?} */
var LOCAL_STORAGE_NOT_SUPPORTED = 'LOCAL_STORAGE_NOT_SUPPORTED';
var LocalStorageService = /** @class */ (function () {
    function LocalStorageService(config) {
        if (config === void 0) { config = {}; }
        var _this = this;
        this.isSupported = false;
        this.notifyOptions = {
            setItem: false,
            removeItem: false
        };
        this.prefix = 'ls';
        this.storageType = 'localStorage';
        this.errors = new Subscriber();
        this.removeItems = new Subscriber();
        this.setItems = new Subscriber();
        this.warnings = new Subscriber();
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
        this.errors$ = new Observable((/**
         * @param {?} observer
         * @return {?}
         */
        function (observer) { return _this.errors = observer; })).pipe(share());
        this.removeItems$ = new Observable((/**
         * @param {?} observer
         * @return {?}
         */
        function (observer) { return _this.removeItems = observer; })).pipe(share());
        this.setItems$ = new Observable((/**
         * @param {?} observer
         * @return {?}
         */
        function (observer) { return _this.setItems = observer; })).pipe(share());
        this.warnings$ = new Observable((/**
         * @param {?} observer
         * @return {?}
         */
        function (observer) { return _this.warnings = observer; })).pipe(share());
        this.isSupported = this.checkSupport();
    }
    /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    LocalStorageService.prototype.add = /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    function (key, value) {
        if (console && console.warn) {
            console.warn(DEPRECATED);
            console.warn('Use `LocalStorageService.set` instead.');
        }
        return this.set(key, value);
    };
    /**
     * @param {?=} regularExpression
     * @return {?}
     */
    LocalStorageService.prototype.clearAll = /**
     * @param {?=} regularExpression
     * @return {?}
     */
    function (regularExpression) {
        // Setting both regular expressions independently
        // Empty strings result in catchall RegExp
        /** @type {?} */
        var prefixRegex = !!this.prefix ? new RegExp('^' + this.prefix) : new RegExp('');
        /** @type {?} */
        var testRegex = !!regularExpression ? new RegExp(regularExpression) : new RegExp('');
        if (!this.isSupported) {
            this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
            return false;
        }
        /** @type {?} */
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
    /**
     * @param {?} key
     * @return {?}
     */
    LocalStorageService.prototype.deriveKey = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        return "" + this.prefix + key;
    };
    /**
     * @template T
     * @param {?} key
     * @return {?}
     */
    LocalStorageService.prototype.get = /**
     * @template T
     * @param {?} key
     * @return {?}
     */
    function (key) {
        if (!this.isSupported) {
            this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
            return null;
        }
        /** @type {?} */
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
    /**
     * @return {?}
     */
    LocalStorageService.prototype.getStorageType = /**
     * @return {?}
     */
    function () {
        return this.storageType;
    };
    /**
     * @return {?}
     */
    LocalStorageService.prototype.keys = /**
     * @return {?}
     */
    function () {
        if (!this.isSupported) {
            this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
            return [];
        }
        /** @type {?} */
        var prefixLength = this.prefix.length;
        /** @type {?} */
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
    /**
     * @return {?}
     */
    LocalStorageService.prototype.length = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var count = 0;
        /** @type {?} */
        var storage = this.webStorage;
        for (var i = 0; i < storage.length; i++) {
            if (storage.key(i).indexOf(this.prefix) === 0) {
                count += 1;
            }
        }
        return count;
    };
    /**
     * @param {...?} keys
     * @return {?}
     */
    LocalStorageService.prototype.remove = /**
     * @param {...?} keys
     * @return {?}
     */
    function () {
        var _this = this;
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        /** @type {?} */
        var result = true;
        keys.forEach((/**
         * @param {?} key
         * @return {?}
         */
        function (key) {
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
        }));
        return result;
    };
    /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    LocalStorageService.prototype.set = /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    function (key, value) {
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
    /**
     * @private
     * @return {?}
     */
    LocalStorageService.prototype.checkSupport = /**
     * @private
     * @return {?}
     */
    function () {
        try {
            /** @type {?} */
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
                /** @type {?} */
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
    /**
     * @private
     * @param {?} prefix
     * @return {?}
     */
    LocalStorageService.prototype.setPrefix = /**
     * @private
     * @param {?} prefix
     * @return {?}
     */
    function (prefix) {
        this.prefix = prefix;
        // If there is a prefix set in the config let's use that with an appended
        // period for readability:
        /** @type {?} */
        var PERIOD = '.';
        if (this.prefix && !this.prefix.endsWith(PERIOD)) {
            this.prefix = !!this.prefix ? "" + this.prefix + PERIOD : '';
        }
    };
    /**
     * @private
     * @param {?} storageType
     * @return {?}
     */
    LocalStorageService.prototype.setStorageType = /**
     * @private
     * @param {?} storageType
     * @return {?}
     */
    function (storageType) {
        this.storageType = storageType;
    };
    /**
     * @private
     * @param {?} setItem
     * @param {?} removeItem
     * @return {?}
     */
    LocalStorageService.prototype.setNotify = /**
     * @private
     * @param {?} setItem
     * @param {?} removeItem
     * @return {?}
     */
    function (setItem, removeItem) {
        if (setItem != null) {
            this.notifyOptions.setItem = setItem;
        }
        if (removeItem != null) {
            this.notifyOptions.removeItem = removeItem;
        }
    };
    LocalStorageService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    LocalStorageService.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [LOCAL_STORAGE_SERVICE_CONFIG,] }] }
    ]; };
    /** @nocollapse */ LocalStorageService.ngInjectableDef = defineInjectable({ factory: function LocalStorageService_Factory() { return new LocalStorageService(inject(LOCAL_STORAGE_SERVICE_CONFIG, 8)); }, token: LocalStorageService, providedIn: "root" });
    return LocalStorageService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { LocalStorageModule, LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG as ɵa };

//# sourceMappingURL=angular-2-local-storage.js.map