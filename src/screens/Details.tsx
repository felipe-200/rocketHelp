import { useNavigation, useRoute } from "@react-navigation/native"
import { Box, HStack, ScrollView, Text, useTheme, VStack } from "native-base"
import { useEffect, useState } from "react";
import { Header } from "../components/Header"
import firestore from "@react-native-firebase/firestore"
import { OrderProps } from "../components/Order";
import { OrderFirestoreDTO } from "../DTOs/OrderFirestoreDTO";
import { dateFormat } from "../utils/FirestoreDateFormat";
import { Loading } from "../components/Loading";
import { CircleWavyCheck, Hourglass, DesktopTower, ClipboardText } from "phosphor-react-native"
import { CardDetails } from "../components/CardDetails";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Alert } from "react-native";

type RouteParams = {
    orderId: string;
}

type OrderDetails = OrderProps & {
    description: string;
    solution: string;
    closed: string;
}

export const Details = () => {
    const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
    const [isLoading, setIsLoading] = useState(true);
    const [solution, setSolution] = useState("");
    const { colors } = useTheme();
    const routes = useRoute();
    const { orderId } = routes.params as RouteParams;
    const navigation = useNavigation();

    if(isLoading) {
        <Loading />
    }

    const handleOrderClose = () => {
        if(!solution) {
            return Alert.alert("Solicitacao", "Por favor, informe a solução do problema");
        }

        firestore()
            .collection<OrderFirestoreDTO>('orders')
            .doc(orderId)
            .update({
                status: "closed",
                solution,
                closed_at: firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                Alert.alert("Solicitacao", "Solução enviada com sucesso");
                navigation.goBack();
            })
            .catch(error => {
                console.log(error);
                Alert.alert("Solicitacao", "Ocorreu um erro ao enviar a solução");
            })
    }

    useEffect(() => {
        firestore()
            .collection<OrderFirestoreDTO>("orders")
            .doc(orderId)
            .get()
            .then(doc => {
                const { patrimony, description, status, created_at, closed_at, solution } = doc.data();
                const closed = closed_at ? dateFormat(closed_at) : null;
                setOrder({
                    id: doc.id,
                    patrimony,
                    description,
                    status,
                    solution,
                    when: dateFormat(created_at),
                    closed,
                });

                setIsLoading(false);
            })
    } , []);

    return (
        <VStack 
            flex={1}
            bg="gray.700"
        >  
            <Box px={6} bg="gray.600">
                <Header title="Solicitacão"/>
            </Box>
            <HStack
                bg="gray.500"
                justifyContent="center"
                alignItems="center"
                p={4}
            >
                {
                    order.status === "closed" ? (
                        <CircleWavyCheck size={22} color={colors.green[300]}/>
                    ) : (
                        <Hourglass size={22} color={colors.secondary[700]}/>
                    )
                }
                <Text 
                    fontSize="sm"
                    color={order.status === "closed" ? colors.green[300] : colors.secondary[700]}
                    ml={2}
                    textTransform="uppercase"
                >
                    { order.status === "closed" ? "Finalizada" : "Em andamento" }
                </Text>

            </HStack>

            <ScrollView mx={5} showsVerticalScrollIndicator={false}>
                <CardDetails
                    title="Equipamento"
                    description={`Patrimônio #${order.patrimony}`}
                    icon={DesktopTower}
                />
                <CardDetails
                    title="Descricao do problema"
                    description={order.description}
                    icon={ClipboardText}
                    footer={`Registrado em ${order.when}`}  
                />
                <CardDetails
                    title="Solucao"
                    icon={CircleWavyCheck}
                    footer={
                        order.closed && `Encerrado em ${order.closed}`
                    }
                    description={order.solution}
                >
                    {
                        order.status === "open" && 
                        <Input
                            placeholder="Descrição da solução"
                            onChangeText={setSolution}
                            h={24}
                            textAlignVertical="top"
                            multiline
                        />
                    }
                </CardDetails>
            </ScrollView>
            {
                order.status === 'open' && <Button title="Encerrar solicitacao" m={5} onPress={handleOrderClose}/>
            }
        </VStack>
    )
}