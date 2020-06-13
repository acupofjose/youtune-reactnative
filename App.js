import React, {Component} from 'react';

import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import SearchTab from './tabs/SearchTab';
import HomeTab from './tabs/HomeTab';
import LibraryTab from './tabs/LibraryTab';
import SettingsTab from './tabs/SettingsTab';

class HomeScreen extends Component {
    callback = (data) => {
        this.props.appCallback(data);
    }

    render() {
        return (
            <HomeTab callback={this.callback}/>
        );
    }
}

class SearchScreen extends Component {
    render() {
        return (
            <SearchTab passBackground={this.props.passBackground}/>
        );
    }
}

class LibraryScreen extends Component {
    render() {
        return (
            <LibraryTab passBackground={this.props.passBackground}/>
        );
    }
}

class SettingsScreen extends Component {
    render() {
        return (
            <SettingsTab passBackground={this.props.passBackground}/>
        );
    }
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barStyle: "lighter-content",
            background: {
                source: require("./assets/img/header.jpg"),
                bright: false,
                color: Colors.white
            }
        };
    }

    appCallback = (data) => {
        let statusStyle;
        let headerColor;
        if (data.bright) {
            statusStyle = "dark-content";
            headerColor = Colors.dark;
        } else {
            statusStyle = "lighter-content";
            headerColor = Colors.white;
        }

        this.setState({
            barStyle: statusStyle,
            background: data,
            color: headerColor
        });
    }

    getTabScreens = () => {
        return (
            <Tab.Navigator>
                <Tab.Screen name="Home"
                            options={{ tabBarIcon: ({ color, size }) =>
                                <MaterialCommunityIcons name="home" color={color} size={size} />
                            }}>
                    {() => <HomeScreen appCallback={this.appCallback} />}
                </Tab.Screen>

                <Tab.Screen name="Suche"
                            options={{ tabBarIcon: ({ color, size }) =>
                                <MaterialCommunityIcons name="magnify" color={color} size={size} />
                            }}>
                    {() => <SearchScreen passBackground={this.state.background}></SearchScreen>}
                </Tab.Screen>

                <Tab.Screen name="Bibliothek"
                            options={{ tabBarIcon: ({ color, size }) =>
                                <MaterialCommunityIcons name="folder" color={color} size={size} />
                            }}>
                    {() => <LibraryScreen passBackground={this.state.background}></LibraryScreen>}
                </Tab.Screen>

                <Tab.Screen name="Einstellungen"
                            options={{ tabBarIcon: ({ color, size }) =>
                            <MaterialCommunityIcons name="settings" color={color} size={size} />
                            }}>
                    {() => <SettingsScreen passBackground={this.state.background}></SettingsScreen>}
                </Tab.Screen>
            </Tab.Navigator>
        );
    }

    render() {
        return (
            <NavigationContainer>
                <StatusBar barStyle={this.state.barStyle}
                           hidden={false}
                           backgroundColor='transparent'
                           translucent={true}/>
                <Stack.Navigator screenOptions={{headerShown: false}}>
                    <Stack.Screen name="App" component={this.getTabScreens}></Stack.Screen>

                    <Stack.Screen name="Playlist">
                        {() => <View><Text>Playlist</Text></View>}
                    </Stack.Screen>

                    <Stack.Screen name="Musik">
                        {() => <View><Text>Musik</Text></View>}
                    </Stack.Screen>

                    <Stack.Screen name="Künstler">
                        {() => <View><Text>Künstler</Text></View>}
                    </Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
        );
    } 
}