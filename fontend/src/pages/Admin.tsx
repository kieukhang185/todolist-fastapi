import { useEffect, useState } from "react";
import { authApi } from "../api";
import { useAuth } from "../AuthContext";
import { Box, Heading, Text } from "@chakra-ui/react";
import AdminPanel from "../components/AdminPanel";

type User = { id: number; username: string; is_superuser: boolean };

export default function Admin() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [me, setMe] = useState<User | null>(null);

  useEffect(() => {
    if (!token) return;
    authApi.get("/users/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setMe(res.data));
    authApi.get("/users", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUsers(res.data));
  }, [token]);

  if (!me) return <div>Loading...</div>;
  if (!me.is_superuser) return <div>Not authorized.</div>;

  return (
    <Box maxW="600px" mx="auto" py={10}>
      <Heading mb={4}>Admin Panel</Heading>
      <Text mb={4}>Welcome, {me.username}!</Text>
      <AdminPanel users={users} />
    </Box>
  );
}
