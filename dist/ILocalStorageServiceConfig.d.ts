import INotifyOptions from './INotifyOptions';
interface ILocalStorageServiceConfig {
    notifyOptions?: INotifyOptions;
    prefix?: string;
    storageType?: 'sessionStorage' | 'localStorage';
}
export default ILocalStorageServiceConfig;
