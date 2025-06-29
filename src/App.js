import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate, } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import BuildingPage from './pages/BuildingPage';
import EntrancePage from './pages/EntrancePage';
import RoomPage from './pages/RoomPage';
import FloorPage from './pages/FloorPage';
import FlatPage from './pages/FlatPage';
import RoomDisplayPage from './pages/RoomDisplayPage';
function App() {
    return (_jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/admin", element: _jsx(AdminPage, {}) }), _jsx(Route, { path: "/admin/buildings/:buildingId", element: _jsx(BuildingPage, {}) }), _jsx(Route, { path: "/admin/buildings/:buildingId/entrances/:entranceId", element: _jsx(EntrancePage, {}) }), _jsx(Route, { path: "/admin/buildings/:buildingId/entrances/:entranceId/floors/:floorId", element: _jsx(FloorPage, {}) }), _jsx(Route, { path: "/admin/buildings/:buildingId/entrances/:entranceId/floors/:floorId/flats/:flatId", element: _jsx(FlatPage, {}) }), _jsx(Route, { path: "/:buildingSlug/:flatSlug/:roomSlug", element: _jsx(RoomPage, {}) }), _jsx(Route, { path: "/room/:roomSlug", element: _jsx(RoomDisplayPage, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }));
}
export default App;
