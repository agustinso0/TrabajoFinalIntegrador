import { Box, Button, Heading, Text } from '@chakra-ui/react'

export function Report() {
  const onPrint = () => {
    window.print()
  }
  return (
    <Box>
      <Heading size="md" mb={4}>Reporte</Heading>
      <Text mb={4}>Vista lista para impresión</Text>
      <Button onClick={onPrint} colorScheme="blue">Imprimir</Button>
    </Box>
  )
}

