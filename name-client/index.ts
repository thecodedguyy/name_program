import {
    Keypair,
    Connection,
    LAMPORTS_PER_SOL,
    SystemProgram,
    Transaction
  } from "@solana/web3.js";
  
  const connection = new Connection("http://127.0.0.1:8899");
  
  async function main() {
    const keypair = Keypair.generate();       // payer
    const dataAccount = Keypair.generate();   // new account
  
    // Airdrop SOL
    const signature = await connection.requestAirdrop(
      keypair.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(signature);
  
    // Create new account owned by System Program
    const instruction = SystemProgram.createAccount({
      fromPubkey: keypair.publicKey,
      newAccountPubkey: dataAccount.publicKey, 
      lamports: 1 * LAMPORTS_PER_SOL,
      space: 8,
      programId: SystemProgram.programId,
    });
  
    const tx = new Transaction().add(instruction);
    tx.feePayer = keypair.publicKey;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  
    // Must sign with BOTH:
    // - payer (keypair)
    // - new account (dataAccount)
    await connection.sendTransaction(tx, [keypair, dataAccount]);
  
    console.log("New account created:", dataAccount.publicKey.toBase58());
  }
  
  main();
  