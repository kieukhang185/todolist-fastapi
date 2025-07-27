import { useEffect, useState } from "react";
import { Box, Text, VStack, Input, Button, HStack, useToast } from "@chakra-ui/react";
import { api } from "../api";
import { useAuth } from "../AuthContext";

type Comment = {
  id: number;
  content: string;
  author: string;
  created_at: string;
};

export default function CommentList({ todoId }: { todoId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const { token } = useAuth();
  const toast = useToast();

  function fetchComments() {
    api.get(`/todos/${todoId}/comments/`).then(res => setComments(res.data));
  }

  useEffect(() => { fetchComments(); }, [todoId]);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      toast({ status: "warning", title: "Login to comment" });
      return;
    }
    api.post(`/todos/${todoId}/comments/`, { content, author: "me" }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => { setContent(""); fetchComments(); })
      .catch(() => toast({ status: "error", title: "Failed to add comment" }));
  }

  return (
    <Box>
      <form onSubmit={handleAdd}>
        <HStack>
          <Input
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Add a comment"
            size="sm"
          />
          <Button type="submit" size="sm" colorScheme="blue">Add</Button>
        </HStack>
      </form>
      <VStack align="start" mt={2} spacing={1}>
        {comments.map(c => (
          <Box key={c.id} fontSize="sm" bg="gray.50" p={2} borderRadius="md" w="100%">
            <Text>
              <b>{c.author}</b> <span style={{ color: "#999" }}>{new Date(c.created_at).toLocaleString()}</span>
            </Text>
            <Text>{c.content}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
