import { Box, Button, Heading, Text, HStack } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'

export function RecordDetail() {
  const { id } = useParams()
  return (
    <Box>
      <Heading size="md" mb={4}>Detalle de registro</Heading>
      <Text mb={4}>ID: {id}</Text>
      <HStack spacing={3}>
        <Button colorScheme="blue">Editar</Button>
        <Button colorScheme="red">Eliminar</Button>
      </HStack>
    </Box>
  )
}

