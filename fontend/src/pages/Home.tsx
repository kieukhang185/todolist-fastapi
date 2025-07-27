import { useEffect, useState } from "react";
import { Box, Heading, Button, VStack, Text, HStack, useToast } from "@chakra-ui/react";
import { api } from "../api";
import { useAuth } from "../AuthContext";
import Navbar from "../components/Navbar";
import TodoList from "../components/TodoList";
import CommentList from "../components/CommentList";

export type Todo = {
  type: string;
  id: string;
  title: string;
  description?: string;
  status: string;
  reporter: string;
  assign?: string;
  type_name: string;
  created_at: string;
  last_edit: string;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const { token } = useAuth();
  const toast = useToast();

  function fetchTodos() {
    api.get("/todos/").then(res => setTodos(res.data));
  }

  useEffect(() => { fetchTodos(); }, []);

  function handleEdit(todo: Todo) {
    setEditingTodo(todo);
  }

  function handleDelete(todo: Todo) {
    if (!window.confirm("Delete this todo?")) return;
    api.delete(`/todos/${todo.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(fetchTodos)
      .catch(() => toast({ status: "error", title: "Delete failed" }));
  }

  return (
    <Box flex="1" maxW="100vw" minH="0">
      <Navbar onTodoCreated={fetchTodos} />
      <Heading mb={4}>Todos</Heading>
      <VStack spacing={4} align="stretch">
        {todos.map(todo => (
          <Box key={todo.id} p={4} shadow="md" borderWidth="1px" borderRadius="md">
            <HStack justify="space-between">
              <Heading size="md">{todo.title}</Heading>
              <Text fontSize="sm">{todo.status}</Text>
            </HStack>
            <Text>{todo.description}</Text>
            <Text fontSize="sm" color="gray.500">
              Type: {todo.type_name} | Reporter: {todo.reporter} | Assigned: {todo.assign || "-"}<br />
              Created: {new Date(todo.created_at).toLocaleString()} | Last Edit: {new Date(todo.last_edit).toLocaleString()}
            </Text>
            {token && (
              <HStack mt={2}>
                <Button size="xs" colorScheme="blue" onClick={() => handleEdit(todo)}>Edit</Button>
                <Button size="xs" colorScheme="red" onClick={() => handleDelete(todo)}>Delete</Button>
              </HStack>
            )}
            <Box mt={4}>
              <CommentList todoId={todo.id} />
            </Box>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
