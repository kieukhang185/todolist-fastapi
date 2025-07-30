import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalCloseButton, Button, Box, VStack, Input, Textarea, Select, HStack, useToast, Text
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { api, getTodoTypes } from "../api";
import CommentList from "./CommentList";
import { useAuth } from "../AuthContext";
import { Todo } from "../pages/Home";

type TodoType = { id: number; name: string; description?: string };

export default function TodoDetailModal({
  todo,
  isOpen,
  onClose,
}: {
  todo: Todo;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { token } = useAuth();
  const [edit, setEdit] = useState(false);
  const [types, setTypes] = useState<TodoType[]>([]);
  const [form, setForm] = useState({
    id: todo.id,
    title: todo.title,
    description: todo.description ?? "",
    type_name: todo.type_name,
    reporter: todo.reporter,
    status: todo.status,
    assign: todo.assign ?? "",
  });
  const toast = useToast();

  useEffect(() => {
    getTodoTypes().then(res => setTypes(res.data));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave() {
    api.put(`/todos/${todo.id}`, form, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        toast({ status: "success", title: "Todo updated" });
        setEdit(false);
        onClose();
      })
      .catch(() => toast({ status: "error", title: "Update failed" }));
  }

  function handleDelete() {
    if (!window.confirm("Delete this todo?")) return;
    api.delete(`/todos/${todo.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        toast({ status: "success", title: "Todo deleted" });
        onClose();
      })
      .catch(() => toast({ status: "error", title: "Delete failed" }));
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Todo Detail</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={3} mb={2}>
            <Text color="gray.500">ID: {todo.id}</Text>
            {edit ? (
              <>
                <Input name="title" value={form.title} onChange={handleChange} placeholder="Title" />
                <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
                <Select name="type_name" value={form.type_name} onChange={handleChange}>
                  {types.map(t => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </Select>
                <Select name="status" value={form.status} onChange={handleChange}>
                  <option value="pending">pending</option>
                  <option value="in_progress">in_progress</option>
                  <option value="done">done</option>
                </Select>
                <Input name="assign" value={form.assign} onChange={handleChange} placeholder="Assign to" />
              </>
            ) : (
              <>
                <Text><b>Title:</b> {todo.title}</Text>
                <Text><b>Type:</b> {todo.type_name}</Text>
                <Text><b>Status:</b> {todo.status}</Text>
                <Text><b>Assign:</b> {todo.assign}</Text>
                <Text><b>Description:</b> {todo.description}</Text>
              </>
            )}
            <HStack>
              {edit ? (
                <>
                  <Button colorScheme="green" onClick={handleSave}>Save</Button>
                  <Button onClick={() => setEdit(false)}>Cancel</Button>
                </>
              ) : (
                <>
                  <Button colorScheme="blue" onClick={() => setEdit(true)}>Edit</Button>
                  <Button colorScheme="red" onClick={handleDelete}>Delete</Button>
                </>
              )}
            </HStack>
          </VStack>
          <Box mt={4}>
            <CommentList todoId={todo.id} />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
