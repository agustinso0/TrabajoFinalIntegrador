import { Box, VStack, Link } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export function Sidebar() {
  return (
    <Box w={{ base: '0', md: '240px' }} bg="gray.50" borderRightWidth="1px" p={4} display={{ base: 'none', md: 'block' }}>
      <VStack align="stretch" spacing={3}>
        <Link as={RouterLink} to="/home">Inicio</Link>
        <Link as={RouterLink} to="/profile">Perfil</Link>
        <Link as={RouterLink} to="/users">Usuarios</Link>
        <Link as={RouterLink} to="/abm">Formularios</Link>
        <Link as={RouterLink} to="/records">Registros</Link>
        <Link as={RouterLink} to="/report">Imprimir reporte</Link>
        <Link as={RouterLink} to="/query-report">Consulta + Reporte</Link>
      </VStack>
    </Box>
  )
}

