import { VStack } from "native-base"
import { Button } from "../components/Button"
import { Header } from "../components/Header"
import { Input } from "../components/Input"

export const Register = () => {
    return (
        <VStack flex={1} p={6} bg="gray.600">   
            <Header title="Nova Solicitacão"/>
            <Input placeholder="Número do patrimônio" mt={4}/>
            <Input 
                placeholder="Descricão do problema"
                mt={5} 
                flex={1}
                multiline
                textAlignVertical="top"
            />
            <Button mt={5} title="Cadastrar" />
        </VStack>
    )
}