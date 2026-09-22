interface DetectedBarcode {
    rawValue: string;
    format: string;
}

declare class BarcodeDetector {
    constructor(options?: { formats?: string[] });
    detect(source: CanvasImageSource): Promise<DetectedBarcode[]>;
    static getSupportedFormats(): Promise<string[]>;
}
