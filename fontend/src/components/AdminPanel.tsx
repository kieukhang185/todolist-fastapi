import { Box, Heading, List, ListItem, Text } from "@chakra-ui/react";

type User = { id: number; username: string; is_superuser: boolean };
type Props = { users: User[] };

export default function AdminPanel({ users }: Props) {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={6} shadow="md">
      <Heading size="md" mb={4}>User Management</Heading>
      <List spacing={2}>
        {Array.isArray(users) ? users.map(user => (
          <ListItem key={user.id}>
            <Text>
              {user.username} {user.is_superuser && "(admin)"}
            </Text>
          </ListItem>
        )) : <Text>No users found.</Text>}
      </List>
    </Box>
  );
}
