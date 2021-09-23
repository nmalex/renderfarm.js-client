export interface IConfig {
    apiKey: string;
    protocol: string;
    host: string;
    port: number;
}

export interface IRenderSettings {
    width: number;
    height: number;
    alpha: boolean;
}

export interface IConvertSettings
{

}

export interface IVraySettings {

}

export interface ICallbacks {
    onStarted: Function,
    onProgress: Function,
    onImageReady: Function,
    onError: Function,
}
