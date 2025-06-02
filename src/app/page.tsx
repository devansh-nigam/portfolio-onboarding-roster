import PortfolioInput from "@/components/PortfolioInput/PortfolioInput";
import styles from "./page.module.css";
import AnimatedText from "@/components/AnimatedText/AnimatedText";

export default function Home() {
  return (
    <div className={styles["homepage"]}>
      <AnimatedText
        text="roster"
        variant="wave"
        fontSize="4rem"
        color="#000"
        fontWeight="bold"
        duration={1}
        delay={0.5}
        repeat={true}
      />

      <div style={{ display: "flex", flexDirection: "column" }}>
        <AnimatedText
          text="Ready to showcase your work?"
          variant="typing"
          fontSize="1.8rem"
          fontWeight={"bold"}
          color="var(--color-gray-700)"
          duration={0.1}
          delay={0.5}
        />
        <AnimatedText
          text="Connect with industry titans who redefine what's possible."
          variant="letterBounce"
          fontSize="1rem"
          fontWeight={"bold"}
          color="var(--color-gray-500)"
          duration={0.6}
          delay={4}
        />
      </div>

      <PortfolioInput />
    </div>
  );
}
