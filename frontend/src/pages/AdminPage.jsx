// frontend/src/pages/AdminPage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container,
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Button,
    VStack,
    HStack,
    Text,
    useToast,
    Grid,
    GridItem,
    Image,
    Link,
    Tag,
} from "@chakra-ui/react";

// --- Lógica de Autenticação ---
// Pega o token do localStorage
const token = localStorage.getItem("access_token");

// Cria uma instância do Axios que anexa o token a todas as requisições
const apiClient = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        Authorization: `Bearer ${token}`,
    },
});
// ------------------------------

function AdminPage() {
    const [items, setItems] = useState([]);
    const initialState = {
        title: "",
        content: "",
        image_url: "",
        tags: "",
        link_1_url: "",
        link_1_text: "",
    };
    const [newItem, setNewItem] = useState(initialState);
    const [editingItemId, setEditingItemId] = useState(null);
    const [editData, setEditData] = useState({});
    const ITEM_TYPE = "portfolio_project";
    const toast = useToast();

    const fetchItems = async () => {
        try {
            // A listagem de itens é pública, então podemos usar o axios normal sem token
            const response = await axios.get("http://localhost:8000/items/", {
                params: { item_type: ITEM_TYPE },
            });
            setItems(response.data);
        } catch (error) {
            console.error("Erro ao buscar os itens:", error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setNewItem((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleCreateItem = async (event) => {
        event.preventDefault();
        try {
            const dataToSend = { ...newItem, item_type: ITEM_TYPE };
            // Usa o apiClient para a requisição protegida
            await apiClient.post("/items/", dataToSend);
            toast({
                title: "Conteúdo adicionado com sucesso!",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            setNewItem(initialState);
            fetchItems();
        } catch (error) {
            console.error("Erro ao adicionar conteúdo:", error);
            toast({
                title: "Erro ao adicionar conteúdo.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (window.confirm("Tem certeza que deseja excluir este item?")) {
            try {
                // Usa o apiClient para a requisição protegida
                await apiClient.delete(`/items/${itemId}`);
                toast({
                    title: "Item excluído com sucesso!",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                fetchItems();
            } catch (error) {
                console.error("Erro ao excluir o item:", error);
                toast({
                    title: "Erro ao excluir o item.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    };

    const handleEditItem = (item) => {
        setEditingItemId(item.id);
        setEditData(item);
    };

    const handleCancelEdit = () => setEditingItemId(null);

const handleUpdateItem = async (itemId) => {
    try {
        // 1. Criamos uma cópia do objeto de edição para não modificar o original.
        const dataToUpdate = { ...editData };

        // 2. Removemos manualmente os campos que não devem ser enviados para a API.
        delete dataToUpdate.id;
        delete dataToUpdate.created_at;
        delete dataToUpdate.updated_at;

        // 3. Enviamos o objeto limpo para a API.
        const response = await apiClient.put(`/items/${itemId}`, dataToUpdate);

        toast({
            title: "Conteúdo atualizado com sucesso!",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
        setItems(
            items.map((item) => (item.id === itemId ? response.data : item))
        );
        setEditingItemId(null);
    } catch (error) {
        console.error("Erro ao atualizar o conteúdo:", error);
        toast({
            title: "Erro ao atualizar o conteúdo.",
            status: "error",
            duration: 3000,
            isClosable: true,
        });
    }
};

    const handleEditDataChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
    };

    return (
        <Container maxW="container.xl" p={5}>
            <HStack justifyContent="space-between" mb={8}>
                <Heading as="h1" size="xl">
                    Painel de Gerenciamento
                </Heading>
                <Button colorScheme="red" onClick={handleLogout}>
                    Sair
                </Button>
            </HStack>

            <Grid templateColumns={{ base: "1fr", md: "1fr 2fr" }} gap={10}>
                <GridItem>
                    <Box
                        p={6}
                        borderWidth="1px"
                        borderRadius="lg"
                        boxShadow="lg"
                    >
                        <Heading as="h2" size="lg" mb={4}>
                            Adicionar Novo Conteúdo
                        </Heading>
                        <VStack
                            as="form"
                            onSubmit={handleCreateItem}
                            spacing={4}
                        >
                            <FormControl isRequired>
                                <FormLabel>Título</FormLabel>
                                <Input
                                    name="title"
                                    value={newItem.title}
                                    onChange={handleFormChange}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Descrição</FormLabel>
                                <Textarea
                                    name="content"
                                    value={newItem.content}
                                    onChange={handleFormChange}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Assunto / Tags</FormLabel>
                                <Input
                                    name="tags"
                                    placeholder="Ex: React, FastAPI, SQL"
                                    value={newItem.tags}
                                    onChange={handleFormChange}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>URL da Imagem</FormLabel>
                                <Input
                                    name="image_url"
                                    placeholder="https://..."
                                    value={newItem.image_url}
                                    onChange={handleFormChange}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Link Externo (URL)</FormLabel>
                                <Input
                                    name="link_1_url"
                                    value={newItem.link_1_url}
                                    onChange={handleFormChange}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Texto do Link</FormLabel>
                                <Input
                                    name="link_1_text"
                                    value={newItem.link_1_text}
                                    onChange={handleFormChange}
                                />
                            </FormControl>
                            <Button
                                type="submit"
                                colorScheme="green"
                                alignSelf="flex-start"
                            >
                                Publicar Conteúdo
                            </Button>
                        </VStack>
                    </Box>
                </GridItem>

                <GridItem>
                    <Heading as="h2" size="lg" mb={4}>
                        Lista de Conteúdos
                    </Heading>
                    <VStack spacing={5} align="stretch">
                        {items.map((item) => (
                            <Box
                                key={item.id}
                                p={5}
                                borderWidth="1px"
                                borderRadius="lg"
                                boxShadow="md"
                            >
                                {editingItemId === item.id ? (
                                    <VStack spacing={4}>
                                        <Input
                                            name="title"
                                            value={editData.title}
                                            onChange={handleEditDataChange}
                                        />
                                        <Textarea
                                            name="content"
                                            value={editData.content}
                                            onChange={handleEditDataChange}
                                        />
                                        <Input
                                            name="tags"
                                            value={editData.tags}
                                            onChange={handleEditDataChange}
                                        />
                                        <Input
                                            name="image_url"
                                            value={editData.image_url || ""}
                                            onChange={handleEditDataChange}
                                        />
                                        <Input
                                            name="link_1_url"
                                            value={editData.link_1_url || ""}
                                            onChange={handleEditDataChange}
                                        />
                                        <Input
                                            name="link_1_text"
                                            value={editData.link_1_text || ""}
                                            onChange={handleEditDataChange}
                                        />
                                        <HStack>
                                            <Button
                                                colorScheme="green"
                                                onClick={() =>
                                                    handleUpdateItem(item.id)
                                                }
                                            >
                                                Salvar
                                            </Button>
                                            <Button
                                                colorScheme="gray"
                                                onClick={handleCancelEdit}
                                            >
                                                Cancelar
                                            </Button>
                                        </HStack>
                                    </VStack>
                                ) : (
                                    <>
                                        {item.image_url && (
                                            <Image
                                                src={item.image_url}
                                                alt={item.title}
                                                borderRadius="md"
                                                mb={4}
                                            />
                                        )}
                                        <Heading as="h3" size="md">
                                            {item.title}
                                        </Heading>
                                        <Text mt={3} whiteSpace="pre-wrap">
                                            {item.content}
                                        </Text>
                                        <HStack mt={4} spacing={2}>
                                            {item.tags.split(",").map(
                                                (tag) =>
                                                    tag.trim() && (
                                                        <Tag
                                                            key={tag}
                                                            size="sm"
                                                            colorScheme="purple"
                                                        >
                                                            {tag.trim()}
                                                        </Tag>
                                                    )
                                            )}
                                        </HStack>
                                        <HStack mt={4}>
                                            {item.link_1_url && (
                                                <Link
                                                    href={item.link_1_url}
                                                    isExternal
                                                >
                                                    <Button
                                                        size="sm"
                                                        colorScheme="gray"
                                                    >
                                                        {item.link_1_text ||
                                                            "Ver Link Externo"}
                                                    </Button>
                                                </Link>
                                            )}
                                        </HStack>
                                        <HStack mt={4} spacing={3}>
                                            <Button
                                                colorScheme="blue"
                                                size="sm"
                                                onClick={() =>
                                                    handleEditItem(item)
                                                }
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                colorScheme="red"
                                                size="sm"
                                                onClick={() =>
                                                    handleDeleteItem(item.id)
                                                }
                                            >
                                                Excluir
                                            </Button>
                                        </HStack>
                                    </>
                                )}
                            </Box>
                        ))}
                    </VStack>
                </GridItem>
            </Grid>
        </Container>
    );
}

export default AdminPage;
