import { Box, Heading, SimpleGrid, Stat } from '@chakra-ui/react'

export function Home() {
  return (
    <Box>
      <Heading size="md" mb={6}>Panel principal</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Box p={4} borderWidth="1px" borderRadius="md">
          <Stat.Root>
            <Stat.Label>Usuarios</Stat.Label>
            <Stat.ValueText>0</Stat.ValueText>
          </Stat.Root>
        </Box>
        <Box p={4} borderWidth="1px" borderRadius="md">
          <Stat.Root>
            <Stat.Label>Reservas</Stat.Label>
            <Stat.ValueText>0</Stat.ValueText>
          </Stat.Root>
        </Box>
        <Box p={4} borderWidth="1px" borderRadius="md">
          <Stat.Root>
            <Stat.Label>Ingresos</Stat.Label>
            <Stat.ValueText>$0</Stat.ValueText>
          </Stat.Root>
        </Box>
      </SimpleGrid>
    </Box>
  )
}
