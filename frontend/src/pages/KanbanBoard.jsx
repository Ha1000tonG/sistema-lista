// frontend/src/pages/KanbanBoard.jsx

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
    Container,
    Box,
    Heading,
    HStack,
    VStack,
    Text,
    useToast,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    useDisclosure,
    Tag,
    Grid,
    GridItem,
    IconButton,
    Avatar,
    Spacer, // <-- ADICIONADO PARA O LAYOUT DO CABEÇALHO
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";

import {
    DndContext,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    closestCenter,
    DragOverlay,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    arrayMove,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const apiClient = axios.create({ baseURL: "http://localhost:8000" });

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.setItem(
                "logout_message",
                "Sua sessão expirou. Por favor, faça o login novamente."
            );
            localStorage.removeItem("access_token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

const statusColorMap = {
    "A Fazer": "gray",
    "Em Andamento": "blue",
    "Concluído": "green",
};

const Card = ({ task, onDelete, onEdit, dragAttributes, dragListeners }) => (
    <Box
        p={3}
        borderWidth="1px"
        borderRadius="md"
        boxShadow="sm"
        bg="white"
        _dark={{ bg: "gray.800" }}
    >
        <HStack justify="space-between" align="flex-start">
            <Text fontWeight="bold" flex="1" mr={2}>
                {task.title}
            </Text>
            {task.status && (
                <Tag
                    size="sm"
                    variant="solid"
                    colorScheme={statusColorMap[task.status] || "gray"}
                >
                    {task.status}
                </Tag>
            )}
        </HStack>
        <Text
            fontSize="sm"
            mt={2}
            color="gray.600"
            _dark={{ color: "gray.400" }}
        >
            {task.content}
        </Text>

        {task.tags && (
            <HStack mt={4} spacing={2}>
                {task.tags.split(",").map(
                    (tag) =>
                        tag.trim() && (
                            <Tag key={tag} size="sm" colorScheme="purple">
                                {tag.trim()}
                            </Tag>
                        )
                )}
            </HStack>
        )}

        <HStack justify="space-between" mt={4} align="center">
            {task.owner && (
                <HStack spacing={2} align="center">
                    <Avatar name={task.owner.username} size="xs" />
                    <Text fontSize="xs" color="gray.500">
                        {task.owner.username}
                    </Text>
                </HStack>
            )}

            <HStack spacing={2}>
                <Button
                    colorScheme="blue"
                    size="xs"
                    variant="ghost"
                    onClick={onEdit}
                >
                    Editar
                </Button>
                <IconButton
                    aria-label="Excluir tarefa"
                    icon={<FaTrash />}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={onDelete}
                />
                <Box
                    {...dragAttributes}
                    {...dragListeners}
                    cursor="grab"
                    px={1}
                >
                    <Text as="span" fontSize="lg" color="gray.400">
                        ⋮⋮
                    </Text>
                </Box>
            </HStack>
        </HStack>
    </Box>
);

const SortableCard = ({ task, onDelete, onEdit }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };
    return (
        <div ref={setNodeRef} style={style}>
            <Card
                task={task}
                onDelete={onDelete}
                onEdit={onEdit}
                dragAttributes={attributes}
                dragListeners={listeners}
            />
        </div>
    );
};

const Column = ({ title, tasks, onDelete, onEdit }) => {
    const { setNodeRef } = useSortable({
        id: title,
        data: { type: "Column", items: tasks },
    });
    return (
        <Box
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            bg="gray.50"
            _dark={{ bg: "gray.700" }}
        >
            <Heading size="md" mb={4}>
                {title}
            </Heading>
            <SortableContext
                items={tasks}
                strategy={verticalListSortingStrategy}
            >
                <VStack
                    spacing={4}
                    align="stretch"
                    ref={setNodeRef}
                    h="calc(100vh - 250px)"
                    overflowY="auto"
                    p={1}
                >
                    {tasks.map((task) => (
                        <SortableCard
                            key={task.id}
                            task={task}
                            onDelete={() => onDelete(task.id)}
                            onEdit={() => onEdit(task)}
                        />
                    ))}
                </VStack>
            </SortableContext>
        </Box>
    );
};

function KanbanBoard() {
    const [tasks, setTasks] = useState([]);
    const [activeTask, setActiveTask] = useState(null);
    const {
        isOpen: isCreateOpen,
        onOpen: onCreateOpen,
        onClose: onCreateClose,
    } = useDisclosure();
    const [newItem, setNewItem] = useState({
        title: "",
        content: "",
        tags: "",
    });
    const {
        isOpen: isEditOpen,
        onOpen: onEditOpen,
        onClose: onEditClose,
    } = useDisclosure();
    const [editingTask, setEditingTask] = useState(null);

    // --- ADIÇÃO: Novo estado para o usuário logado ---
    const [currentUser, setCurrentUser] = useState(null);

    const toast = useToast();
    const ITEM_TYPE = "kanban_card";

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
    };

    const fetchTasks = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:8000/items/", {
                params: { item_type: ITEM_TYPE },
            });
            setTasks(response.data);
        } catch (error) {
            if (error.response?.status !== 401) {
                console.error("Erro ao buscar as tarefas:", error);
                toast({ title: "Erro ao carregar o quadro.", status: "error" });
            }
        }
    }, [toast]);

    // --- ADIÇÃO: useEffect foi modificado para buscar o usuário ---
    useEffect(() => {
        fetchTasks();
        const fetchCurrentUser = async () => {
            try {
                const response = await apiClient.get("/users/me/");
                setCurrentUser(response.data);
            } catch (error) {
                console.error(
                    "Não foi possível buscar os dados do usuário.",
                    error
                );
            }
        };
        fetchCurrentUser();
    }, [fetchTasks]);

    const handleCreateTask = async (event) => {
        event.preventDefault();
        try {
            const dataToSend = {
                ...newItem,
                item_type: ITEM_TYPE,
                status: "A Fazer",
            };
            await apiClient.post("/items/", dataToSend);
            toast({
                title: "Tarefa criada com sucesso!",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            fetchTasks();
            onCreateClose();
            setNewItem({ title: "", content: "", tags: "" });
        } catch (error) {
            if (error.response?.status !== 401) {
                console.error("Erro ao criar tarefa:", error);
                toast({ title: "Erro ao criar a tarefa.", status: "error" });
            }
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
            try {
                await apiClient.delete(`/items/${itemId}`);
                toast({
                    title: "Tarefa excluída com sucesso!",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                });
                fetchTasks();
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    toast({
                        title: "Acesso Negado",
                        description: "Apenas o autor do cartão pode excluí-lo.",
                        status: "error",
                    });
                } else if (error.response?.status !== 401) {
                    toast({
                        title: "Erro ao excluir a tarefa.",
                        status: "error",
                    });
                }
                console.error("Erro ao excluir a tarefa:", error);
            }
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setNewItem((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleEditClick = (task) => {
        setEditingTask(task);
        onEditOpen();
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditingTask((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleUpdateTask = async (event) => {
        event.preventDefault();
        try {
            const { id, owner, created_at, updated_at, ...dataToUpdate } =
                editingTask;
            await apiClient.put(`/items/${id}`, dataToUpdate);
            toast({
                title: "Tarefa atualizada com sucesso!",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            fetchTasks();
            onEditClose();
        } catch (error) {
            if (error.response && error.response.status === 403) {
                toast({
                    title: "Acesso Negado",
                    description: "Apenas o autor do cartão pode editá-lo.",
                    status: "error",
                });
            } else if (error.response?.status !== 401) {
                console.error("Erro ao atualizar tarefa:", error);
                toast({
                    title: "Erro ao atualizar a tarefa.",
                    status: "error",
                });
            }
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor)
    );

    const handleDragStart = (event) => {
        const { active } = event;
        const task = tasks.find((t) => t.id === active.id);
        setActiveTask(task);
    };

    const handleDragEnd = (event) => {
        setActiveTask(null);
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const activeTask = tasks.find((t) => t.id === active.id);
        const overIsColumn = over.data.current?.type === "Column";
        const newStatus = overIsColumn
            ? over.id
            : tasks.find((t) => t.id === over.id)?.status;
        if (!newStatus || activeTask.status === newStatus) {
            const activeIndex = tasks.findIndex((t) => t.id === active.id);
            const overIndex = tasks.findIndex((t) => t.id === over.id);
            if (activeIndex !== overIndex) {
                setTasks((items) => arrayMove(items, activeIndex, overIndex));
            }
            return;
        }
        const originalStatus = activeTask.status;
        setTasks((prevTasks) =>
            prevTasks.map((t) =>
                t.id === active.id ? { ...t, status: newStatus } : t
            )
        );
        const { id, owner, created_at, updated_at, ...taskData } = activeTask;
        const payload = { ...taskData, status: newStatus };
        apiClient
            .put(`/items/${active.id}`, payload)
            .then(() => {
                toast({
                    title: `Tarefa movida para "${newStatus}"!`,
                    status: "success",
                    duration: 2000,
                });
            })
            .catch((error) => {
                if (error.response && error.response.status === 403) {
                    toast({
                        title: "Acesso Negado",
                        description: "Apenas o autor do cartão pode movê-lo.",
                        status: "error",
                    });
                } else if (error.response?.status !== 401) {
                    console.error(
                        "Erro ao atualizar o status:",
                        error.response ? error.response.data : error.message
                    );
                    toast({
                        title: "Falha ao mover a tarefa.",
                        status: "error",
                    });
                }
                setTasks((prevTasks) =>
                    prevTasks.map((t) =>
                        t.id === active.id
                            ? { ...t, status: originalStatus }
                            : t
                    )
                );
            });
    };

    const todoTasks = tasks.filter((task) => task.status === "A Fazer");
    const inProgressTasks = tasks.filter(
        (task) => task.status === "Em Andamento"
    );
    const doneTasks = tasks.filter((task) => task.status === "Concluído");

    return (
        <Container maxW="container.fluid" p={5}>
            {/* --- ADIÇÃO: O cabeçalho foi reestruturado --- */}
            <HStack justifyContent="space-between" mb={8} w="100%">
                {/* Agrupando os itens da esquerda */}
                <HStack spacing={4} align="center">
                    <Heading as="h1" size="xl">
                        Quadro Kanban
                    </Heading>
                    {currentUser && (
                        <HStack p={2} borderRadius="md">
                            <Avatar name={currentUser.username} size="sm" />
                            <Text fontWeight="medium">
                                {currentUser.username}
                            </Text>
                        </HStack>
                    )}
                </HStack>
                <Spacer />{" "}
                {/* O Spacer agora empurra apenas os botões para a direita */}
                {/* Agrupando os itens da direita */}
                <HStack>
                    <Button colorScheme="green" onClick={onCreateOpen}>
                        Adicionar Tarefa
                    </Button>
                    <Button colorScheme="red" onClick={handleLogout}>
                        Sair
                    </Button>
                </HStack>
            </HStack>

            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                collisionDetection={closestCenter}
            >
                <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                    <GridItem>
                        <Column
                            title="A Fazer"
                            tasks={todoTasks}
                            onDelete={handleDeleteItem}
                            onEdit={handleEditClick}
                        />
                    </GridItem>
                    <GridItem>
                        <Column
                            title="Em Andamento"
                            tasks={inProgressTasks}
                            onDelete={handleDeleteItem}
                            onEdit={handleEditClick}
                        />
                    </GridItem>
                    <GridItem>
                        <Column
                            title="Concluído"
                            tasks={doneTasks}
                            onDelete={handleDeleteItem}
                            onEdit={handleEditClick}
                        />
                    </GridItem>
                </Grid>
                <DragOverlay>
                    {activeTask ? <Card task={activeTask} /> : null}
                </DragOverlay>
            </DndContext>
            <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
                <ModalOverlay />
                <ModalContent as="form" onSubmit={handleCreateTask}>
                    <ModalHeader>Criar Nova Tarefa</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Título</FormLabel>
                                <Input
                                    name="title"
                                    value={newItem.title}
                                    onChange={handleFormChange}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Descrição</FormLabel>
                                <Textarea
                                    name="content"
                                    value={newItem.content}
                                    onChange={handleFormChange}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Tags</FormLabel>
                                <Input
                                    name="tags"
                                    placeholder="Ex: Urgente, UI, Backend"
                                    value={newItem.tags}
                                    onChange={handleFormChange}
                                />
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit" colorScheme="blue" mr={3}>
                            Salvar
                        </Button>
                        <Button onClick={onCreateClose}>Cancelar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {editingTask && (
                <Modal isOpen={isEditOpen} onClose={onEditClose}>
                    <ModalOverlay />
                    <ModalContent as="form" onSubmit={handleUpdateTask}>
                        <ModalHeader>Editar Tarefa</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <VStack spacing={4}>
                                <FormControl isRequired>
                                    <FormLabel>Título</FormLabel>
                                    <Input
                                        name="title"
                                        value={editingTask.title}
                                        onChange={handleEditFormChange}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Descrição</FormLabel>
                                    <Textarea
                                        name="content"
                                        value={editingTask.content}
                                        onChange={handleEditFormChange}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Tags</FormLabel>
                                    <Input
                                        name="tags"
                                        value={editingTask.tags || ""}
                                        onChange={handleEditFormChange}
                                    />
                                </FormControl>
                            </VStack>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="submit" colorScheme="blue" mr={3}>
                                Salvar Alterações
                            </Button>
                            <Button onClick={onEditClose}>Cancelar</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </Container>
    );
}

export default KanbanBoard;