export default class Util {
    private static base32map;
    static stringToBytes(str: string): number[];
    static bytesToString(bytes: number[]): string;
    static stringToWords(str: string): number[];
    static bytesToWords(bytes: number[]): number[];
    static wordsToBytes(words: number[]): number[];
    static intToBytes(n: number): number[];
    static bytesToHex(bytes: number[]): string;
    static hexToBytes(hex: string): number[];
    static bytesToBase32(bytes: number[]): string;
}
