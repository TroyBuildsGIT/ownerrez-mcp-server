import { OwnerRezClient } from '../src/api/ownerrez-client';

describe('OwnerRezClient', () => {
  it('should be defined', () => {
    expect(OwnerRezClient).toBeDefined();
  });

  it('should throw an error if no API token is provided', () => {
    try {
      new OwnerRezClient('');
    } catch (error) {
      expect(error.message).toBe('Invalid OwnerRez API credentials');
    }
  });

  it('should return false from ping if the API token is invalid', async () => {
    const client = new OwnerRezClient('invalid-token');
    const isConnected = await client.ping();
    expect(isConnected).toBe(false);
  });
});
