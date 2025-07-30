import {
  Box, Flex, Heading, Spacer, Button, useDisclosure,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import TodoForm from "./TodoForm";

export default function Navbar({ onTodoCreated }: { onTodoCreated: () => void }) {
  const { token, setToken } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  function handleLogout() {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  }

  function handleCreated() {
    onTodoCreated();
    onClose();
  }

  return (
    <>
      <Flex as="nav" align="center" bg="blue.600" color="white" px={6} py={3} shadow="md" position="sticky" top={0} zIndex={100}>
        <Heading as={Link} to="/" size="md" color="white">
          Todo App
        </Heading>
        <Spacer />
        {token && (
          <Button colorScheme="teal" variant="solid" onClick={onOpen} mr={3}>
            + Create Todo
          </Button>
        )}
        {token ? (
          <Button onClick={handleLogout} variant="outline" color="white" borderColor="white">
            Logout
          </Button>
        ) : (
          <Button as={Link} to="/login" variant="outline" color="white" borderColor="white">
            Login
          </Button>
        )}
      </Flex>

      {/* Modal for Create Todo */}
      {token && (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create Todo</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <TodoForm onCreated={handleCreated} />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
