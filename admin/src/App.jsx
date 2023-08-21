import React, { useLayoutEffect } from "react";
import Dashboard from "./Component/Dashboard/Dashboard";
import Login from "./Component/Dashboard/Login";
import {
  BrowserRouter as Router,
  useLocation,
  Routes,
  Route,
} from "react-router-dom";
import { authRoute } from "./Api/DynamicRouter";
import ProtectedRoute from "./Api/ProtectedRoute";
const App = () => {
  const Wrapper = ({ children }) => {
    const location = useLocation();
    useLayoutEffect(() => {
      document.documentElement.scrollTo(500, 0);
    }, [location.pathname]);
    return children;
  };
  return (
    <Router>
      <Wrapper>
        <Routes>
          <Route path="/" element={<Dashboard />}>
            {authRoute?.map((e, i) => {
              return (
                <Route exact element={<ProtectedRoute>{e?.element}</ProtectedRoute>} path={e?.path} key={i} />
              );
            })}
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </Wrapper>
    </Router>
  );
};

export default App;
