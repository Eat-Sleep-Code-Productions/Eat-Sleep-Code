import "./App.css";
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
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

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error("Error signing in anonymously:", error);
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!user && !location.pathname.startsWith("/")) {
    return <Navigate to="/" replace />;
  }

  return (
    <EatSleepCodeContext.Provider value={[user, setUser]}>
      {children}
    </EatSleepCodeContext.Provider>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthWrapper>
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
      </AuthWrapper>
    </BrowserRouter>
  );
};

export default App;
