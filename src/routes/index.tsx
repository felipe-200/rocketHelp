import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native"
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"

import { SignIn } from "../screens/SignIn";
import { AppRoutes } from "./app.routes"
import { Loading } from "../components/Loading";

export const Routes = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

    useEffect(() => {
        const subscribe = auth()
            .onAuthStateChanged(response => {
                setUser(response);
                setLoading(false);
            });
        
        return subscribe;
    }, []);

    if(loading) {
        return <Loading />
    }

    return (
        <NavigationContainer>
            {user ? <AppRoutes /> : <SignIn />}
        </NavigationContainer>
    )
}