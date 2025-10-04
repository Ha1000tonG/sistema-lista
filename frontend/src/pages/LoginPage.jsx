// frontend/src/pages/LoginPage.jsx  lida com a página de login do administrador

import { useState, useEffect } from "react";
import apiClient from "../api/api";
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    VStack,
    useToast,
    Container,
    Text,
    Link as ChakraLink,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const logoutMessage = localStorage.getItem("logout_message");
        if (logoutMessage) {
            toast({
                title: "Sessão Encerrada",
                description: logoutMessage,
                status: "info",
                duration: 5000,
                isClosable: true,
            });
            localStorage.removeItem("logout_message");
        }
    }, [toast]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const params = new URLSearchParams();
        params.append("username", username);
        params.append("password", password);

        try {
            const response = await apiClient.post("/token", params, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            localStorage.setItem("access_token", response.data.access_token);
            toast({
                title: "Login bem-sucedido!",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            navigate("/admin");
        } catch (error) {
            console.error("Falha na autenticação:", error);
            toast({
                title: "Erro no login.",
                description: "Usuário ou senha incorretos.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Container centerContent>
            <Box
                p={8}
                mt={20}
                borderWidth="1px"
                borderRadius="lg"
                boxShadow="lg"
                minW="400px"
            >
                <Heading as="h1" size="lg" textAlign="center" mb={6}>
                    {" "}
                    Acessar o Quadro Kanban{" "}
                </Heading>
                <VStack as="form" onSubmit={handleSubmit} spacing={4}>
                    <FormControl isRequired>
                        <FormLabel>Usuário</FormLabel>
                        <Input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Senha</FormLabel>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>
                    <Button type="submit" colorScheme="blue" width="full">
                        {" "}
                        Entrar{" "}
                    </Button>
                </VStack>
                <Text mt={6} textAlign="center">
                    Caso não esteja cadastrado,{" "}
                    <ChakraLink as={RouterLink} to="/signup" color="blue.400">
                        {" "}
                        clique aqui.{" "}
                    </ChakraLink>
                </Text>
            </Box>
        </Container>
    );
}

export default LoginPage;
