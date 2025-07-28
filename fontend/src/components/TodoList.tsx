import { Box, Heading, VStack, HStack, Text, Link  as ChakraLink, useDisclosure } from "@chakra-ui/react";
import { Todo } from "../pages/Home";
import { useState } from "react";
import TodoDetailModal from "./TodoDetailModal"; // We'll create this next

type Props = {
  todos: Todo[];
  onTodoUpdated: () => void;
};

export default function TodoList({ todos, onTodoUpdated  }: Props) {
  // Group todos by status
  const grouped = todos.reduce<Record<string, Todo[]>>((acc, todo) => {
    acc[todo.status] = acc[todo.status] || [];
    acc[todo.status].push(todo);
    return acc;
  }, {});

  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  function handleOpenDetail(todo: Todo) {
    setSelectedTodo(todo);
    onOpen();
  }

  function handleDetailClose() {
    setSelectedTodo(null);
    onClose();
    onTodoUpdated();
  }

  return (
    <>
      <VStack spacing={6} align="stretch">
        {Object.keys(grouped).map(status => (
          <Box key={status}>
            <Heading size="md" mb={2} textTransform="capitalize">{status.replace("_", " ")}</Heading>
            <VStack spacing={2} align="stretch">
              {grouped[status].map(todo => (
                <Box key={todo.id} p={3} shadow="sm" borderWidth="1px" borderRadius="md" bg="white" >
                  <HStack justify="space-between">
                    <ChakraLink color="blue.600" fontWeight="bold" cursor="pointer"onClick={() => handleOpenDetail(todo)}>{todo.id}: {todo.title}</ChakraLink>
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
      {/* Todo Detail Modal */}
        {selectedTodo && (
          <TodoDetailModal
            todo={selectedTodo}
            isOpen={isOpen}
            onClose={handleDetailClose}
          />
        )}
    </>
  );
}
