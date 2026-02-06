import { useState } from 'react';
import './App.css'
import { generateMnemonic, mnemonicToSeedSync,validateMnemonic } from 'bip39'
import { derivePath } from 'ed25519-hd-key'
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";
import { EncryptedText } from './components/Ecrypted-text';
import { GridBackgroundDemo } from './components/GridBackground';

function App() {

  const [inputMnemonic,setInputMnemonic] = useState("") 
  const [mnemonic, setMnemonic] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey,setPrivateKey] = useState("")
  const [showKey,setShowKey] = useState(false)

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
    
    const seed = mnemonicToSeedSync(seedPhrase);
    const path = `m/44'/501'/0'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const readableSecret = Buffer.from(secret).toString('hex');
    const keypair = Keypair.fromSecretKey(secret);
    const pubKey = keypair.publicKey.toBase58();
    
    setPublicKey(pubKey);
    setPrivateKey(readableSecret)
    console.log("Public Key:", pubKey);
    console.log(readableSecret)
  }

  const copyText = (text:string,label:string)=>{
    navigator.clipboard.writeText(text)
    .then(()=>{
       alert(`${label} copied!`);
    })
    .catch((err) => {
      alert('Failed to copy');
      console.error('Copy failed:', err);
      });
  }
  
  return (
    <div className='relative min-h-screen'>
      {/* Background */}
      <div className='fixed inset-0 -z-10'>
        <GridBackgroundDemo />
      </div>

      {/* Your original content - unchanged */}
      <div>
        <div className='flex justify-center items-center pt-6 md:pt-10 text-3xl md:text-5xl font-semibold px-4'>
          <EncryptedText 
          text="Welcome to Apollo"
          encryptedClassName="text-neutral-500"
          revealedClassName="dark:text-white text-black"
          revealDelayMs={50}
          />
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

              <div className='pb-5 text-2xl font-black md:text:3xl'>
                Solana wallet :
              </div>

              <div className='mb-4'>
                <h3 className='text-xl font-semibold'>Seed Phrase:</h3>
                <p className='bg-yellow-100 p-3 rounded wrap-break-words'
                onClick={() => copyText(mnemonic, 'Seed phrase')}
                >{mnemonic}</p>
              </div>
              
              <div className='mb-4'>
                <h3 className='text-xl font-semibold'>Public Key:</h3>
                <p className='bg-green-100 p-3 rounded break-all text-sm'>{publicKey}</p>
              </div>

              <div>
                <div className='flex gap-5 pb-2'>
                <h3 className='text-xl font-semibold'>Private Key:</h3>
                <button onClick={()=>{
                  setShowKey(true)
                  
                }}
                className={`${showKey ? "hidden" : "bg-[#7AB2B2] p-2"}`}
                >{showKey ? " " : "Show key"}</button>
                </div>
                <p className={`bg-red-100 p-3 rounded break-all text-sm ${showKey ? 'opacity-100' : 'opacity-0'}`}
                >{privateKey}</p>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  )
}

export default App