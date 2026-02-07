declare module 'browser-image-compression' {
    interface Options {
        maxSizeMB?: number;
        maxWidthOrHeight?: number;
        onProgress?: (p: number) => void;
        useWebWorker?: boolean;
        initialQuality?: number;
        alwaysKeepResolution?: boolean;
        fileType?: string;
    }

    function imageCompression(file: File, options: Options): Promise<File>;
    export default imageCompression;
}
