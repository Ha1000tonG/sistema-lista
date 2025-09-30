// frontend/src/pages/KanbanBoard.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Box, Heading, HStack, VStack, Text, useToast, Button } from '@chakra-ui/react';

import { DndContext, PointerSensor, KeyboardSensor, useSensor, useSensors, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- LÓGICA DE AUTENTICAÇÃO ---
const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
});

// Interceptor de Requisição (adiciona o token ao sair). ESTE FICA.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// O interceptor de RESPOSTA foi removido daqui.

const Card = ({ task }) => (
    <Box p={3} borderWidth="1px" borderRadius="md" boxShadow="sm" bg="white" _dark={{ bg: "gray.800" }}>
        <HStack justify="space-between">
            <Text fontWeight="bold">{task.title}</Text>
        </HStack>
        <Text fontSize="sm" mt={2}>{task.content}</Text>
    </Box>
);

const SortableCard = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style}>
        <Box {...attributes} {...listeners} cursor="grab">
            <Card task={task} />
        </Box>
    </div>
  );
};

const Column = ({ title, tasks }) => {
  const { setNodeRef } = useSortable({ id: title, data: { type: 'Column', items: tasks } });
  return (
    <Box ref={setNodeRef} p={4} borderWidth="1px" borderRadius="lg" w="300px" bg="gray.50" _dark={{ bg: "gray.700" }}>
      <Heading size="md" mb={4}>{title}</Heading>
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        <VStack spacing={4} align="stretch">
          {tasks.map(task => <SortableCard key={task.id} task={task} />)}
        </VStack>
      </SortableContext>
    </Box>
  );
};

function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const toast = useToast();
  const ITEM_TYPE = 'kanban_card';

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/items/', { params: { item_type: ITEM_TYPE } });
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeTask = tasks.find(t => t.id === active.id);
    const overIsColumn = over.data.current?.type === 'Column';
    const newStatus = overIsColumn ? over.id : tasks.find(t => t.id === over.id)?.status;

    if (!newStatus || activeTask.status === newStatus) {
        const activeIndex = tasks.findIndex(t => t.id === active.id);
        const overIndex = tasks.findIndex(t => t.id === over.id);
        if (activeIndex !== overIndex) {
            setTasks(items => arrayMove(items, activeIndex, overIndex));
        }
        return;
    }

    const originalStatus = activeTask.status;
    setTasks(prevTasks => prevTasks.map(t => t.id === active.id ? { ...t, status: newStatus } : t));

    apiClient.put(`/items/${active.id}`, { ...activeTask, status: newStatus })
      .then(() => {
        toast({ title: `Tarefa movida para "${newStatus}"!`, status: "success", duration: 2000 });
      })
      .catch((error) => {
        // --- LÓGICA DE ERRO CORRIGIDA E CENTRALIZADA AQUI ---
        if (error.response && error.response.status === 401) {
          toast({
            title: "Sessão Expirada",
            description: "Você será redirecionado para a tela de login.",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
          setTimeout(() => {
            handleLogout();
          }, 3000); // Aguarda 3s para o usuário ler o toast
        } else {
          console.error("Erro ao atualizar o status:", error);
          toast({ title: "Falha ao mover a tarefa.", status: "error" });
          // Reverte a mudança visual em caso de outros erros
          setTasks(prevTasks => prevTasks.map(t => (t.id === active.id ? { ...t, status: originalStatus } : t)));
        }
        // --------------------------------------------------
      });
  };

  const todoTasks = tasks.filter(task => task.status === 'A Fazer');
  const inProgressTasks = tasks.filter(task => task.status === 'Em Andamento');
  const doneTasks = tasks.filter(task => task.status === 'Concluído');

  return (
    <Container maxW="container.xxl" p={5}>
      <HStack justifyContent="space-between" mb={8}>
        <Heading as="h1" size="xl">Quadro Kanban</Heading>
        <Button colorScheme="red" onClick={handleLogout}>Sair</Button>
      </HStack>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <HStack spacing={8} align="flex-start" justify="center">
          <Column title="A Fazer" tasks={todoTasks} />
          <Column title="Em Andamento" tasks={inProgressTasks} />
          <Column title="Concluído" tasks={doneTasks} />
        </HStack>
        <DragOverlay>
          {activeTask ? <Card task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </Container>
  );
}

export default KanbanBoard;