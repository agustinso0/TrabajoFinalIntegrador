import { Box, Button, Heading, Input, Select, Stack, Text } from '@chakra-ui/react'

export function QueryReport() {
  return (
    <Box maxW="lg">
      <Heading size="md" mb={4}>Consulta + Reporte</Heading>
      <Stack spacing={3} mb={4}>
        <Input placeholder="Buscar" />
        <Select placeholder="Filtro">
          <option value="todos">Todos</option>
        </Select>
        <Button colorScheme="blue">Consultar</Button>
      </Stack>
      <Text>Resultados y opciones de reporte</Text>
    </Box>
  )
}

