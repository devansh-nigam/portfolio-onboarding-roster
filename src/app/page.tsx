import styles from "./page.module.css";
import PortfolioInput from "@/components/PortfolioInput/PortfolioInput";

export default function Home() {
  return (
    <div className={styles.page}>
      <PortfolioInput />
    </div>
  );
}
