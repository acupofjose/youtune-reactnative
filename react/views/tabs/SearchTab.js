import React, { useEffect, useState } from 'react';
import {
    SectionList,
    Text,
    View,
    TextInput,
    Keyboard,
    Pressable,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from 'react-native';

import { useTheme } from '@react-navigation/native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import Entry from '../../components/shared/Entry';
import { setHeader } from '../../components/overlay/Header';
import { fetchResults } from '../../modules/remote/API';
import { shelvesStyle } from '../../styles/Shelves';
import { rippleConfig } from '../../styles/Ripple';
import { searchBarStyle } from '../../styles/Search';
import { resultHomeStyle, preResultHomeStyle } from '../../styles/Home';

export default SearchTab = ({route, navigation}) => {
    const [searchText, setSearchText] = useState("Look for music using the search bar");
    const [shelves, setShelves] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [suggestion, setSuggestion] = useState(null);
    const [instead, setInstead] = useState(null);
    const [query, setQuery] = useState("");
    const {dark, colors} = useTheme();

    useEffect(() => {
        if (route.params)
            if (route.params.q) {
                setQuery(route.params.q);
                search(route.params.q)
            }

        const unsubscribe = navigation.addListener('tabPress', () => {
            setHeader({title: "Search"});
        });

        const unsubscribe2 = navigation.addListener('focus', () => {
            setHeader({title: "Search"});
        });

        return () => {
            unsubscribe();
            unsubscribe2();
        }

    }, []);

    const search = (query, params) => {
        navigation.setParams({q: query});
        Keyboard.dismiss();
        if (query.length > 0) {
            setLoading(true);

            fetchResults(query, params)
                .then(data => {
                    if (data.suggestionOption == suggestion)
                        data.suggestionOption = null;

                    if (data.insteadOption == instead)
                        data.insteadOption = null;
                    
                    if (data.shelves.length == 0) {
                        setSearchText("No search results");

                        setTimeout(() => {
                            setSearchText("Look for music using the search bar");
                        }, 2000);
                    }

                    setShelves(data.shelves);
                    setInstead(data.instead);
                    setSuggestion(data.suggestion);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                    setSearchText("You are offline");

                    setTimeout(() => {
                        setSearchText("Look for music using the search bar");
                    }, 2000);
                });
        }
    }

    const searchInstead = query => {
        setQuery(query);
        search(query, null);
    }

    return <>
        <SectionList
            contentContainerStyle={shelvesStyle.searchContainer}

            ListEmptyComponent={<>
                <Text style={[preResultHomeStyle.preHomeBottomText, preResultHomeStyle.preHomeTopText, {color: colors.text}]}>🔍</Text>
                <Text style={[preResultHomeStyle.preHomeBottomText, {color: colors.text}]}>{searchText}</Text>
            </>}

            renderSectionHeader={({ section: { title } }) => (
                <View style={resultHomeStyle.textView}>
                    <Text style={[resultHomeStyle.homeText, {color: colors.text}]}>{title}</Text>
                </View>
            )}

            renderSectionFooter={({ section: { bottomEndpoint } }) => (
                bottomEndpoint != null
                    ? <Pressable
                        android_ripple={rippleConfig}
                        onPress={() => search(bottomEndpoint.query, bottomEndpoint.params)}
                        style={{padding: 10, margin: 20, width: 100, borderRadius: 10, alignItems: "center", backgroundColor: colors.card}}
                    >
                        <Text style={{color: colors.text, fontSize: 15, fontWeight: "700"}}>{bottomEndpoint.text}</Text>
                    </Pressable>

                    : null
            )}

            progressViewOffset={20}
            sections={shelves}

            refreshing={loading}
            onRefresh={() => search(query, null)}

            keyExtractor={(item, index) => index + item.title}
            renderItem={({ item }) =>  <Entry entry={item} navigation={navigation}/>}
        />

        {instead != null
            ? <View style={searchBarStyle.suggestion}>
                <Pressable android_ripple={rippleConfig} style={searchBarStyle.suggestionContainer} onPress={() => searchInstead(instead.endpoints.corrected.query)}>
                    <Text style={{color: colors.text}}>{instead.endpoints.corrected.text}</Text>
                    <Text style={{color: colors.text}}>
                        {instead.correctedList
                            .map(entry => <Text style={entry.italics ? {fontWeight: "bold", color: colors.text} :null}>{entry.text}</Text>)}
                    </Text>
                </Pressable>

                <Pressable android_ripple={rippleConfig} style={searchBarStyle.suggestionContainer} onPress={() => searchInstead(instead.endpoints.original.query)}>
                    <Text style={{color: colors.text}}>{instead.endpoints.original.text}</Text>
                    <Text style={{color: colors.text}}>
                        {instead.originalList
                            .map(entry => <Text style={entry.italics ? {fontWeight: "bold", color: colors.text} :null}>{entry.text}</Text>)}
                    </Text>
                </Pressable>
            </View>

            : null
        }

        <KeyboardAvoidingView enabled={Platform.OS == "ios" ? true : false} behavior="padding" keyboardVerticalOffset={170}>
            {suggestion != null
                ?   <View style={searchBarStyle.suggestion}>
                        <Pressable android_ripple={rippleConfig} style={[searchBarStyle.suggestionContainer, {width: "25%"}]} onPress={() => searchInstead(suggestion.endpoints.query)}>
                            <Text style={{color: colors.text}}>{suggestion.endpoints.text}</Text>
                            <Text style={{color: colors.text}}>
                                {suggestion.correctedList
                                    .map(entry => <Text style={entry.italics ? {fontWeight: "bold", color: colors.text} :null}>{entry.text}</Text>)}
                            </Text>
                        </Pressable>
                    </View>

                : null
            }

            <View style={[searchBarStyle.container, {backgroundColor: colors.card}]}>
                <View style={searchBarStyle.inputBox}>
                    <TextInput style={[searchBarStyle.input, {color: colors.text}]}
                            placeholder="Search"
                            value={query}
                            onChangeText={newQuery => setQuery(newQuery)}
                            placeholderTextColor={colors.text}
                            onSubmitEditing={() => search(query, null)}/>
                    <Pressable onPress={() => search(query, null)}
                            android_ripple={rippleConfig}
                            style={searchBarStyle.button}>
                        { loading
                            ? <ActivityIndicator color={colors.text} size="small"/>
                            : <MaterialIcons name="search" color={colors.text} size={24}/>
                        }
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    </>
}