import { useContext } from "react";
import styles from "./App.module.scss";
import { LoginBox } from "./components/LoginBox";
import { MessageList } from "./components/MessageList";
import { SendMessageForm } from "./components/SendMessageForm";
import { AuthConstext } from "./contexts/auth";

export function App() {
  const { user } = useContext(AuthConstext);

  return (
    <main className={`${styles.contentWrapper} ${!!user ? styles.contentSigned : ''}`}>
      <MessageList />

      {!!user ? <SendMessageForm /> : <LoginBox />}
    </main>
  )
}