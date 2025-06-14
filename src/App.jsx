import "./styles/theme.css";
import "./styles/global.css";

import { Footer } from "./components/Footer"
import { Main } from "./components/Main"
import { Header } from "./components/Header"

export default function App() {

  return (
    //React Fragment
    <>
      <Header />
      <Main />
      <Footer />

    </>
  );
}
