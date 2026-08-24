import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import GamePage from './pages/Game';
import SupervisorPage from './pages/Supervisor';
import Splash from './components/Splash';

export default function App() {
  const [splash, setSplash] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 950);
    const t2 = setTimeout(() => setSplash(false), 1250);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="app-shell">
      {splash && <Splash leaving={leaving} />}

      <div className={`app-content ${splash ? 'app-content-hidden' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/supervisor" element={<SupervisorPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}
