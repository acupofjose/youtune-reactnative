import React, { useEffect, useState, useReducer } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ActivityIndicator,
    Platform,
    Dimensions
} from "react-native";

import TrackPlayer from 'react-native-track-player';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "@react-navigation/native";

import Playlist from "../../modules/models/music/playlist"

import SeekBar from "../../components/player/SeekBar";
import SwipePlaylist from "../../components/player/SwipePlaylist";

import {
    skip,
    setRepeat,
    startPlaylist,
    isRepeating
} from "../../service";

import { getSongLike, likeSong } from "../../modules/storage/MediaStorage";

import { showModal } from "../../components/modals/MoreModal";
import { fetchNext } from "../../modules/remote/API";
import { loadSongLocal, localIDs } from "../../modules/storage/SongStorage";
import { Button } from "react-native-paper";

var track = {
    id: null,
    title: null,
    artist: null,
    artwork: null,
    duration: 0
}; 

var playlist = null;

var playback = TrackPlayer.STATE_BUFFERING;

const trackListener = TrackPlayer.addEventListener("playback-track-changed", async() => {
    let id = await TrackPlayer.getCurrentTrack();
    if (id != null) {
        track = await TrackPlayer.getTrack(id);
        playlist = await TrackPlayer.getQueue();
    }
    if (changeCallback) changeCallback();
});

const stateListener = TrackPlayer.addEventListener("playback-state", e => {
    playback = e.state;
    if (changeCallback) changeCallback();
});

var changeCallback = null;

