export interface ILocalStorageEvent {
    key: string;
    // Probably a typo, but keeping to stay consistent with
    // angular-local-storage:
    newvalue?: any;
    storageType: string;
}

