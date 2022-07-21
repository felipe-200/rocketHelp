import { useState } from "react"
import { VStack, Heading, Icon, useTheme} from "native-base";
import Logo from "../assets/logo_primary.svg";
import { Input } from "../components/Input";
import { Envelope, Key } from "phosphor-react-native";
import { Button } from "../components/Button";
import auth from "@react-native-firebase/auth"; 
import { Alert } from "react-native";

export const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { colors } = useTheme();

    const handleSignIn = () => {
        if(!email || !password) {
            return Alert.alert("Entrar", "Preencha todos os campos.");
        }
        setIsLoading(true);
        auth()
            .signInWithEmailAndPassword(email, password)
            .catch(error => {
                console.log(error);
                setIsLoading(false);

                if(error.code === "auth/invalid-email") {
                    return Alert.alert("Entrar", "E-mail ou senha inválido.");
                }

                if(error.code === "auth/wrong-password") {
                    return Alert.alert("Entrar", "E-mail ou senha inválido.");
                }

                if(error.code === "auth/user-not-found") {
                    return Alert.alert("Entrar", "Usuário não cadastrado.");
                }

                return Alert.alert("Entrar", "Não foi possível acessas.");

            })
    }

    return (
        <VStack 
            flex={1} alignItems="center" 
            bgColor="gray.600" px={8} 
            pt={24}    
        >
            <Logo />
            <Heading 
                color="white" fontSize="xl"
                mt={20}
                mb={6}
            >
                Acesse sua conta
            </Heading>
            <Input 
                placeholder="E-mail" mb="4"
                InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4}/>}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <Input 
                placeholder="Senha" mb="8"
                InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4}/>}
                secureTextEntry
                onChangeText={setPassword}
            />
            <Button 
                title="Entrar" w="full"
                onPress={handleSignIn}
                isLoading={isLoading}
            />
        </VStack>
    );
}