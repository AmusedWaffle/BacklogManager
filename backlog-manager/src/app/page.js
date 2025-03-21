/*import Image from "next/image";
import styles from "./page.module.css";*/

import HomePage from "./components/HomePage";
import TopButtons from "./components/TopButtons";

export default function Home() {
  return (
    <div>
      <TopButtons />
      <HomePage />
    </div>
    );
}
