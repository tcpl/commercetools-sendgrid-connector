export type TestMessageBody = {
  resource: {
    typeId: string;
    id: string;
  };
  notificationType: string;
  data?: object;
};

export const getTestMessage = (body: TestMessageBody) => {
  return {
    message: {
      data: Buffer.from(JSON.stringify(body)).toString('base64'),
    },
  };
};
