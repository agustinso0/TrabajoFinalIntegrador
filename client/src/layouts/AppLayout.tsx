import { Box, Flex } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'
import { Footer } from '../components/Footer'

export function AppLayout() {
  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <Flex flex="1">
        <Sidebar />
        <Box flex="1" p={6}>
          <Outlet />
        </Box>
      </Flex>
      <Footer />
    </Flex>
  )
}

