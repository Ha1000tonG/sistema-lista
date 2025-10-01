// frontend/src/pages/SignUpPage.jsx

import { useState } from "react"; // <--- Adicionado useState
import apiClient from '../api/api'; // Sem as chaves
//import axios from "axios";
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

function SignUpPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const toast = useToast();
    const navigate = useNavigate(); // Hook para navegação

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await apiClient.post("http://localhost:8000/users/", {
                username: username,
                password: password,
            });

            toast({
                title: "Conta criada com sucesso!",
                description: "Você já pode fazer o login.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            // Redireciona para a página de login após o sucesso
            navigate("/login");
        } catch (error) {
            const errorMsg =
                error.response?.data?.detail || "Usuário ou senha inválidos.";
            toast({
                title: "Erro ao criar a conta.",
                description: errorMsg,
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
                    Criar Nova Conta
                </Heading>
                <VStack as="form" onSubmit={handleSubmit} spacing={4}>
                    <FormControl isRequired>
                        <FormLabel>Nome de Usuário</FormLabel>
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
                    <Button type="submit" colorScheme="green" width="full">
                        Cadastrar
                    </Button>
                </VStack>
                <Text mt={6} textAlign="center">
                    Já tem uma conta?{" "}
                    <ChakraLink as={RouterLink} to="/login" color="blue.400">
                        Faça o login aqui.
                    </ChakraLink>
                </Text>
            </Box>
        </Container>
    );
}

export default SignUpPage;
