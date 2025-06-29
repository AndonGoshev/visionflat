import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import BuildingPage from './pages/BuildingPage';
import EntrancePage from './pages/EntrancePage';
import RoomPage from './pages/RoomPage';
import FloorPage from './pages/FloorPage';
import FlatPage from './pages/FlatPage';
import RoomDisplayPage from './pages/RoomDisplayPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/buildings/:buildingId" element={<BuildingPage />} />
        <Route path="/admin/buildings/:buildingId/entrances/:entranceId" element={<EntrancePage />} />
        <Route path="/admin/buildings/:buildingId/entrances/:entranceId/floors/:floorId" element={<FloorPage />} />
        <Route path="/admin/buildings/:buildingId/entrances/:entranceId/floors/:floorId/flats/:flatId" element={<FlatPage />} />
        <Route path="/:buildingSlug/:flatSlug/:roomSlug" element={<RoomPage />} />
        <Route path="/room/:roomSlug" element={<RoomDisplayPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
