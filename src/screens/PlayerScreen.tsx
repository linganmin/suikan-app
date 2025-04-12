import React, {useState, useEffect} from 'react';
// 首先在顶部导入需要的组件
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Text,
  Platform,
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
  
  // 添加屏幕尺寸计算
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const isTabletOrTV = screenWidth >= 768 || Platform.isTV;
  
  const videoSize = isTabletOrTV ? {
    width: screenWidth * 0.8,
    height: (screenWidth * 0.8) * 9 / 16,
  } : {
    width: screenWidth,
    height: screenWidth * 9 / 16,
  };

  return (
    <View style={styles.container}>
      {currentEpisode && (
        <View style={[styles.videoWrapper, isTabletOrTV && styles.tabletVideoWrapper]}>
          <Video
            source={{uri: currentEpisode.url}}
            style={[styles.videoPlayer, videoSize]}
            controls={true}
            resizeMode="contain"
          />
        </View>
      )}
      
      <View style={styles.episodeContainer}>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 10}}>选集</Text>
        <View style={{height: 10}} />
        <ScrollView showsVerticalScrollIndicator={false}>
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
  videoWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  tabletVideoWrapper: {
    paddingVertical: 20,
  },
  videoPlayer: {
    // 移除固定宽度和比例，现在通过 videoSize 动态设置
  },
  episodeContainer: {
    backgroundColor: '#fff',
    padding: 16,
    flex: 1,
  },
  episodeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '100%',
  },
  episodeButton: {
    width: '30%', // 每行显示3个
    marginHorizontal: '1.5%',
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
    alignItems: 'center',
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