const decodeToString = (encodedMessageBody: any) => {
  const buff = Buffer.from(encodedMessageBody, 'base64');
  return buff.toString().trim();
};

export const decodeToJson = (encodedMessageBody: any) => {
  const decodedString = decodeToString(encodedMessageBody);
  return JSON.parse(decodedString);
};
