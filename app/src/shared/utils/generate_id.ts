import { ObjectId } from 'mongodb';

export function generateV4Id() {
  return ouid();
}

function ouid() {
  const caracteresHexadecimais = '0123456789abcdef';
  let s4 = '';

  for (let i = 0; i < 24; i++) {
    s4 += caracteresHexadecimais.charAt(
      Math.floor(Math.random() * caracteresHexadecimais.length),
    );
  }

  return s4;
}

export function generateStringObjectId(): string {
  const objectIdV4 = new ObjectId(generateV4Id());
  return objectIdV4.toHexString();
}

export function stringToObjectId(id: string): ObjectId {
  return new ObjectId(id);
}

export function objectIdToString(objectId: ObjectId): string {
  return objectId.toHexString();
}
