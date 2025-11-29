import { Box, Button, Heading, Table, Tbody, Td, Th, Thead, Tr, HStack } from '@chakra-ui/react'

const mockUsers = [
  { id: '1', nombre: 'Usuario 1', email: 'u1@email.com' },
  { id: '2', nombre: 'Usuario 2', email: 'u2@email.com' },
]

export function Users() {
  return (
    <Box>
      <Heading size="md" mb={4}>Usuarios</Heading>
      <Button colorScheme="green" mb={4}>Nuevo usuario</Button>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Email</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {mockUsers.map(u => (
            <Tr key={u.id}>
              <Td>{u.nombre}</Td>
              <Td>{u.email}</Td>
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

