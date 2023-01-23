let bbStack: BytesType[] = [];

export interface BytesType {
  bytes: Uint8Array;
  offset: number;
  limit: number;
}

export function popByteBuffer() {
  const bb = bbStack.pop();
  if (!bb) return { bytes: new Uint8Array(64), offset: 0, limit: 0 };
  bb.offset = bb.limit = 0;
  return bb;
}

export function toUint8Array(bb: BytesType) {
  let bytes = bb.bytes;
  let limit = bb.limit;
  return bytes.length === limit ? bytes : bytes.subarray(0, limit);
}

export function grow(bb: BytesType, count: number) {
  let bytes = bb.bytes;
  let offset = bb.offset;
  let limit = bb.limit;
  let finalOffset = offset + count;
  if (finalOffset > bytes.length) {
    let newBytes = new Uint8Array(finalOffset * 2);
    newBytes.set(bytes);
    bb.bytes = newBytes;
  }
  bb.offset = finalOffset;
  if (finalOffset > limit) {
    bb.limit = finalOffset;
  }
  return offset;
}

export function advance(bb: BytesType, count: number) {
  let offset = bb.offset;
  if (offset + count > bb.limit) {
    throw new Error('Read past limit');
  }
  bb.offset += count;
  return offset;
}

export function readInt32(bb: BytesType) {
  let offset = advance(bb, 4);
  let bytes = bb.bytes;
  return (
    (bytes[offset] << 24) |
    (bytes[offset + 1] << 16) |
    (bytes[offset + 2] << 8) |
    bytes[offset + 3]
  );
}

export function writeInt32(bb: BytesType, value: number) {
  let offset = grow(bb, 4);
  let bytes = bb.bytes;
  bytes[offset + 3] = value;
  bytes[offset + 2] = value >> 8;
  bytes[offset + 1] = value >> 16;
  bytes[offset] = value >> 24;
}

export function readInt16(bb: BytesType) {
  let offset = advance(bb, 2);
  let bytes = bb.bytes;

  return (bytes[offset] << 8) | bytes[offset + 1];
}

export function writeInt16(bb: BytesType, value: number) {
  let offset = grow(bb, 2);
  let bytes = bb.bytes;
  bytes[offset + 1] = value;
  bytes[offset] = value >> 8;
}

export function readBytes(bb: BytesType, count: number) {
  let offset = advance(bb, count);
  return bb.bytes.subarray(offset, offset + count);
}

export function writeBytes(bb: BytesType, buffer: Buffer) {
  let offset = grow(bb, buffer.length);
  bb.bytes.set(buffer, offset);
}

export function wrapByteBuffer(bytes: Uint8Array) {
  return { bytes, offset: 0, limit: bytes.length };
}
