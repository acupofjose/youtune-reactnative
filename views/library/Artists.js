import React from "react";
import {
    ScrollView,
    Text,
} from "react-native";

export default function Artists({ navigation }) {
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            global.setLibraryNavigator(3);
        });

        return () => unsubscribe();
    });

    return (
        <ScrollView>
            <Text>Künstler</Text>
        </ScrollView>
    );
}