import { Box, Button, Heading, Input, Stack } from '@chakra-ui/react'

export function Profile() {
  return (
    <Box maxW="md">
      <Heading size="md" mb={4}>Perfil del usuario</Heading>
      <Stack spacing={3}>
        <Input placeholder="Nombre" />
        <Input placeholder="Apellido" />
        <Input placeholder="Teléfono" />
        <Button colorScheme="blue">Guardar cambios</Button>
      </Stack>

      <Heading size="sm" mt={8} mb={3}>Cambiar contraseña</Heading>
      <Stack spacing={3}>
        <Input placeholder="Contraseña actual" type="password" />
        <Input placeholder="Nueva contraseña" type="password" />
        <Button colorScheme="purple">Actualizar contraseña</Button>
      </Stack>
    </Box>
  )
}

