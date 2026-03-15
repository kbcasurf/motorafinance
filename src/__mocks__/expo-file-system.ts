export const cacheDirectory = '/tmp/';
export const EncodingType = { UTF8: 'utf8', Base64: 'base64' };
export const writeAsStringAsync = jest.fn().mockResolvedValue(undefined);
export const readAsStringAsync = jest.fn().mockResolvedValue('');
export const deleteAsync = jest.fn().mockResolvedValue(undefined);
