import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    Pressable
} from "react-native";

import { useTheme } from "@react-navigation/native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import FlatEntries, { setHackTracks } from "../../components/collections/FlatEntries";
import { fetchBrowse } from "../../modules/remote/API";

import {
    bottomBarStyle,
    bottomBarAlbumStyle
} from "../../styles/BottomBar";
import { rippleConfig } from "../../styles/Ripple";

export default PlaylistView = ({ route, navigation }) => {
    const {dark, colors} = useTheme();
    const [playlist, setPlaylist] = useState(null);

    useEffect(() => {
        const _unsubscribe = navigation.addListener('focus', () => {
            if (playlist == null) {
                fetchBrowse(route.params.list)
                    .then(playlist => {
                        navigation.setOptions({ title: playlist.title });
                        navigation.setParams({ list: playlist.playlistId});
                        setPlaylist(playlist);
                    });
            } else {
                if (playlist.playlistId != route.params.list) {
                    fetchBrowse(route.params.list)
                        .then(playlist => {
                            navigation.setOptions({ title: playlist.title });
                            navigation.setParams({ list: playlist.playlistId});
                            setPlaylist(playlist);
                        });
                }
            }
        });
        
        return () => {
            setHackTracks(null);
            _unsubscribe();
        }
    }, []);

    var entries;
    if (playlist != null)
        entries = playlist.entries;
    else
        entries = [];
    
    return <>
        <FlatEntries 
            entries={entries}
            isPlaylist={true}
            playlistId={route.params.list}
            navigation={navigation}
        />

        <View style={{
            alignSelf: "stretch",
            alignItems: "stretch",
            justifyContent: "space-evenly",
            backgroundColor: colors.card,
            width: "100%"
        }}>
            <View style={bottomBarStyle.topRow}>
                <Image style={bottomBarAlbumStyle.albumCover} source={{uri: playlist == null ? null : playlist.thumbnail}}/>
                <View>
                    {
                        playlist == null
                        ? <>
                            <View style={{width: 250, height: 20, marginBottom: 2, backgroundColor: colors.text}}/>
                            <View style={{width: 200, height: 20, marginBottom: 2, backgroundColor: colors.text}}/>
                            <View style={{width: 230, height: 20, marginBottom: 2, backgroundColor: colors.text}}/>
                        </>
                        : <>
                            <Text numberOfLines={1} style={[bottomBarAlbumStyle.albumTitle, bottomBarAlbumStyle.albumText, {color: colors.text}]}>
                                {playlist.title}
                            </Text>
                            <Text numberOfLines={1} style={[bottomBarAlbumStyle.albumSubtitle, bottomBarAlbumStyle.albumText, {color: colors.text}]}>
                                {playlist.subtitle}
                            </Text>
                            <Text numberOfLines={1} style={[bottomBarAlbumStyle.albumInfo, bottomBarAlbumStyle.albumText, {color: colors.text}]}>
                                {playlist.secondSubtitle}
                            </Text>
                        </>
                    }
                </View>
                <Pressable android_ripple={rippleConfig} style={[bottomBarStyle.closeButton, {backgroundColor: colors.border}]}
                            onPress={() => navigation.pop()}>
                    <MaterialIcons name="arrow-back" color={colors.text} size={20}/>
                </Pressable>
            </View>

            <View style={{
                    flexDirection: "row",
                    alignSelf: "stretch",
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "space-evenly",
                    paddingVertical: 10
            }}>
                <Pressable android_ripple={rippleConfig} style={[bottomBarStyle.button, {backgroundColor: colors.border}]}>
                    <Text style={[bottomBarStyle.buttonText, {color: colors.text}]}>PLAY</Text>
                </Pressable>
                <Pressable android_ripple={rippleConfig} style={[bottomBarStyle.button, {backgroundColor: colors.border}]}>
                    <Text style={[bottomBarStyle.buttonText, {color: colors.text}]}>ADD TO LIBRARY</Text>
                </Pressable>
                <Pressable android_ripple={rippleConfig} style={[bottomBarStyle.button, {backgroundColor: colors.border}]}>
                    <Text style={[bottomBarStyle.buttonText, {color: colors.text}]}>SHARE</Text>
                </Pressable>
            </View>
        </View>
    </>
}