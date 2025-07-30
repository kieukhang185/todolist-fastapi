import { useState, useEffect } from "react";
import { Box, Input, Button, Select, VStack, Textarea, HStack, useToast } from "@chakra-ui/react";
import { api, getTodoTypes } from "../api";
import { useAuth } from "../AuthContext";
import { Todo } from "../pages/Home";

type TodoType = { id: number; name: string; description?: string };

type Props = {
  onCreated: () => void;
  editingTodo?: Todo | null;
  onUpdated?: () => void;
};

export default function TodoForm({ onCreated, editingTodo, onUpdated }: Props) {
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type_name, setType] = useState("");    // selected todo type (name or id)
  const [types, setTypes] = useState<TodoType[]>([]);
  const [status, setStatus] = useState("new");
  const [assign, setAssign] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Fetch todo types from backend
  useEffect(() => {
    getTodoTypes().then(res => {
      setTypes(res.data);
      // Set default type to first available, or keep from editingTodo
      if (editingTodo) {
        setType(editingTodo.type || "");
      } else if (res.data.length > 0) {
        setType(res.data[0].name);
      }
    });
  }, [editingTodo]);

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
      setDescription(editingTodo.description || "");
      setStatus(editingTodo.status);
      setAssign(editingTodo.assign || "");
      setType(editingTodo.type || "");
    } else {
      setTitle("");
      setDescription("");
      setStatus("");
      setAssign("");
      // type is set in the fetch
    }
  }, [editingTodo]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const body = { title, description, status, assign, type_name, reporter: "admin" };
    console.log(body)

    const headers = { Authorization: `Bearer ${token}` };
    if (editingTodo) {
      api.put(`/todos/${editingTodo.id}`, body, { headers })
        .then(() => { onUpdated && onUpdated(); })
        .catch(() => toast({ status: "error", title: "Update failed" }))
        .finally(() => setLoading(false));
    } else {
      api.post("/todos/", body, { headers })
        .then(() => { onCreated(); })
        .catch(() => toast({ status: "error", title: "Create failed" }))
        .finally(() => setLoading(false));
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit} mb={4}>
      <VStack spacing={2} align="stretch">
        <Input value={title}onChange={e => setTitle(e.target.value)} placeholder="Todo title" required />
        <Textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
        />
        <HStack>
          <Select
            value={type_name}
            onChange={e => setType(e.target.value)}
            required
          >
            {types.map(t => (
              <option key={t.id} value={t.name}>{t.name.toUpperCase()}</option>
            ))}
          </Select>
          {/* <Input value={assign} onChange={e => setAssign(e.target.value)} placeholder="Assign to"/> */}
        </HStack>
        <Button colorScheme="green" type="submit" isLoading={loading}>
          {editingTodo ? "Update Todo" : "Create Todo"}
        </Button>
      </VStack>
    </Box>
  );
}
