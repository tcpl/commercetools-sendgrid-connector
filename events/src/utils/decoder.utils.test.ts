import { decodeToJson } from './decoder.utils';

describe('decoder utils', () => {
  describe('decodeToJson', () => {
    it('should decode base64 encoded JSON string to object', () => {
      const testObject = { name: 'test', value: 123 };
      const encoded = Buffer.from(JSON.stringify(testObject)).toString(
        'base64'
      );

      const result = decodeToJson(encoded);

      expect(result).toEqual(testObject);
    });

    it('should throw error when input is not valid base64', () => {
      expect(() => {
        decodeToJson('not-valid-base64');
      }).toThrow();
    });

    it('should throw error when decoded string is not valid JSON', () => {
      const encoded = Buffer.from('not-valid-json').toString('base64');

      expect(() => {
        decodeToJson(encoded);
      }).toThrow();
    });

    it('should handle empty object', () => {
      const encoded = Buffer.from('{}').toString('base64');

      const result = decodeToJson(encoded);

      expect(result).toEqual({});
    });
  });
});
