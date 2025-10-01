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
    Concluído: "green",
};

const Card = ({ task, onDelete, dragAttributes, dragListeners }) => (
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

        <HStack justify="space-between" mt={3}>
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
                px={2}
                py={1}
            >
                <Text as="span" fontSize="lg" color="gray.400">
                    ⋮⋮
                </Text>
            </Box>
        </HStack>
    </Box>
);

const SortableCard = ({ task, onDelete }) => {
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
                dragAttributes={attributes}
                dragListeners={listeners}
            />
        </div>
    );
};

const Column = ({ title, tasks, onDelete }) => {
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
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newItem, setNewItem] = useState({
        title: "",
        content: "",
        tags: "",
    });
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
    useEffect(() => {
        fetchTasks();
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
            onClose();
            setNewItem({ title: "", content: "", tags: "" });
        } catch (error) {
            if (error.response?.status !== 401) {
                console.error("Erro ao criar tarefa:", error);
                toast({
                    title: "Erro ao criar a tarefa.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
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
                if (error.response?.status !== 401) {
                    console.error("Erro ao excluir a tarefa:", error);
                    toast({
                        title: "Erro ao excluir a tarefa.",
                        status: "error",
                    });
                }
            }
        }
    };
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setNewItem((prevState) => ({ ...prevState, [name]: value }));
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
        apiClient
            .put(`/items/${active.id}`, { ...activeTask, status: newStatus })
            .then(() => {
                toast({
                    title: `Tarefa movida para "${newStatus}"!`,
                    status: "success",
                    duration: 2000,
                });
            })
            .catch((error) => {
                if (error.response?.status !== 401) {
                    console.error(
                        "Erro ao atualizar o status:",
                        error.response ? error.response.data : error.message
                    );
                    toast({
                        title: "Falha ao mover a tarefa.",
                        status: "error",
                    });
                    setTasks((prevTasks) =>
                        prevTasks.map((t) =>
                            t.id === active.id
                                ? { ...t, status: originalStatus }
                                : t
                        )
                    );
                }
            });
    };

    const todoTasks = tasks.filter((task) => task.status === "A Fazer");
    const inProgressTasks = tasks.filter(
        (task) => task.status === "Em Andamento"
    );
    const doneTasks = tasks.filter((task) => task.status === "Concluído");

    return (
        <Container maxW="container.fluid" p={5}>
            <HStack justifyContent="space-between" mb={8}>
                <Heading as="h1" size="xl">
                    Quadro Kanban
                </Heading>
                <HStack>
                    <Button colorScheme="green" onClick={onOpen}>
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
                        />
                    </GridItem>
                    <GridItem>
                        <Column
                            title="Em Andamento"
                            tasks={inProgressTasks}
                            onDelete={handleDeleteItem}
                        />
                    </GridItem>
                    <GridItem>
                        <Column
                            title="Concluído"
                            tasks={doneTasks}
                            onDelete={handleDeleteItem}
                        />
                    </GridItem>
                </Grid>
                <DragOverlay>
                    {activeTask ? <Card task={activeTask} /> : null}
                </DragOverlay>
            </DndContext>
            <Modal isOpen={isOpen} onClose={onClose}>
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
                        <Button onClick={onClose}>Cancelar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
}

export default KanbanBoard;
