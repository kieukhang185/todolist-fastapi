import { useState, useEffect } from "react";
import { Box, Input, Button, Select, VStack, Textarea, HStack, useToast } from "@chakra-ui/react";
import { api } from "../api";
import { useAuth } from "../AuthContext";
import { Todo } from "../pages/Home";

const statuses = ["pending", "in_progress", "done"];

type Props = {
  onCreated: () => void;
  editingTodo?: Todo | null;
  onUpdated?: () => void;
};

export default function TodoForm({ onCreated, editingTodo, onUpdated }: Props) {
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [assign, setAssign] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
      setDescription(editingTodo.description || "");
      setStatus(editingTodo.status);
      setAssign(editingTodo.assign || "");
    } else {
      setTitle("");
      setDescription("");
      setStatus("pending");
      setAssign("");
    }
  }, [editingTodo]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const body = { title, description, status, assign, reporter: "me" }; // TODO: Get from token/me

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
        <Input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Todo title"
          required
        />
        <Textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
        />
        <HStack>
          <Select value={status} onChange={e => setStatus(e.target.value)}>
            {statuses.map(s => <option key={s}>{s}</option>)}
          </Select>
          <Input
            value={assign}
            onChange={e => setAssign(e.target.value)}
            placeholder="Assign to"
          />
        </HStack>
        <Button colorScheme="green" type="submit" isLoading={loading}>
          {editingTodo ? "Update Todo" : "Create Todo"}
        </Button>
      </VStack>
    </Box>
  );
}
