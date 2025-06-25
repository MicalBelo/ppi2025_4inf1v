import "./styles/theme.css";
import "./styles/global.css";

// import { MyGrid } from "./components/MyGrid";
// import { Footer } from "./components/Footer"
// import { Main } from "./components/Main"
import { Header } from "./components/Etapa1/Header"
import { LuckyNumber } from "./components/Etapa2/LuckyNumber";

export default function App() {

  return (
    //React Fragment
    <>

      <Header />
      <LuckyNumber />
    </>
  );
}
