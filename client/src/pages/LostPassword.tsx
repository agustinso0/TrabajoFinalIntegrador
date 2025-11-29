import { Box, Button, Heading, Input, Stack, Text } from '@chakra-ui/react'

export function LostPassword() {
  return (
    <Box maxW="sm" mx="auto" mt={10} p={6} borderWidth="1px" borderRadius="md">
      <Heading size="md" mb={4}>Recupero de contraseña</Heading>
      <Stack spacing={3}>
        <Input placeholder="Email" type="email" />
        <Button colorScheme="blue">Enviar enlace</Button>
        <Text fontSize="sm">Se enviará un enlace de recuperación</Text>
      </Stack>
    </Box>
  )
}

