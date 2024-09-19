import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import type { User } from "firebase/auth";
import LoginContainer from "./features/login/LoginContainer";
import EatSleepCodeContext from "./utils/eatSleepCodeContext";
import { auth } from "./utils/firebase";
import AnonContainer from "./features/anontemplate/AnonContainer";
import HomeContainer from "./features/home/HomeContainer";
import BoardContainer from "./features/board/BoardContainer";
import LeaderBoardContainer from "./features/leader-board/LeaderBoardContainer";
import LandingContainer from "./features/landing/LandingContainer";
import SettingsContainer from "./features/settings/SettingsContainer";

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error("Error signing in anonymously:", error);
        });
      }
      console.log(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <BrowserRouter>
        <EatSleepCodeContext.Provider value={[user, setUser]}>
          <Routes>
            <Route path="/" element={<AnonContainer />}>
              <Route index={true} path="/" element={<LandingContainer />} />
              <Route path="/login" element={<LoginContainer />} />
            </Route>
            <Route path="/home" element={<HomeContainer />}>
              <Route
                path="/home/leaderboard"
                element={<LeaderBoardContainer />}
              />
              <Route path="/home/myboard" element={<BoardContainer />} />
              <Route path="/home/settings" element={<SettingsContainer />} />
            </Route>
          </Routes>
        </EatSleepCodeContext.Provider>
      </BrowserRouter>
    </div>
  );
};

export default App;
