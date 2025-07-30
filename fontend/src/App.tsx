import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import { AuthProvider, useAuth } from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import { Flex } from "@chakra-ui/react";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token, setToken } = useAuth();

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded: any = jwtDecode(token);
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      setToken(null);
      localStorage.removeItem("token");
      return <Navigate to="/login" />;
    }
  } catch (err) {
    setToken(null);
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Flex direction="column" minH="100vh" bg="gray.50">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* All other routes require login */}
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </Flex>
    </AuthProvider>
  );
}

export default App;