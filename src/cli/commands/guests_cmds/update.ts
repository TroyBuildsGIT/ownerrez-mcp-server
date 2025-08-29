import { OwnerRezClient } from '../../../api/ownerrez-client';
import { config } from '../../../utils/config';

exports.command = 'update <id>';
exports.desc = 'Update a guest\'s information';
exports.builder = (yargs) => {
  yargs
    .positional('id', {
      describe: 'Guest ID to update',
      type: 'number',
    })
    .option('first-name', { describe: "Guest's first name", type: 'string' })
    .option('last-name', { describe: "Guest's last name", type: 'string' })
    .option('email', { describe: "Guest's email address", type: 'string' })
    .option('phone', { describe: "Guest's phone number", type: 'string' });
};

exports.handler = async (argv) => {
  if (isNaN(argv.id)) {
    console.error('Error: ID must be a number.');
    return;
  }

  const client = new OwnerRezClient(config.ownerrez.apiKey, config.ownerrez.baseUrl);

  const updateData: any = {};
  if (argv.firstName) updateData.first_name = argv.firstName;
  if (argv.lastName) updateData.last_name = argv.lastName;
  if (argv.email) updateData.email = argv.email;
  if (argv.phone) updateData.phone = argv.phone;

  if (Object.keys(updateData).length === 0) {
    console.error('Error: At least one field to update must be provided.');
    return;
  }

  try {
    const updatedGuest = await client.updateGuest(argv.id, updateData);
    console.log('Successfully updated guest:');
    console.log(JSON.stringify(updatedGuest, null, 2));
  } catch (error) {
    console.error(`Error updating guest ${argv.id}: ${error.message}`);
  }
};
