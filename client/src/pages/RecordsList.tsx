import { Box, Button, Heading, Input, Select, Stack, Table, Tbody, Td, Th, Thead, Tr, HStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

const mockRecords = Array.from({ length: 10 }).map((_, i) => ({ id: String(i + 1), nombre: `Registro ${i + 1}` }))

export function RecordsList() {
  return (
    <Box>
      <Heading size="md" mb={4}>Lista de registros</Heading>
      <Stack direction={{ base: 'column', md: 'row' }} spacing={3} mb={4}>
        <Input placeholder="Buscar" />
        <Select placeholder="Filtro">
          <option value="todos">Todos</option>
          <option value="activos">Activos</option>
        </Select>
        <Select placeholder="Cant.">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </Select>
        <Button colorScheme="blue">Aplicar</Button>
      </Stack>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {mockRecords.map(r => (
            <Tr key={r.id}>
              <Td>
                <Button as={RouterLink} to={`/records/${r.id}`} variant="link">{r.nombre}</Button>
              </Td>
              <Td>
                <HStack spacing={2}>
                  <Button size="sm">Editar</Button>
                  <Button size="sm" colorScheme="red">Eliminar</Button>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}

