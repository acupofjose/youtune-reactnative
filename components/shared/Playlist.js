import React, { PureComponent } from 'react';

import {
    Text,
    Image,
    TouchableOpacity,
    View
} from "react-native";

import { playlistStyle } from '../../styles/Playlist';
import { handleMedia } from '../../modules/Event';

export default ({ playlist, navigation, style }) => {
    let { title, subtitle, thumbnail } = playlist;
    let { videoId, browseId, playlistId } = playlist;

    let viewObject = {
        videoId: videoId,
        browseId: browseId,
        playlistId: playlistId,
        ...navigation
    };

    return (
        <View style={[style, playlistStyle.container]}>
            <TouchableOpacity onPress={() => handleMedia(viewObject, navigation)}>
                <Image style={playlistStyle.cover} source={{uri: thumbnail}}/>
            </TouchableOpacity>

            <Text style={playlistStyle.title}
                    numberOfLines={2}>
                {title}
            </Text>

            <Text style={playlistStyle.description}
                    numberOfLines={2}>
                {subtitle}
            </Text>
        </View>
    );
}