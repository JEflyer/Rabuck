import logo from './logo.svg';
import './App.css';
import { BlockNative, Mint } from "./blocknative.js";


function App() {
  return (
    <div className="App">
      <BlockNative />
    </div>
  );
}

function Minter() {
  return (
    <div className="Mint">
      <Mint />
    </div>
  )
}

export {
  App,
  Minter
}
