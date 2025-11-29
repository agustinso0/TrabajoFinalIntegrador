import { Box, Flex, Heading, Link } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export function Header() {
  return (
    <Box bg="blue.600" color="white" px={6} py={3}>
      <Flex align="center" justify="space-between">
        <Heading size="md">Sistema TFI</Heading>
        <Flex gap={4} align="center">
          <Link as={RouterLink} to="/home">Home</Link>
          <Link as={RouterLink} to="/records">Registros</Link>
          <Link as={RouterLink} to="/users">Usuarios</Link>
          <Link as={RouterLink} to="/report">Reporte</Link>
        </Flex>
      </Flex>
    </Box>
  )
}
