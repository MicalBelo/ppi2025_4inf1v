import "./styles/theme.css";
import "./styles/global.css";

import { MyGrid } from "./components/MyGrid";
import { Footer } from "./components/Footer"
import { Main } from "./components/Main"
import { Header } from "./components/Header"

export default function App() {

  return (
    //React Fragment
    <>
     <MyGrid />
      {/* <Header />
      <Main />
      <Footer /> */}

    </>
  );
}
