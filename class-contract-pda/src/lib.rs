use std::iter;

use solana_program::{
    account_info::{AccountInfo, next_account_info},
    entrypoint::{self, ProgramResult},
    pubkey::Pubkey,
    stake::instruction::create_account,
    system_program,
};

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    //create a new pda onchain
    //pda,useracc, systemProgram
    let iter = &mut accounts.iter();
    let pda = next_account_info(iter)?;
    let user_account = next_account_info(iter)?;
    let system_program = next_account_info(iter)?;

    let seeds = &[user_account.key.as_ref(), b"user"];

    let ix = create_account(user_account.key, pda.key, 1000000000, 8, program_id);
    invoke_signed(&ix, accounts, &[&seeds])?;
    Ok(())
}
