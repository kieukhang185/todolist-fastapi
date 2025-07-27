import { useState } from "react";
import { authApi } from "../api";
import { useNavigate, Link } from "react-router-dom";
import { Box, Input, Button, Heading, VStack, Alert } from "@chakra-ui/react";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    authApi.post("/register", { username, password })
      .then(() => navigate("/login"))
      .catch(() => setErr("Username already exists"));
  }

  return (
    <Box maxW="400px" mx="auto" py={10}>
      <Heading mb={4}>Register</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={3}>
          {err && <Alert status="error">{err}</Alert>}
          <Input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
          />
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
          />
          <Button colorScheme="green" type="submit">
            Register
          </Button>
        </VStack>
      </form>
      <Box textAlign="center" mt={4}>
        <Link to="/login" style={{ color: "#3182ce" }}>
          Already have an account? Login
        </Link>
      </Box>
    </Box>
  );
}
