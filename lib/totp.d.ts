interface VerifyReturn {
    status: boolean;
    delta?: number;
}
export declare const totp: {
    getQRCode: (key: string) => any;
    hotp: (key: string, count: number) => string;
    hotpVerify: (code: string, key: string, count: number) => VerifyReturn;
    totp: (key: string) => string;
    totpVerify: (code: string, key: string) => VerifyReturn;
};
export {};
