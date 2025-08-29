import { Command } from 'commander';
import { GuestsCommand } from '../src/cli/commands/guests';

describe('GuestsCommand', () => {
  let program: Command;

  beforeEach(() => {
    program = new Command();
    new GuestsCommand(program);
  });

  it('should list guests', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    await program.parseAsync(['node', 'test', 'guests', 'list']);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should get a guest by id', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    await program.parseAsync(['node', 'test', 'guests', 'get', '123']);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should show an error if no id is provided to get', async () => {
    const consoleSpy = jest.spyOn(console, 'error');
    await program.parseAsync(['node', 'test', 'guests', 'get']);
    expect(consoleSpy).toHaveBeenCalledWith("error: missing required argument 'id'");
  });
});
