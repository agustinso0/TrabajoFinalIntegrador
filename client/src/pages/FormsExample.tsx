import { Box, Button, Heading, Input, Select, Stack, Textarea } from '@chakra-ui/react'

export function FormsExample() {
  return (
    <Box maxW="lg">
      <Heading size="md" mb={4}>Ejemplo de formulario</Heading>
      <Stack spacing={3}>
        <Input placeholder="Título" />
        <Textarea placeholder="Descripción" />
        <Select placeholder="Estado">
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </Select>
        <Button colorScheme="blue">Guardar</Button>
      </Stack>
    </Box>
  )
}

