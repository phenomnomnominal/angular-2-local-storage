/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { share } from 'rxjs/operators';
import { LOCAL_STORAGE_SERVICE_CONFIG } from './local-storage.config.interface';
import * as i0 from "@angular/core";
import * as i1 from "./local-storage.config.interface";
/** @type {?} */
const DEPRECATED = 'This function is deprecated.';
/** @type {?} */
const LOCAL_STORAGE_NOT_SUPPORTED = 'LOCAL_STORAGE_NOT_SUPPORTED';
export class LocalStorageService {
    /**
     * @param {?=} config
     */
    constructor(config = {}) {
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
        let { notifyOptions, prefix, storageType } = config;
        if (notifyOptions != null) {
            let { setItem, removeItem } = notifyOptions;
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
        (observer) => this.errors = observer)).pipe(share());
        this.removeItems$ = new Observable((/**
         * @param {?} observer
         * @return {?}
         */
        (observer) => this.removeItems = observer)).pipe(share());
        this.setItems$ = new Observable((/**
         * @param {?} observer
         * @return {?}
         */
        (observer) => this.setItems = observer)).pipe(share());
        this.warnings$ = new Observable((/**
         * @param {?} observer
         * @return {?}
         */
        (observer) => this.warnings = observer)).pipe(share());
        this.isSupported = this.checkSupport();
    }
    /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    add(key, value) {
        if (console && console.warn) {
            console.warn(DEPRECATED);
            console.warn('Use `LocalStorageService.set` instead.');
        }
        return this.set(key, value);
    }
    /**
     * @param {?=} regularExpression
     * @return {?}
     */
    clearAll(regularExpression) {
        // Setting both regular expressions independently
        // Empty strings result in catchall RegExp
        /** @type {?} */
        let prefixRegex = !!this.prefix ? new RegExp('^' + this.prefix) : new RegExp('');
        /** @type {?} */
        let testRegex = !!regularExpression ? new RegExp(regularExpression) : new RegExp('');
        if (!this.isSupported) {
            this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
            return false;
        }
        /** @type {?} */
        let prefixLength = this.prefix.length;
        for (let key in this.webStorage) {
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
    }
    /**
     * @param {?} key
     * @return {?}
     */
    deriveKey(key) {
        return `${this.prefix}${key}`;
    }
    /**
     * @template T
     * @param {?} key
     * @return {?}
     */
    get(key) {
        if (!this.isSupported) {
            this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
            return null;
        }
        /** @type {?} */
        let item = this.webStorage ? this.webStorage.getItem(this.deriveKey(key)) : null;
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
    }
    /**
     * @return {?}
     */
    getStorageType() {
        return this.storageType;
    }
    /**
     * @return {?}
     */
    keys() {
        if (!this.isSupported) {
            this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
            return [];
        }
        /** @type {?} */
        let prefixLength = this.prefix.length;
        /** @type {?} */
        let keys = [];
        for (let key in this.webStorage) {
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
    }
    /**
     * @return {?}
     */
    length() {
        /** @type {?} */
        let count = 0;
        /** @type {?} */
        let storage = this.webStorage;
        for (let i = 0; i < storage.length; i++) {
            if (storage.key(i).indexOf(this.prefix) === 0) {
                count += 1;
            }
        }
        return count;
    }
    /**
     * @param {...?} keys
     * @return {?}
     */
    remove(...keys) {
        /** @type {?} */
        let result = true;
        keys.forEach((/**
         * @param {?} key
         * @return {?}
         */
        (key) => {
            if (!this.isSupported) {
                this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
                result = false;
            }
            try {
                this.webStorage.removeItem(this.deriveKey(key));
                if (this.notifyOptions.removeItem) {
                    this.removeItems.next({
                        key: key,
                        storageType: this.storageType
                    });
                }
            }
            catch (e) {
                this.errors.next(e.message);
                result = false;
            }
        }));
        return result;
    }
    /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    set(key, value) {
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
    }
    /**
     * @private
     * @return {?}
     */
    checkSupport() {
        try {
            /** @type {?} */
            let supported = this.storageType in window
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
                let key = this.deriveKey(`__${Math.round(Math.random() * 1e7)}`);
                this.webStorage.setItem(key, '');
                this.webStorage.removeItem(key);
            }
            return supported;
        }
        catch (e) {
            this.errors.next(e.message);
            return false;
        }
    }
    /**
     * @private
     * @param {?} prefix
     * @return {?}
     */
    setPrefix(prefix) {
        this.prefix = prefix;
        // If there is a prefix set in the config let's use that with an appended
        // period for readability:
        /** @type {?} */
        const PERIOD = '.';
        if (this.prefix && !this.prefix.endsWith(PERIOD)) {
            this.prefix = !!this.prefix ? `${this.prefix}${PERIOD}` : '';
        }
    }
    /**
     * @private
     * @param {?} storageType
     * @return {?}
     */
    setStorageType(storageType) {
        this.storageType = storageType;
    }
    /**
     * @private
     * @param {?} setItem
     * @param {?} removeItem
     * @return {?}
     */
    setNotify(setItem, removeItem) {
        if (setItem != null) {
            this.notifyOptions.setItem = setItem;
        }
        if (removeItem != null) {
            this.notifyOptions.removeItem = removeItem;
        }
    }
}
LocalStorageService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
LocalStorageService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [LOCAL_STORAGE_SERVICE_CONFIG,] }] }
];
/** @nocollapse */ LocalStorageService.ngInjectableDef = i0.defineInjectable({ factory: function LocalStorageService_Factory() { return new LocalStorageService(i0.inject(i1.LOCAL_STORAGE_SERVICE_CONFIG, 8)); }, token: LocalStorageService, providedIn: "root" });
if (false) {
    /** @type {?} */
    LocalStorageService.prototype.isSupported;
    /** @type {?} */
    LocalStorageService.prototype.errors$;
    /** @type {?} */
    LocalStorageService.prototype.removeItems$;
    /** @type {?} */
    LocalStorageService.prototype.setItems$;
    /** @type {?} */
    LocalStorageService.prototype.warnings$;
    /**
     * @type {?}
     * @private
     */
    LocalStorageService.prototype.notifyOptions;
    /**
     * @type {?}
     * @private
     */
    LocalStorageService.prototype.prefix;
    /**
     * @type {?}
     * @private
     */
    LocalStorageService.prototype.storageType;
    /**
     * @type {?}
     * @private
     */
    LocalStorageService.prototype.webStorage;
    /**
     * @type {?}
     * @private
     */
    LocalStorageService.prototype.errors;
    /**
     * @type {?}
     * @private
     */
    LocalStorageService.prototype.removeItems;
    /**
     * @type {?}
     * @private
     */
    LocalStorageService.prototype.setItems;
    /**
     * @type {?}
     * @private
     */
    LocalStorageService.prototype.warnings;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWwtc3RvcmFnZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci0yLWxvY2FsLXN0b3JhZ2UvIiwic291cmNlcyI6WyJsb2NhbC1zdG9yYWdlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM5QyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFJdkMsT0FBTyxFQUE4Qiw0QkFBNEIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDOzs7O01BRXRHLFVBQVUsR0FBVyw4QkFBOEI7O01BQ25ELDJCQUEyQixHQUFXLDZCQUE2QjtBQUt6RSxNQUFNLE9BQU8sbUJBQW1COzs7O0lBcUI1QixZQUNzRCxTQUFxQyxFQUFFO1FBckJ0RixnQkFBVyxHQUFZLEtBQUssQ0FBQztRQU81QixrQkFBYSxHQUFtQjtZQUNwQyxPQUFPLEVBQUUsS0FBSztZQUNkLFVBQVUsRUFBRSxLQUFLO1NBQ3BCLENBQUM7UUFDTSxXQUFNLEdBQVcsSUFBSSxDQUFDO1FBQ3RCLGdCQUFXLEdBQXNDLGNBQWMsQ0FBQztRQUdoRSxXQUFNLEdBQXVCLElBQUksVUFBVSxFQUFVLENBQUM7UUFDdEQsZ0JBQVcsR0FBbUMsSUFBSSxVQUFVLEVBQXNCLENBQUU7UUFDcEYsYUFBUSxHQUFtQyxJQUFJLFVBQVUsRUFBc0IsQ0FBQztRQUNoRixhQUFRLEdBQXVCLElBQUksVUFBVSxFQUFVLENBQUM7WUFLeEQsRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxHQUFHLE1BQU07UUFFbkQsSUFBSSxhQUFhLElBQUksSUFBSSxFQUFFO2dCQUNuQixFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsR0FBRyxhQUFhO1lBQzNDLElBQUksQ0FB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QUFHO1FBQzFCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzlDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1NBQ2hFO0lBQ0wsQ0FBQzs7Ozs7O0lBRU8sY0FBYyxDQUFFLFdBQThDO1FBQ2xFLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0lBQ25DLENBQUM7Ozs7Ozs7SUFFTyxTQUFTLENBQUUsT0FBZ0IsRUFBRSxVQUFtQjtRQUNwRCxJQUFJLE9BQU8sSUFBSSxJQUFJLEVBQUU7WUFDakIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1NBQ3hDO1FBQ0QsSUFBSSxVQUFVLElBQUksSUFBSSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztTQUM5QztJQUNMLENBQUM7OztZQXZQSixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckI7Ozs7NENBdUJRLFFBQVEsWUFBSSxNQUFNLFNBQUMsNEJBQTRCOzs7OztJQXJCcEQsMENBQW9DOztJQUVwQyxzQ0FBbUM7O0lBQ25DLDJDQUFvRDs7SUFDcEQsd0NBQWlEOztJQUNqRCx3Q0FBcUM7Ozs7O0lBRXJDLDRDQUdFOzs7OztJQUNGLHFDQUE4Qjs7Ozs7SUFDOUIsMENBQXdFOzs7OztJQUN4RSx5Q0FBNEI7Ozs7O0lBRTVCLHFDQUE4RDs7Ozs7SUFDOUQsMENBQTRGOzs7OztJQUM1Rix1Q0FBd0Y7Ozs7O0lBQ3hGLHVDQUFnRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YnNjcmliZXIgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHNoYXJlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBJTG9jYWxTdG9yYWdlRXZlbnQgfSBmcm9tICcuL2xvY2FsLXN0b3JhZ2UtZXZlbnRzLmludGVyZmFjZSc7XG5pbXBvcnQgeyBJTm90aWZ5T3B0aW9ucyB9IGZyb20gJy4vbm90aWZ5LW9wdGlvbnMuaW50ZXJmYWNlJztcbmltcG9ydCB7IElMb2NhbFN0b3JhZ2VTZXJ2aWNlQ29uZmlnLCBMT0NBTF9TVE9SQUdFX1NFUlZJQ0VfQ09ORklHIH0gZnJvbSAnLi9sb2NhbC1zdG9yYWdlLmNvbmZpZy5pbnRlcmZhY2UnO1xuXG5jb25zdCBERVBSRUNBVEVEOiBzdHJpbmcgPSAnVGhpcyBmdW5jdGlvbiBpcyBkZXByZWNhdGVkLic7XG5jb25zdCBMT0NBTF9TVE9SQUdFX05PVF9TVVBQT1JURUQ6IHN0cmluZyA9ICdMT0NBTF9TVE9SQUdFX05PVF9TVVBQT1JURUQnO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIExvY2FsU3RvcmFnZVNlcnZpY2Uge1xuICAgIHB1YmxpYyBpc1N1cHBvcnRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHVibGljIGVycm9ycyQ6IE9ic2VydmFibGU8c3RyaW5nPjtcbiAgICBwdWJsaWMgcmVtb3ZlSXRlbXMkOiBPYnNlcnZhYmxlPElMb2NhbFN0b3JhZ2VFdmVudD47XG4gICAgcHVibGljIHNldEl0ZW1zJDogT2JzZXJ2YWJsZTxJTG9jYWxTdG9yYWdlRXZlbnQ+O1xuICAgIHB1YmxpYyB3YXJuaW5ncyQ6IE9ic2VydmFibGU8c3RyaW5nPjtcblxuICAgIHByaXZhdGUgbm90aWZ5T3B0aW9uczogSU5vdGlmeU9wdGlvbnMgPSB7XG4gICAgICAgIHNldEl0ZW06IGZhbHNlLFxuICAgICAgICByZW1vdmVJdGVtOiBmYWxzZVxuICAgIH07XG4gICAgcHJpdmF0ZSBwcmVmaXg6IHN0cmluZyA9ICdscyc7XG4gICAgcHJpdmF0ZSBzdG9yYWdlVHlwZTogJ3Nlc3Npb25TdG9yYWdlJyB8ICdsb2NhbFN0b3JhZ2UnID0gJ2xvY2FsU3RvcmFnZSc7XG4gICAgcHJpdmF0ZSB3ZWJTdG9yYWdlOiBTdG9yYWdlO1xuXG4gICAgcHJpdmF0ZSBlcnJvcnM6IFN1YnNjcmliZXI8c3RyaW5nPiA9IG5ldyBTdWJzY3JpYmVyPHN0cmluZz4oKTtcbiAgICBwcml2YXRlIHJlbW92ZUl0ZW1zOiBTdWJzY3JpYmVyPElMb2NhbFN0b3JhZ2VFdmVudD4gPSBuZXcgU3Vic2NyaWJlcjxJTG9jYWxTdG9yYWdlRXZlbnQ+KCkgO1xuICAgIHByaXZhdGUgc2V0SXRlbXM6IFN1YnNjcmliZXI8SUxvY2FsU3RvcmFnZUV2ZW50PiA9IG5ldyBTdWJzY3JpYmVyPElMb2NhbFN0b3JhZ2VFdmVudD4oKTtcbiAgICBwcml2YXRlIHdhcm5pbmdzOiBTdWJzY3JpYmVyPHN0cmluZz4gPSBuZXcgU3Vic2NyaWJlcjxzdHJpbmc+KCk7XG5cbiAgICBjb25zdHJ1Y3RvciAoXG4gICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTE9DQUxfU1RPUkFHRV9TRVJWSUNFX0NPTkZJRykgY29uZmlnOiBJTG9jYWxTdG9yYWdlU2VydmljZUNvbmZpZyA9IHt9XG4gICAgKSB7XG4gICAgICAgIGxldCB7IG5vdGlmeU9wdGlvbnMsIHByZWZpeCwgc3RvcmFnZVR5cGUgfSA9IGNvbmZpZztcblxuICAgICAgICBpZiAobm90aWZ5T3B0aW9ucyAhPSBudWxsKSB7XG4gICAgICAgICAgICBsZXQgeyBzZXRJdGVtLCByZW1vdmVJdGVtIH0gPSBub3RpZnlPcHRpb25zO1xuICAgICAgICAgICAgdGhpcy5zZXROb3RpZnkoISFzZXRJdGVtLCAhIXJlbW92ZUl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcmVmaXggIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5zZXRQcmVmaXgocHJlZml4KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RvcmFnZVR5cGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdG9yYWdlVHlwZShzdG9yYWdlVHlwZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVycm9ycyQgPSBuZXcgT2JzZXJ2YWJsZTxzdHJpbmc+KChvYnNlcnZlcjogU3Vic2NyaWJlcjxzdHJpbmc+KSA9PiB0aGlzLmVycm9ycyA9IG9ic2VydmVyKS5waXBlKHNoYXJlKCkpO1xuICAgICAgICB0aGlzLnJlbW92ZUl0ZW1zJCA9IG5ldyBPYnNlcnZhYmxlPElMb2NhbFN0b3JhZ2VFdmVudD4oKG9ic2VydmVyOiBTdWJzY3JpYmVyPElMb2NhbFN0b3JhZ2VFdmVudD4pID0+IHRoaXMucmVtb3ZlSXRlbXMgPSBvYnNlcnZlcikucGlwZShzaGFyZSgpKTtcbiAgICAgICAgdGhpcy5zZXRJdGVtcyQgPSBuZXcgT2JzZXJ2YWJsZTxJTG9jYWxTdG9yYWdlRXZlbnQ+KChvYnNlcnZlcjogU3Vic2NyaWJlcjxJTG9jYWxTdG9yYWdlRXZlbnQ+KSA9PiB0aGlzLnNldEl0ZW1zID0gb2JzZXJ2ZXIpLnBpcGUoc2hhcmUoKSk7XG4gICAgICAgIHRoaXMud2FybmluZ3MkID0gbmV3IE9ic2VydmFibGU8c3RyaW5nPigob2JzZXJ2ZXI6IFN1YnNjcmliZXI8c3RyaW5nPikgPT4gdGhpcy53YXJuaW5ncyA9IG9ic2VydmVyKS5waXBlKHNoYXJlKCkpO1xuXG4gICAgICAgIHRoaXMuaXNTdXBwb3J0ZWQgPSB0aGlzLmNoZWNrU3VwcG9ydCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGQgKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIGlmIChjb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKERFUFJFQ0FURUQpO1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdVc2UgYExvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0YCBpbnN0ZWFkLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0KGtleSwgdmFsdWUpO1xuICAgIH1cblxuICAgIHB1YmxpYyBjbGVhckFsbCAocmVndWxhckV4cHJlc3Npb24/OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgLy8gU2V0dGluZyBib3RoIHJlZ3VsYXIgZXhwcmVzc2lvbnMgaW5kZXBlbmRlbnRseVxuICAgICAgICAvLyBFbXB0eSBzdHJpbmdzIHJlc3VsdCBpbiBjYXRjaGFsbCBSZWdFeHBcbiAgICAgICAgbGV0IHByZWZpeFJlZ2V4ID0gISF0aGlzLnByZWZpeCA/IG5ldyBSZWdFeHAoJ14nICsgdGhpcy5wcmVmaXgpIDogbmV3IFJlZ0V4cCgnJyk7XG4gICAgICAgIGxldCB0ZXN0UmVnZXggPSAhIXJlZ3VsYXJFeHByZXNzaW9uID8gbmV3IFJlZ0V4cChyZWd1bGFyRXhwcmVzc2lvbikgOiBuZXcgUmVnRXhwKCcnKTtcblxuICAgICAgICBpZiAoIXRoaXMuaXNTdXBwb3J0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMud2FybmluZ3MubmV4dChMT0NBTF9TVE9SQUdFX05PVF9TVVBQT1JURUQpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHByZWZpeExlbmd0aCA9IHRoaXMucHJlZml4Lmxlbmd0aDtcblxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy53ZWJTdG9yYWdlKSB7XG4gICAgICAgICAgICAvLyBPbmx5IHJlbW92ZSBpdGVtcyB0aGF0IGFyZSBmb3IgdGhpcyBhcHAgYW5kIG1hdGNoIHRoZSByZWd1bGFyIGV4cHJlc3Npb25cbiAgICAgICAgICAgIGlmIChwcmVmaXhSZWdleC50ZXN0KGtleSkgJiYgdGVzdFJlZ2V4LnRlc3Qoa2V5LnN1YnN0cihwcmVmaXhMZW5ndGgpKSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKGtleS5zdWJzdHIocHJlZml4TGVuZ3RoKSk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5uZXh0KGUubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHVibGljIGRlcml2ZUtleSAoa2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5wcmVmaXh9JHtrZXl9YDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IDxUPiAoa2V5OiBzdHJpbmcpOiBUIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzU3VwcG9ydGVkKSB7XG4gICAgICAgICAgICB0aGlzLndhcm5pbmdzLm5leHQoTE9DQUxfU1RPUkFHRV9OT1RfU1VQUE9SVEVEKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLndlYlN0b3JhZ2UgPyB0aGlzLndlYlN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmRlcml2ZUtleShrZXkpKSA6IG51bGw7XG4gICAgICAgIC8vIEZJWE1FOiBub3QgYSBwZXJmZWN0IHNvbHV0aW9uLCBzaW5jZSBhIHZhbGlkICdudWxsJyBzdHJpbmcgY2FuJ3QgYmUgc3RvcmVkXG4gICAgICAgIGlmICghaXRlbSB8fCBpdGVtID09PSAnbnVsbCcpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKGl0ZW0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRTdG9yYWdlVHlwZSAoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZVR5cGU7XG4gICAgfVxuXG4gICAgcHVibGljIGtleXMgKCk6IEFycmF5PHN0cmluZz4ge1xuICAgICAgICBpZiAoIXRoaXMuaXNTdXBwb3J0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMud2FybmluZ3MubmV4dChMT0NBTF9TVE9SQUdFX05PVF9TVVBQT1JURUQpO1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHByZWZpeExlbmd0aCA9IHRoaXMucHJlZml4Lmxlbmd0aDtcbiAgICAgICAgbGV0IGtleXM6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMud2ViU3RvcmFnZSkge1xuICAgICAgICAgICAgLy8gT25seSByZXR1cm4ga2V5cyB0aGF0IGFyZSBmb3IgdGhpcyBhcHBcbiAgICAgICAgICAgIGlmIChrZXkuc3Vic3RyKDAsIHByZWZpeExlbmd0aCkgPT09IHRoaXMucHJlZml4KSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAga2V5cy5wdXNoKGtleS5zdWJzdHIocHJlZml4TGVuZ3RoKSk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5uZXh0KGUubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGtleXM7XG4gICAgfVxuXG4gICAgcHVibGljIGxlbmd0aCAoKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgbGV0IHN0b3JhZ2UgPSB0aGlzLndlYlN0b3JhZ2U7XG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBzdG9yYWdlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoc3RvcmFnZS5rZXkoaSkuaW5kZXhPZih0aGlzLnByZWZpeCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBjb3VudCArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3VudDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVtb3ZlICguLi5rZXlzOiBBcnJheTxzdHJpbmc+KTogYm9vbGVhbiB7XG4gICAgICAgIGxldCByZXN1bHQgPSB0cnVlO1xuICAgICAgICBrZXlzLmZvckVhY2goKGtleTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNTdXBwb3J0ZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLndhcm5pbmdzLm5leHQoTE9DQUxfU1RPUkFHRV9OT1RfU1VQUE9SVEVEKTtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0aGlzLndlYlN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmRlcml2ZUtleShrZXkpKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ub3RpZnlPcHRpb25zLnJlbW92ZUl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVJdGVtcy5uZXh0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmFnZVR5cGU6IHRoaXMuc3RvcmFnZVR5cGVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzLm5leHQoZS5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCAoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgLy8gTGV0J3MgY29udmVydCBgdW5kZWZpbmVkYCB2YWx1ZXMgdG8gYG51bGxgIHRvIGdldCB0aGUgdmFsdWUgY29uc2lzdGVudFxuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdmFsdWUgPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuaXNTdXBwb3J0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMud2FybmluZ3MubmV4dChMT0NBTF9TVE9SQUdFX05PVF9TVVBQT1JURUQpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICh0aGlzLndlYlN0b3JhZ2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLndlYlN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmRlcml2ZUtleShrZXkpLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5ub3RpZnlPcHRpb25zLnNldEl0ZW0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEl0ZW1zLm5leHQoe1xuICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgbmV3dmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBzdG9yYWdlVHlwZTogdGhpcy5zdG9yYWdlVHlwZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9ycy5uZXh0KGUubWVzc2FnZSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjaGVja1N1cHBvcnQgKCk6IGJvb2xlYW4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHN1cHBvcnRlZCA9IHRoaXMuc3RvcmFnZVR5cGUgaW4gd2luZG93XG4gICAgICAgICAgICAgICAgICAgICAgICAgICYmIHdpbmRvd1t0aGlzLnN0b3JhZ2VUeXBlXSAhPT0gbnVsbDtcblxuICAgICAgICAgICAgaWYgKHN1cHBvcnRlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMud2ViU3RvcmFnZSA9IHdpbmRvd1t0aGlzLnN0b3JhZ2VUeXBlXTtcblxuICAgICAgICAgICAgICAgIC8vIFdoZW4gU2FmYXJpIChPUyBYIG9yIGlPUykgaXMgaW4gcHJpdmF0ZSBicm93c2luZyBtb2RlLCBpdFxuICAgICAgICAgICAgICAgIC8vIGFwcGVhcnMgYXMgdGhvdWdoIGxvY2FsU3RvcmFnZSBpcyBhdmFpbGFibGUsIGJ1dCB0cnlpbmcgdG9cbiAgICAgICAgICAgICAgICAvLyBjYWxsIC5zZXRJdGVtIHRocm93cyBhbiBleGNlcHRpb24uXG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLyBcIlFVT1RBX0VYQ0VFREVEX0VSUjogRE9NIEV4Y2VwdGlvbiAyMjogQW4gYXR0ZW1wdCB3YXMgbWFkZVxuICAgICAgICAgICAgICAgIC8vIHRvIGFkZCBzb21ldGhpbmcgdG8gc3RvcmFnZSB0aGF0IGV4Y2VlZGVkIHRoZSBxdW90YS5cIlxuICAgICAgICAgICAgICAgIGxldCBrZXkgPSB0aGlzLmRlcml2ZUtleShgX18ke01hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDFlNyl9YCk7XG4gICAgICAgICAgICAgICAgdGhpcy53ZWJTdG9yYWdlLnNldEl0ZW0oa2V5LCAnJyk7XG4gICAgICAgICAgICAgICAgdGhpcy53ZWJTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHN1cHBvcnRlZDtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5lcnJvcnMubmV4dChlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRQcmVmaXggKHByZWZpeDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMucHJlZml4ID0gcHJlZml4O1xuXG4gICAgICAgIC8vIElmIHRoZXJlIGlzIGEgcHJlZml4IHNldCBpbiB0aGUgY29uZmlnIGxldCdzIHVzZSB0aGF0IHdpdGggYW4gYXBwZW5kZWRcbiAgICAgICAgLy8gcGVyaW9kIGZvciByZWFkYWJpbGl0eTpcbiAgICAgICAgY29uc3QgUEVSSU9EOiBzdHJpbmcgPSAnLic7XG4gICAgICAgIGlmICh0aGlzLnByZWZpeCAmJiAhdGhpcy5wcmVmaXguZW5kc1dpdGgoUEVSSU9EKSkge1xuICAgICAgICAgICAgdGhpcy5wcmVmaXggPSAhIXRoaXMucHJlZml4ID8gYCR7dGhpcy5wcmVmaXh9JHtQRVJJT0R9YCA6ICcnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRTdG9yYWdlVHlwZSAoc3RvcmFnZVR5cGU6ICdzZXNzaW9uU3RvcmFnZScgfCAnbG9jYWxTdG9yYWdlJyk6IHZvaWQge1xuICAgICAgICB0aGlzLnN0b3JhZ2VUeXBlID0gc3RvcmFnZVR5cGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXROb3RpZnkgKHNldEl0ZW06IGJvb2xlYW4sIHJlbW92ZUl0ZW06IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgaWYgKHNldEl0ZW0gIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5ub3RpZnlPcHRpb25zLnNldEl0ZW0gPSBzZXRJdGVtO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZW1vdmVJdGVtICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMubm90aWZ5T3B0aW9ucy5yZW1vdmVJdGVtID0gcmVtb3ZlSXRlbTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==