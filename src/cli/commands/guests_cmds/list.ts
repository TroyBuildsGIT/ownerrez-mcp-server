import { OwnerRezClient } from '../../../api/ownerrez-client';
import { getConfig } from '../../../utils/config';

exports.command = 'list';
exports.desc = 'List all guests';
exports.builder = {
  limit: {
    alias: 'l',
    describe: 'Number of records to return',
    type: 'number',
    default: 20,
  },
  offset: {
    alias: 'o',
    describe: 'Number of records to skip',
    type: 'number',
    default: 0,
  },
};

exports.handler = async (argv) => {
  const config = getConfig();
  const client = new OwnerRezClient(config);

  try {
    const guests = await client.getGuests({
      limit: argv.limit,
      offset: argv.offset,
    });
    console.log(JSON.stringify(guests, null, 2));
  } catch (error) {
    console.error(`Error listing guests: ${error.message}`);
  }
};