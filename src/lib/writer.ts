export interface IDataWriter {
    writeByte(byte: number): void;
    writeUnsignedByte(byte: number): void;
    writeShort(byte: number): void;
    writeInt(byte: number): void;
    writeString(str: string): void;
}

export class DataWriter implements IDataWriter {
    public dataView: DataView;
    public currentByte: number;

    public constructor(dataView: DataView) {
        this.dataView = dataView;
        this.currentByte = 0;
    }

    public writeByte(byte: number) {
        (this.dataView.setInt8 as any)(this.currentByte, byte, true);
        this.currentByte += 1;
    }

    public writeUnsignedByte(byte: number) {
        (this.dataView.setUint8 as any)(this.currentByte, byte, true);
        this.currentByte += 1;
    }

    public writeShort(short: number) {
        this.dataView.setInt16(this.currentByte, short, true);
        this.currentByte += 2;
    }

    public writeInt(int: number) {
        this.dataView.setInt32(this.currentByte, int, true);
        this.currentByte += 4;
    }

    public writeString(string: string) {
        this.writeInt(string.length);

        for (const i of string) {
            this.writeUnsignedByte(i.charCodeAt(0));
        }
    }
}

export class NoopDataWriter implements IDataWriter {
    public bufferSize: number;

    public constructor() {
        this.bufferSize = 0;
    }

    public writeString(str: string) {
        // 1 byte for each character + 4 bytes for length
        this.bufferSize += str.length + 4;
    }

    public writeByte() {
        this.bufferSize += 1;
    }

    public writeShort() {
        this.bufferSize += 2;
    }

    public writeInt() {
        this.bufferSize += 4;
    }

    public writeUnsignedByte() {
        this.bufferSize += 1;
    }
}
