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
      <div className='flex justify-center items-center pt-10 text-4xl font-semibold'>
        Solana Wallet keys
      </div>

      <div className=''>
        <div className='pl-64 text-2xl pt-16'>
          Create / Restore Wallet
        </div>

        <div className='flex justify-center items-center pt-7'>
          <input 
            placeholder='Enter Your Mnemonic Phrase'
            type="text" 
            className='w-1/2 mx-5 pl-2 bg-amber-400' 
            value={inputMnemonic}
            onChange={(e)=>setInputMnemonic(e.target.value)}
          />
          <button className='bg-pink-300 p-3' onClick={generateBoth}>
            Generate wallet
          </button>
        </div>

        {/* Display Results */}
        {mnemonic && (
          <div className='mt-8 px-64'>
            <div className='mb-4'>
              <h3 className='text-xl font-semibold'>Seed Phrase:</h3>
              <p className='bg-yellow-100 p-3 rounded wrap-break-word'>{mnemonic}</p>
            </div>
            
            <div>
              <h3 className='text-xl font-semibold'>Public Key:</h3>
              <p className='bg-green-100 p-3 rounded wrap-break-word'>{publicKey}</p>
            </div>

            <div>
              <h3 className='text-xl font-semibold'>private Key:</h3>
              <p className='bg-green-100 p-3 rounded wrap-break-word'>{privateKey}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App