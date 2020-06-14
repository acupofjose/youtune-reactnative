import React from "react";
import {
    View,
    ScrollView,
    Text,
    Image,
    StatusBar,
    StyleSheet,
    ImageBackground,
    TouchableOpacity
} from "react-native";

export function PlaylistView({ route, navigation }) {
    StatusBar.setBarStyle('dark-content', true);
    const {title, subtitle} = route.params;
    return (
        <>
            <ScrollView style={styles.playlistContent}>
                <View style={styles.topicView}>
                    <Text style={styles.topicTitle}>{title}</Text>
                    <TouchableOpacity style={styles.titleView}>
                        <Image style={styles.titleCover}/>
                        <View style={styles.titleTextCollection}>
                            <Text numberOfLines={1} style={styles.titleTitle}>
                                No Friends
                            </Text>
                            <Text numberOfLines={1} style={styles.titleSubTitle}>
                                Cadmium and Rosendale - No Friends
                            </Text>
                        </View>
                        <Text style={styles.titleTimeText}>
                            3:55
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.titleView}>
                        <Image style={styles.titleCover}/>
                        <View style={styles.titleTextCollection}>
                            <Text numberOfLines={1} style={styles.titleTitle}>
                                Cities
                            </Text>

                            <Text numberOfLines={1} style={styles.titleSubTitle}>
                                Throttle - Where U Are
                            </Text>
                        </View>
                        <Text style={styles.titleTimeText}>3:00</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.titleView}>
                        <Image style={styles.titleCover}/>
                        <View style={styles.titleTextCollection}>
                            <Text numberOfLines={1} style={styles.titleTitle}>
                                Solar Eclipses
                            </Text>

                            <Text numberOfLines={1} style={styles.titleSubTitle}>
                                Hollywood Principle und Dr. Awkward - Solar Eclipses
                            </Text>
                        </View>
                        <Text style={styles.titleTimeText}>3:29</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.titleView}>
                        <Image style={styles.titleCover}/>
                        <View style={styles.titleTextCollection}>
                            <Text numberOfLines={1} style={styles.titleTitle}>
                                No Friends
                            </Text>
                            <Text numberOfLines={1} style={styles.titleSubTitle}>
                                Cadmium and Rosendale - No Friends
                            </Text>
                        </View>
                        <Text style={styles.titleTimeText}>
                            3:55
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.titleView}>
                        <Image style={styles.titleCover}/>
                        <View style={styles.titleTextCollection}>
                            <Text numberOfLines={1} style={styles.titleTitle}>
                                Cities
                            </Text>

                            <Text numberOfLines={1} style={styles.titleSubTitle}>
                                Throttle - Where U Are
                            </Text>
                        </View>
                        <Text style={styles.titleTimeText}>3:00</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.titleView}>
                        <Image style={styles.titleCover}/>
                        <View style={styles.titleTextCollection}>
                            <Text numberOfLines={1} style={styles.titleTitle}>
                                Solar Eclipses
                            </Text>

                            <Text numberOfLines={1} style={styles.titleSubTitle}>
                                Hollywood Principle und Dr. Awkward - Solar Eclipses
                            </Text>
                        </View>
                        <Text style={styles.titleTimeText}>3:29</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.titleView}>
                        <Image style={styles.titleCover}/>
                        <View style={styles.titleTextCollection}>
                            <Text numberOfLines={1} style={styles.titleTitle}>
                                No Friends
                            </Text>
                            <Text numberOfLines={1} style={styles.titleSubTitle}>
                                Cadmium and Rosendale - No Friends
                            </Text>
                        </View>
                        <Text style={styles.titleTimeText}>
                            3:55
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.titleView}>
                        <Image style={styles.titleCover}/>
                        <View style={styles.titleTextCollection}>
                            <Text numberOfLines={1} style={styles.titleTitle}>
                                Cities
                            </Text>

                            <Text numberOfLines={1} style={styles.titleSubTitle}>
                                Throttle - Where U Are
                            </Text>
                        </View>
                        <Text style={styles.titleTimeText}>3:00</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <ImageBackground style={styles.headerContainer}>
                <View style={styles.headerCenterContainer}>
                    <View style={styles.headerTopRow}>
                        <Image style={styles.albumCover}/>
                        <View style={styles.headerTopColumn}>
                            <Text style={styles.albumTitle}>{title}</Text>
                            <Text style={styles.albumSubTitle}>{subtitle}</Text>
                            <Text style={styles.albumInfo}>5 Titel - 18 Minuten</Text>
                        </View>
                        <TouchableOpacity style={styles.closeButton}
                                          onPress={() => {navigation.pop()}}>
                            <Text style={[styles.headerButtonText, styles.closeButtonText]}>X</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.headerButtonView}>
                        <TouchableOpacity style={styles.headerButton}>
                            <Text style={styles.headerButtonText}>WIEDERGEBEN</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerButton}>
                            <Text style={styles.headerButtonText}>ZUR MEDIATHEK</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerButton}>
                            <Text style={styles.headerButtonText}>TEILEN</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: 'gray',
        width: '100%',
        height: 130,
        alignSelf: 'flex-end',
        justifyContent: 'space-around',
    },

    headerCenterContainer: {
        alignSelf: 'center',
    },

    headerTopRow: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',

        paddingRight: 5,
        paddingLeft: 5
    },

    albumCover: {
        backgroundColor: 'darkgray',
        height: 70,
        width: 70,
        marginRight: 30,
    },

    closeButton: {
        backgroundColor: 'white',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 25,

        alignSelf: 'center',
    },

    headerButtonView: {
        paddingTop: 10,
        flexDirection: 'row',
        alignSelf: 'center'
    },

    headerButton : {
        marginRight: 5,
        marginLeft: 5,
        paddingLeft: 13,
        paddingRight: 13,
        paddingTop: 2,
        paddingBottom: 2,
        backgroundColor: 'white',
        borderRadius: 5
    },

    headerButtonText: {
        fontWeight: 'bold'
    },

    closeButtonText: {
        fontSize: 15,
    },

    topicView: {
        padding: 25
    },

    topicTitle: {
        fontWeight: 'bold',
        fontSize: 30
    },

    titleView: {
        paddingTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },

    titleCover: {
        width: 50,
        height: 50,
        backgroundColor: 'gray'
    },

    titleTextCollection: {
        width: '60%'
    }
});