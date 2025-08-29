import { OwnerRezClient } from '../../../api/ownerrez-client';
import { getConfig } from '../../../utils/config';

exports.command = 'create';
exports.desc = 'Create a new guest';
exports.builder = {
  'first-name': {
    describe: 'Guest\'s first name',
    type: 'string',
    demandOption: true,
  },
  'last-name': {
    describe: 'Guest\'s last name',
    type: 'string',
    demandOption: true,
  },
  email: {
    describe: 'Guest\'s email address',
    type: 'string',
    demandOption: true,
  },
  phone: {
    describe: 'Guest\'s phone number',
    type: 'string',
  },
};

exports.handler = async (argv) => {
  const config = getConfig();
  const client = new OwnerRezClient(config);

  const guestData = {
    first_name: argv.firstName,
    last_name: argv.lastName,
    email: argv.email,
    phone: argv.phone,
  };

  try {
    const newGuest = await client.createGuest(guestData);
    console.log('Successfully created guest:');
    console.log(JSON.stringify(newGuest, null, 2));
  } catch (error) {
    console.error(`Error creating guest: ${error.message}`);
  }
};