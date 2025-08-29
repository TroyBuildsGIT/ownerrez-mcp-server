import { OwnerRezClient } from '../../../api/ownerrez-client';
import { config } from '../../../utils/config';

exports.command = 'get <id>';
exports.desc = 'Get a single guest by ID';
exports.builder = (yargs) => {
  yargs.positional('id', {
    describe: 'Guest ID',
    type: 'number',
  });
};

exports.handler = async (argv) => {
  if (isNaN(argv.id)) {
    console.error('Error: ID must be a number.');
    return;
  }

  const client = new OwnerRezClient(config.ownerrez.apiKey, config.ownerrez.baseUrl);

  try {
    const guest = await client.getGuest(argv.id);
    console.log(JSON.stringify(guest, null, 2));
  } catch (error) {
    console.error(`Error getting guest ${argv.id}: ${error.message}`);
  }
};