// src/components/TodoList.tsx
import { Box, Heading, VStack, HStack, Button, Text } from "@chakra-ui/react";
import { Todo } from "../pages/Home";

type Props = {
  todos: Todo[];
  onEdit?: (todo: Todo) => void;
  onDelete?: (todo: Todo) => void;
};

export default function TodoList({ todos, onEdit, onDelete }: Props) {
  return (
    <VStack spacing={4} align="stretch">
      {todos.map(todo => (
        <Box key={todo.id} p={4} shadow="md" borderWidth="1px" borderRadius="md">
          <HStack justify="space-between">
            <Heading size="sm">{todo.title}</Heading>
            <Text fontSize="sm">{todo.status}</Text>
          </HStack>
          <Text>{todo.description}</Text>
          <Text fontSize="sm" color="gray.500">
            Reporter: {todo.reporter} | Assigned: {todo.assign || "-"}
          </Text>
          {onEdit && onDelete && (
            <HStack mt={2}>
              <Button size="xs" colorScheme="blue" onClick={() => onEdit(todo)}>Edit</Button>
              <Button size="xs" colorScheme="red" onClick={() => onDelete(todo)}>Delete</Button>
            </HStack>
          )}
        </Box>
      ))}
    </VStack>
  );
}
