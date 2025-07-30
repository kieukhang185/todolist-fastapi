import { Box, Heading, VStack, HStack, Link as ChakraLink, Text, useDisclosure } from "@chakra-ui/react";
import { Todo } from "../pages/Home";
import { useState } from "react";
import TodoDetailModal from "./TodoDetailModal"; // We'll create this next

type Props = {
  todos: Todo[];
  onTodoUpdated: () => void;
  onEdit?: (todo: Todo) => void;
  onDelete?: (todo: Todo) => void;
};

export default function TodoList({ todos, onEdit, onDelete, onTodoUpdated  }: Props) {
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
      <VStack spacing={4} align="stretch">
      {todos.map(todo => (
        <Box key={todo.id} p={3} shadow="sm" borderWidth="1px" borderRadius="md" bg="white" >
          <HStack justify="space-between">
            <ChakraLink color="blue.600" fontWeight="bold" cursor="pointer"onClick={() => handleOpenDetail(todo)}>{todo.id.toUpperCase()}: {todo.title}</ChakraLink>
            <Text>{todo.type_name}</Text>
          </HStack>
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