import React from "react";
import {Box, Flex, Title} from "@mantine/core";


export default function StageContainer({roomCode, children}: {roomCode?: string, children: React.ReactNode}) {

    return (
        <Flex direction="column" h="100%">
            {roomCode && (
                <Box
                    bg="dark.4" c="var(--mantine-color-body)"
                    style={{boxShadow: "var(--mantine-shadow-sm)"}}
                >
                    <Title size="h2" ta="center">{roomCode}</Title>
                </Box>
            )}
            {children}
        </Flex>
    )
}
