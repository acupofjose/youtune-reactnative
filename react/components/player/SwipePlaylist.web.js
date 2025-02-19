import React from "react";
import {
    Image,
    View,
    Text,
    StyleSheet,
    Pressable,
    Dimensions,
    FlatList,
    Animated
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SlidingUpPanel from 'rn-sliding-up-panel';
import { localIDs } from "../../modules/storage/SongStorage";

import { skipTo } from "../../service";
import { rippleConfig } from "../../styles/Ripple";

export default SwipePlaylist = ({playlist, track, backgroundColor, textColor}) => {
    const { height } = Dimensions.get("window");
    const draggableRange = { top: height - 50, bottom: 50 }
    const draggedValue = new Animated.Value(50);

    return (
        <SlidingUpPanel
            ref={c => (_panel = c)}
            draggableRange={draggableRange}
            animatedValue={draggedValue}
            snappingPoints={[51, height - 50]}
            height={height}
            friction={0.5}
        >
            <View style={styles.panel}>
                <Pressable android_ripple={rippleConfig} style={[styles.panelHeader, {backgroundColor: backgroundColor}]} onPress={() => _panel.show()}>
                    <View style={[stylesRest.smallBar, {backgroundColor: textColor}]}/>
                    <Text style={{color: textColor}} selectable={false}>PLAYLIST</Text>
                </Pressable>

                <FlatList
                    style={{height: height - 150, backgroundColor: backgroundColor}}
                    contentContainerStyle={stylesRest.playlistContainer}

                    data={playlist}

                    keyExtractor={item => item.id}
                    renderItem={({item, index}) =>
                        <Pressable android_ripple={rippleConfig}
                                    style={{
                                        height: 50,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginVertical: 5
                                    }}

                                    onPress={() => skipTo({id: item.id})}
                        >
                            {
                                track != null
                                    ? track.id == item.id
                                        ? <MaterialIcons style={{width: 30, textAlign: "center", textAlignVertical: "center"}} name="play-arrow" color={textColor} size={20}/>
                                        : <Text style={{width: 30, textAlign: "center", fontSize: 15, color: textColor}}>{index + 1}</Text>

                                    : <Text style={{width: 30, textAlign: "center", fontSize: 15, color: textColor}}>{index + 1}</Text>
                            }

                            <Image style={{height: 50, width: 50, marginRight: 10}} source={{uri: item.artwork}}/>

                            <View style={{width: 0, flexGrow: 1, flex: 1}}>
                                <Text style={{color: textColor}} numberOfLines={2}>{item.title}</Text>
                                <Text style={{color: textColor}} numberOfLines={1}>{item.artist}</Text>
                            </View>

                            {
                                item != null 
                                ? localIDs.includes(item.id)
                                    ? <MaterialIcons style={{width: 30, textAlign: "center", textAlignVertical: "center"}} name="file-download-done" color={textColor} size={20}/>
                                    : undefined
                                : undefined
                            }
                            
                        </Pressable>
                    }
                />
            </View>
        </SlidingUpPanel>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "stretch",
        justifyContent: "center"
    },

    panel: {
        flex: 1,
        backgroundColor: "transparent",
        position: "relative",
        alignSelf: "center",
        width: "100%",
        maxWidth: 800
    },

    panelHeader: {
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 10
    },

    textHeader: {
        fontSize: 28,
        color: "#FFF"
    }
});

const stylesRest = StyleSheet.create({
    playlistContainer: {
        width: "100%",
        paddingHorizontal: 10,
        paddingBottom: 50
    },

    topAlign: {
        alignSelf: "center",
        marginBottom: 10
    },

    smallBar: {
        height: 4,
        width: 30,
        borderRadius: 2,
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 10
    }
});