const base64url = require('base64url');

function sortTokenByNetwork(tokens) {
  const sortedList = tokens.sort((a, b) => {
    const networkNameA = a.networkId?.name.toLowerCase();
    const networkNameB = b.networkId?.name.toLowerCase();

    if (networkNameA < networkNameB) {
      return -1;
    }
    if (networkNameA > networkNameB) {
      return 1;
    }

    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    return 0;
  });
  return sortedList;
}

function encodeUUIDToBase64(uuid) {
  const buffer = Buffer.from(uuid.replace(/-/g, ''), 'hex');

  const base64String = base64url(buffer);
  return base64String;
}

function decodeBase64ToUUID(base64String) {
  const buffer = base64url.toBuffer(base64String);

  const hexString = buffer.toString('hex');

  const uuid = [hexString.slice(0, 8), hexString.slice(8, 12), hexString.slice(12, 16), hexString.slice(16, 20), hexString.slice(20, 32)].join('-');

  return uuid;
}

module.exports = {
  sortTokenByNetwork,
  encodeUUIDToBase64,
  decodeBase64ToUUID,
};
