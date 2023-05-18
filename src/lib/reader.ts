export class DataReader {
    public viewer: DataView;
    public currentByte: number;

    public constructor(viewer: DataView) {
        this.viewer = viewer;
        this.currentByte = 0;
    }

    /**
     * Reads a signed byte from the buffer and advances the current byte by 1.
     */
    public readByte() {
        const result = (this.viewer.getInt8 as any)(this.currentByte, true);

        this.currentByte += 1;

        return result;
    }

    /**
     * Reads an unsigned byte form the buffer and advances the current byte by 1.
     */
    public readUnsignedByte() {
        const result = (this.viewer.getUint8 as any)(this.currentByte, true);

        this.currentByte += 1;

        return result;
    }

    /**
     * Reads a signed 2 byte number (eg. a short) from the buffer and advanced the current byte by 2.
     */
    public readShort() {
        const result = this.viewer.getInt16(this.currentByte, true);

        this.currentByte += 2;

        return result;
    }

    /**
     * Reads a signed 4 byte number (eg. an integer) from the buffer and advanced the current byte by 4.
     */
    public readInt() {
        const result = this.viewer.getInt32(this.currentByte, true);

        this.currentByte += 4;

        return result;
    }

    /**
     * Reads a string from the buffer and advanced the current byte until the end of the string.
     * Strings begin with a signed integer (the length), followed by that many bytes of the string's data.
     */
    public readString() {
        const length = this.readInt();

        let result = "";

        for (let i = 0; i < length; i++) {
            const byte = this.readUnsignedByte();

            result += String.fromCharCode(byte);
        }

        return result;
    }
}
