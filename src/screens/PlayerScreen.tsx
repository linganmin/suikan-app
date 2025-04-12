import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import Video from 'react-native-video';
import {VideoItem} from '../types/video';

interface Episode {
  index: number;
  url: string;
}

export const PlayerScreen = ({route}: any) => {
  const video: VideoItem = route.params.video;
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);

  useEffect(() => {
    const parseEpisodes = () => {
      const episodeList = video.vod_play_url.split('#').map((item, index) => ({
        index: index + 1,
        url: item.split('$')[1],
      }));
      setEpisodes(episodeList);
      setCurrentEpisode(episodeList[0]);
    };

    parseEpisodes();
  }, [video]);

  return (
    <View style={styles.container}>
      {currentEpisode && (
        <Video
          source={{uri: currentEpisode.url}}
          style={styles.videoPlayer}
          controls={true}
          resizeMode="contain"
        />
      )}
      
      <View style={styles.episodeContainer}>
        <Text style={styles.episodeTitle}>选集</Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.episodeList}>
            {episodes.map((episode) => (
              <TouchableOpacity
                key={episode.index}
                style={[
                  styles.episodeButton,
                  currentEpisode?.index === episode.index && styles.activeEpisode,
                ]}
                onPress={() => setCurrentEpisode(episode)}>
                <Text
                  style={[
                    styles.episodeText,
                    currentEpisode?.index === episode.index && styles.activeEpisodeText,
                  ]}>
                  第{episode.index}集
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoPlayer: {
    width: Dimensions.get('window').width,
    aspectRatio: 16 / 9,
  },
  episodeContainer: {
    backgroundColor: '#fff',
    padding: 16,
  },
  episodeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  episodeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  episodeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  activeEpisode: {
    backgroundColor: '#007AFF',
  },
  episodeText: {
    color: '#333',
    fontSize: 14,
  },
  activeEpisodeText: {
    color: '#fff',
  },
});