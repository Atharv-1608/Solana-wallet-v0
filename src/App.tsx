import { useState } from 'react';
import './App.css'
import { generateMnemonic, mnemonicToSeedSync,validateMnemonic } from 'bip39'
import { derivePath } from 'ed25519-hd-key'
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";
// import bs58 from 'bs58'

function App() {

  const [inputMnemonic,setInputMnemonic] = useState("") 
  const [mnemonic, setMnemonic] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey,setPrivateKey] = useState("")

  const generateBoth = () => {

    let seedPhrase = "";

    if(inputMnemonic.trim()){
      if(!validateMnemonic(inputMnemonic.trim())){
        alert("invalid mnemonic")
        return;
      }
      
      seedPhrase = inputMnemonic.trim()
      console.log(seedPhrase)
  
      
    }
    else {
    seedPhrase = generateMnemonic();
    console.log(seedPhrase)
    }

    setMnemonic(seedPhrase);
    // Generate mnemonic
    
    // Convert to seed
    const seed = mnemonicToSeedSync(seedPhrase);
    
    // Derive wallet
    const path = `m/44'/501'/0'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const readableSecret = Buffer.from(secret).toString('hex');
    const keypair = Keypair.fromSecretKey(secret);
    const pubKey = keypair.publicKey.toBase58();
    
    setPublicKey(pubKey);
    setPrivateKey(readableSecret)
    // console.log("Mnemonic:", seedPhrase);
    console.log("Public Key:", pubKey);
    console.log(readableSecret)
  }
  
  return (
    <div>
      <div className='flex justify-center items-center pt-6 md:pt-10 text-2xl md:text-4xl font-semibold px-4'>
        Solana Wallet keys
      </div>

      <div className=''>
        <div className='px-4 md:pl-64 text-xl md:text-2xl pt-8 md:pt-16'>
          Create / Restore Wallet
        </div>

        <div className='flex flex-col md:flex-row justify-center items-stretch md:items-center pt-7 gap-4 px-4 md:px-0'>
          <input 
            placeholder='Enter Your Mnemonic Phrase'
            type="text" 
            className='w-full md:w-1/2 px-3 py-2 md:mx-5 md:pl-2 bg-amber-400' 
            value={inputMnemonic}
            onChange={(e)=>setInputMnemonic(e.target.value)}
          />
          <button className='bg-pink-300 p-3' onClick={generateBoth}>
            Generate wallet
          </button>
        </div>

        {/* Display Results */}
        {mnemonic && (
          <div className='mt-8 px-4 md:px-64'>
            <div className='mb-4'>
              <h3 className='text-xl font-semibold'>Seed Phrase:</h3>
              <p className='bg-yellow-100 p-3 rounded wrap-break-words'>{mnemonic}</p>
            </div>
            
            <div className='mb-4'>
              <h3 className='text-xl font-semibold'>Public Key:</h3>
              <p className='bg-green-100 p-3 rounded break-all text-sm'>{publicKey}</p>
            </div>

            <div>
              <h3 className='text-xl font-semibold'>private Key:</h3>
              <p className='bg-red-100 p-3 rounded break-all text-sm'>{privateKey}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App