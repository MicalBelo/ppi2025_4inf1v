import "./styles/theme.css";
import "./styles/global.css";
import { Header } from "./components/etapa1/Header";
import { LuckyNumber } from "./components/etapa2/LuckyNumber";

export default function App() {

  return (
    //React Fragment
    <>
      <Header />
      <LuckyNumber />
    </>
  );
}