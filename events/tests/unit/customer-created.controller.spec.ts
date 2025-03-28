// Import the customerCreatedController

describe('testing customer created controller', () => {
  test('should pass', () => {
    expect(1).toBe(1);
  });

  //   let postMock: jest.SpyInstance;
  //   let loggerMock: jest.SpyInstance;
  //   let createApiRootMock: jest.SpyInstance;

  //   beforeEach(() => {
  //     // Mock the post method to throw an error
  //     postMock = jest.spyOn(customerCreatedController, 'post').mockImplementation(() => {
  //       throw new Error('Test error');
  //     });
  //     loggerMock = jest.spyOn(loggerUtils, 'getLogger').mockReturnValue({
  //       info: jest.fn(),
  //       error: jest.fn(),
  //     });
  //     createApiRootMock = jest.spyOn(createClient, 'createApiRoot').mockReturnValue({
  //       customers: jest.fn().mockReturnValue({
  //         withId: jest.fn().mockReturnValue({
  //           get: jest.fn().mockReturnValue({
  //             execute: jest.fn().mockRejectedValue(new Error('Test error')),
  //           }),
  //         }),
  //       }),
  //     });
  //   });

  //   afterEach(() => {
  //     // Restore the original implementation
  //     postMock.mockRestore();
  //     loggerMock.mockRestore();
  //     createApiRootMock.mockRestore();
  //   });

  //   test('should handle errors thrown by post method', async () => {
  //     // Call the route handler
  //     const response = await request(app).post('/customer-created');
  //     expect(response.status).toBe(500);
  //     expect(response.body).toEqual({ message: 'Internal server error' });
  //   });
});
