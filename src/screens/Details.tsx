import { useRoute } from "@react-navigation/native"
import { Text, VStack } from "native-base"
import { Header } from "../components/Header"

type RouteParams = {
    orderId: string;
}

export const Details = () => {

    const routes = useRoute();
    const { orderId } = routes.params as RouteParams;
    return (
        <VStack 
            flex={1}
            bg="gray.700"
        >  
            <Header title="Solicitacão"/>
            <Text color="white">{ orderId }</Text>
        </VStack>
    )
}