export default PlayView = ({route, navigation}) => {
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    changeCallback = () => {
        forceUpdate();
        if (track != null) {
            navigation.setOptions({title: track.title});
            navigation.setParams({v: track.id, list: track.playlistId});
        }
    };

    const setRepeating = () => {
        setRepeat(!isRepeating);
        forceUpdate();
    };

    const [isLiked, setLiked] = useState(null);

    const { dark, colors } = useTheme();

    useEffect(() => {
        const _unsubscribe = navigation.addListener('focus', () => {
            if (route.params && route.params.v != track.id) {
                TrackPlayer.reset();
                playback = TrackPlayer.STATE_BUFFERING;
                forceUpdate();
    
                if (route.params.list == "LOCAL_DOWNLOADS" && !route.params.v) {
                    let loader = new Promise(async(resolve, reject) => {
                        let localPlaylist = new Playlist();
    
                        for (let i = 0; i < localIDs.length; i++) {
                            let {title, artist, artwork, duration} = await loadSongLocal(localIDs[i]);
                            let constructedTrack = {
                                title,
                                artist,
                                artwork,
                                duration,
                                id: localIDs[i],
                                playlistId: route.params.list,
                                url: null
                            };
    
                            if (localIDs[i] == route.params.v)
                                localPlaylist.index = i;
    
                            localPlaylist.list.push(constructedTrack);
                        }
    
                        resolve(localPlaylist);
                    });
                    
                    loader.then(loadedPlaylist => {
                        startPlaylist(loadedPlaylist);
                    });
                } else if (route.params.v) {
                    fetchNext(route.params.v, route.params.list)
                        .then(loadedList => startPlaylist(loadedList))
    
                        .catch(async(reason) => {
                            console.log(reason);
                            if (localIDs.includes(route.params.v)) {
                                let localPlaylist = new Playlist();
                                localPlaylist.list.push(await loadSongLocal(route.params.v));
                                startPlaylist(localPlaylist);
                            } else {
                                navigation.goBack();
                            }
                        });
                }
            } else {
                changeCallback();
            }
        });

        return () => {
            changeCallback = null;
            _unsubscribe();
        };
    }, [track, playlist]);

    const refreshLike = async() => {
        setLiked(await getSongLike(id));
    }

    var { title, artist, artwork, id } = track;

    return <>
        <View style={stylesTop.vertContainer}>
            <View style={[imageStyles.view, {height: Dimensions.get("window").height / 2.6, width: Dimensions.get("window").width - 50}]}>
                <Image resizeMode="contain" style={imageStyles.image} source={{uri: artwork}}/>
            </View>

            <View style={[stylesBottom.container, {width: Dimensions.get("window").width - 50, height: Dimensions.get("window").height / 2.6}]}>
                <View style={controlStyles.container}>
                    <Button
                        onPress={async() => { await likeSong(id, false); await refreshLike(); }}
                        style={{paddingTop: 5}} labelStyle={{marginHorizontal: 0}} style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0}} contentStyle={{alignItems: "center", width: 50, height: 50}}
                    >
                        <MaterialIcons
                            style={{alignSelf: "center"}}
                            selectable={false}
                            name="thumb-down"
                            color={
                                isLiked == null
                                    ? colors.text
                                    : !isLiked
                                        ? colors.primary
                                        : colors.text
                            }

                            size={30}
                        />
                    </Button>
                    
                    <View style={[
                        {flexGrow: 1, width: 1, paddingHorizontal: 5, alignItems: "center"},
                        Platform.OS === "web"
                            ? {userSelect: "text"}
                            : undefined
                                ]}>
                        <Text adjustsFontSizeToFit={true} ellipsizeMode="tail" numberOfLines={1} style={[stylesBottom.titleText, {color: colors.text}]}>{title}</Text>
                        <Text adjustsFontSizeToFit={true} ellipsizeMode="tail" numberOfLines={1} style={[stylesBottom.subtitleText, {color: colors.text}]}>{artist}</Text>
                    </View>

                    <Button
                        onPress={async() => { await likeSong(id, true); await refreshLike(); }}
                        labelStyle={{marginHorizontal: 0}} style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0}} contentStyle={{alignItems: "center", width: 50, height: 50}}
                    >
                        <MaterialIcons
                            style={{alignSelf: "center"}}
                            selectable={false}
                            name="thumb-up"
                            color={
                                isLiked == null
                                    ? colors.text
                                    : isLiked
                                        ? colors.primary
                                        : colors.text
                            }

                            size={30}
                        />
                    </Button>
                </View>

                <SeekBar duration={track.duration}/>
                
                <View style={stylesBottom.buttonContainer}>
                    <Button
                        onPress={() => {}}
                        labelStyle={{marginHorizontal: 0}} style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0}} contentStyle={{alignItems: "center", width: 50, height: 50}}
                    >
                        <MaterialIcons style={{alignSelf: "center"}} selectable={false} name="cast" color={colors.text} size={30}/>
                    </Button>

                    <Button
                        onPress={() => skip(false)}
                        labelStyle={{marginHorizontal: 0}} style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0}} contentStyle={{alignItems: "center", width: 50, height: 50}}
                    >
                        <MaterialIcons style={{alignSelf: "center"}} selectable={false} name="skip-previous" color={colors.text} size={40}/>
                    </Button>

                    <View style={{alignSelf: "center", alignItems: "center", justifyContent: "center", backgroundColor: dark ? colors.card : colors.primary, width: 60, height: 60, borderRadius: 30}}>
                        {playback == TrackPlayer.STATE_BUFFERING
                            ?   <ActivityIndicator style={{alignSelf: "center"}} color={colors.text} size="large"/>

                            :   <Button
                                    labelStyle={{marginHorizontal: 0}} style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0}} contentStyle={{alignItems: "center", width: 60, height: 60}}
                                    onPress={() => {
                                        playback == TrackPlayer.STATE_PLAYING
                                            ? TrackPlayer.pause()
                                            : TrackPlayer.play();
                                    }}
                                >
                                    <MaterialIcons style={{alignSelf: "center"}} selectable={false} name={playback == TrackPlayer.STATE_PLAYING ? "pause" : "play-arrow"} color={colors.text} size={40}/>
                                </Button>
                        }
                    </View>

                    <Button
                        labelStyle={{marginHorizontal: 0}} style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0}} contentStyle={{alignItems: "center", width: 50, height: 50}}
                        onPress={() => skip(true)}
                    >
                        <MaterialIcons style={{alignSelf: "center"}} selectable={false} name="skip-next" color={colors.text} size={40}/>
                    </Button>

                    <Button
                        labelStyle={{marginHorizontal: 0}} style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0}} contentStyle={{alignItems: "center", width: 50, height: 50}}
                        onPress={() => setRepeating()}
                    >
                        <MaterialIcons style={{alignSelf: "center"}} selectable={false} name={isRepeating ? "repeat-one" : "repeat"} color={colors.text} size={30}/>
                    </Button>
                </View>

                <View style={{justifyContent: "space-between", flexDirection: "row", paddingTop: 30}}>
                    <Button
                        labelStyle={{marginHorizontal: 0}} style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0}} contentStyle={{alignItems: "center", width: 50, height: 50}}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons
                            style={{alignSelf: "center"}}
                            selectable={false}
                            name="keyboard-arrow-down"
                            color={colors.text} size={30}
                        />
                    </Button>

                    <Button
                        labelStyle={{marginHorizontal: 0}} style={{...stylesTop.topThird, borderRadius: 25, alignItems: "center", padding: 0, margin: 0}} contentStyle={{alignItems: "center", width: 50, height: 50}}
                        onPress={() => {
                            let view = {
                                title: track.title,
                                subtitle: track.artist,
                                thumbnail: track.artwork,
                                videoId: track.id
                            };

                            showModal(view);
                        }}
                    >
                        <MaterialIcons
                            style={{alignSelf: "center"}}
                            selectable={false}
                            name="more-vert"
                            color={colors.text}
                            size={30}
                        />
                    </Button>
                </View>
            </View>
        </View>

        <SwipePlaylist
            minimumHeight={50}
            backgroundColor={dark ? colors.card : colors.primary}
            textColor={colors.text}
            playlist={playlist}
            track={track}
            style={stylesRest.container}
        />
    </>
}

const stylesRest = StyleSheet.create({
    container: {
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        position: "absolute",
        bottom: 0
    },
});

const stylesBottom = StyleSheet.create({
    container: {
        alignSelf: "center",
        alignItems: "stretch",
        justifyContent: "center",
        maxWidth: 400,
        paddingHorizontal: "5%"
    },

    subtitleText: {
        paddingTop: 5,
        alignSelf: "center",
        textAlign: "center"
    },

    titleText: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center"
    },

    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "space-between",
        paddingTop: 20
    }
});

const imageStyles = StyleSheet.create({
    view: {
        alignSelf: "stretch",
        maxWidth: 400
    },

    image: {
        flex: 1
    }
});

const controlStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});


const stylesTop = StyleSheet.create({
    topSecond: {
        flexDirection: "row",
        backgroundColor: "brown",
    },

    topSecondTextOne: {
        fontWeight: "bold",
        color: "white",
    },

    topSecondTextTwo: {
        fontWeight: "bold",
        color: "white",
    },

    vertContainer: {
        width: "100%",
        height: "100%",
        paddingHorizontal: "10%",
        flexWrap: "wrap",
        alignSelf: "center",
        alignContent: "space-around",
        justifyContent: "space-around"
    }
});