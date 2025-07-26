import { useEffect, useState } from "react";
import { authApi } from "../api";
import { useAuth } from "../AuthContext";
import { Box, Heading, Text, List, ListItem } from "@chakra-ui/react";
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
    // If you have /users for superuser:
    authApi.get("/users", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUsers(res.data));
  }, [token]);

  if (!me) return <div>Loading...</div>;
  if (!me.is_superuser) return <div>Not authorized.</div>;

  return (
    <Box maxW="600px" mx="auto" py={10}>
      <Heading mb={4}>Admin Panel</Heading>
      <Text mb={4}>Welcome, {me.username}!</Text>
      <Heading size="md" mb={2}>Users</Heading>
      <List spacing={2}>
        {users.map(user => (
          <ListItem key={user.id}>
            {user.username} {user.is_superuser && "(admin)"}
          </ListItem>
        ))}
      </List>
      {/* Add user management actions here */}
      <AdminPanel users={users} />
    </Box>
  );
}
