import { Box, Button, Heading, Input, Stack } from '@chakra-ui/react'

export function SignUp() {
  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth="1px" borderRadius="md">
      <Heading size="md" mb={4}>Registro</Heading>
      <Stack spacing={3}>
        <Input placeholder="Nombre" />
        <Input placeholder="Apellido" />
        <Input placeholder="Email" type="email" />
        <Input placeholder="Contraseña" type="password" />
        <Button colorScheme="green">Crear cuenta</Button>
      </Stack>
    </Box>
  )
}

