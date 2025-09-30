// frontend/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  Container
} from '@chakra-ui/react';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // O endpoint /token do FastAPI espera dados de formulário, não JSON.
    // Precisamos formatar os dados corretamente.
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    try {
        const response = await axios.post(
            "http://localhost:8000/token",
            params
        );
        const { access_token } = response.data;

        // Salva o token no localStorage do navegador
        localStorage.setItem("access_token", access_token);

        toast({
            title: "Login bem-sucedido!",
            status: "success",
            duration: 3000,
            isClosable: true,
        });

        // Redireciona o usuário para a página de administração
        window.location.href = "/admin";
    } catch (error) {
        // Para o desenvolvedor: loga o erro detalhado no console (F12) para depuração
        console.error("Falha na autenticação:", error);

        // Para o usuário: mostra a mesma mensagem amigável de sempre
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
      <Box p={8} mt={20} borderWidth="1px" borderRadius="lg" boxShadow="lg" minW="400px">
        <Heading as="h1" size="lg" textAlign="center" mb={6}>
          Login do Administrador
        </Heading>
        <VStack as="form" onSubmit={handleSubmit} spacing={4}>
          <FormControl isRequired>
            <FormLabel>Usuário</FormLabel>
            <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Senha</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <Button type="submit" colorScheme="blue" width="full">Entrar</Button>
        </VStack>
      </Box>
    </Container>
  );
}

export default LoginPage;