import { VStack } from "native-base"
import { useState } from "react"
import { Alert } from "react-native"
import { Button } from "../components/Button"
import { Header } from "../components/Header"
import { Input } from "../components/Input"
import firestore from "@react-native-firebase/firestore"
import { useNavigation } from "@react-navigation/native"

export const Register = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [patrimony, setPatrimony] = useState("");
    const [description, setDescription] = useState("");

    const navigation = useNavigation();

    const handleNewOrderRegister = () => {
        if(!patrimony || !description) {
            return Alert.alert("Registrar", "Preencha todos os campos.");
        }
        setIsLoading(true);
        firestore()
            .collection("orders")
            .add({
                patrimony,
                description,
                status: "open",
                created_at: firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                Alert.alert("Registrar", "Pedido registrado com sucesso.");
                navigation.goBack();
            })
            .catch(error => {
                console.log(error);
                setIsLoading(false);
                return Alert.alert("Registrar", "Erro ao registrar pedido.");
            })
    }   

    return (
        <VStack flex={1} p={6} bg="gray.600">   
            <Header title="Nova Solicitacão"/>
            <Input 
                placeholder="Número do patrimônio" 
                mt={4}
                onChangeText={setPatrimony}
            />
            <Input 
                placeholder="Descricão do problema"
                mt={5} 
                flex={1}
                multiline
                textAlignVertical="top"
                onChangeText={setDescription}
            />
            <Button 
                mt={5} 
                title="Cadastrar" 
                isLoading={isLoading}
                onPress={handleNewOrderRegister}
            />
        </VStack>
    )
}