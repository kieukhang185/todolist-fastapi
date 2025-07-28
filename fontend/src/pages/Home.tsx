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
  updated_at: string;
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
    <Box minH="100vh" display="flex" flexDirection="column" bg="gray.50">
      <Navbar onTodoCreated={fetchTodos} />
      <Box flex="1" px={{ base: 2, md: 8 }} py={6} maxW="900px" mx="auto" w="100%">
        <TodoList todos={todos} onTodoUpdated={fetchTodos}/>
      </Box>
    </Box>
  );
}