import { useState } from "react";
import { authApi } from "../api";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { Box, Input, Button, Heading, VStack, Alert } from "@chakra-ui/react";

export default function Login() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    authApi.post("/token", new URLSearchParams({ username, password }))
      .then(res => {
        setToken(res.data.access_token);
        localStorage.setItem("token", res.data.access_token);
        navigate("/");
      })
      .catch(() => setErr("Invalid credentials"));
  }

  return (
    <Box maxW="400px" mx="auto" py={10}>
      <Heading mb={4}>Login</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={3}>
          {err && <Alert status="error">{err}</Alert>}
          <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
          <Button colorScheme="blue" type="submit">Login</Button>
        </VStack>
      </form>
    </Box>
  );
}
