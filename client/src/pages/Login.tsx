import { Box, Button, Heading, Input, Stack, Link, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export function Login() {
  return (
    <Box maxW="sm" mx="auto" mt={10} p={6} borderWidth="1px" borderRadius="md">
      <Heading size="md" mb={4}>Login</Heading>
      <Stack spacing={3}>
        <Input placeholder="Email" type="email" />
        <Input placeholder="Contraseña" type="password" />
        <Button colorScheme="blue">Ingresar</Button>
        <Link as={RouterLink} to="/lost-password">Olvidé mi contraseña</Link>
        <Text>
          ¿No tenés cuenta? <Link as={RouterLink} to="/signup" color="blue.500">Registrate</Link>
        </Text>
      </Stack>
    </Box>
  )
}

