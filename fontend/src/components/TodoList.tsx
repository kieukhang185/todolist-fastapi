import { Box, Heading, VStack, HStack, Text } from "@chakra-ui/react";
import { Todo } from "../pages/Home";

type Props = {
  todos: Todo[];
  onEdit?: (todo: Todo) => void;
  onDelete?: (todo: Todo) => void;
};

export default function TodoList({ todos, onEdit, onDelete }: Props) {
  // Group todos by status
  const grouped = todos.reduce<Record<string, Todo[]>>((acc, todo) => {
    acc[todo.status] = acc[todo.status] || [];
    acc[todo.status].push(todo);
    return acc;
  }, {});

  return (
    <VStack spacing={6} align="stretch">
      {Object.keys(grouped).map(status => (
        <Box key={status}>
          <Heading size="md" mb={2} textTransform="capitalize">{status.replace("_", " ")}</Heading>
          <VStack spacing={2} align="stretch">
            {grouped[status].map(todo => (
              <Box key={todo.id} p={3} shadow="sm" borderWidth="1px" borderRadius="md" bg="white" >
                <HStack justify="space-between">
                  <Text fontWeight="bold">{todo.id}: {todo.title}</Text>
                  <Text>{todo.type_name}</Text>
                </HStack>
                {/* {onEdit && onDelete && (
                  <HStack mt={2}>
                    <Text as="button" color="blue.500" fontWeight="semibold" onClick={() => onEdit(todo)}>Edit</Text>
                    <Text as="button" color="red.500" fontWeight="semibold" onClick={() => onDelete(todo)}>Delete</Text>
                  </HStack>
                )} */}
              </Box>
            ))}
          </VStack>
        </Box>
      ))}
    </VStack>
  );
}
