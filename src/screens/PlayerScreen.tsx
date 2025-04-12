import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Text,
  Platform,
  StatusBar,
} from 'react-native';
import Video from 'react-native-video';
import {VideoItem} from '../types/video';

interface Episode {
  index: number;
  url: string;
}

export const PlayerScreen = ({route, navigation}: any) => {
  const video: VideoItem = route.params.video;
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  
  useEffect(() => {
    // 隐藏状态栏以获得更好的全屏体验
    StatusBar.setHidden(true);
    
    const parseEpisodes = () => {
      const episodeList = video.vod_play_url.split('#').map((item, index) => ({
        index: index + 1,
        url: item.split('$')[1],
      }));
      setEpisodes(episodeList);
      setCurrentEpisode(episodeList[0]);
    };

    parseEpisodes();
    
    // 组件卸载时恢复状态栏
    return () => {
      StatusBar.setHidden(false);
    };
  }, [video]);
  
  // 修改屏幕尺寸计算 - 针对横屏优化
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const isTablet = screenWidth >= 768;
  const isTV = Platform.isTV;
  
  // 计算视频尺寸 - 横屏布局
  const getVideoSize = () => {
    if (isTV) {
      return {
        width: screenWidth * 0.7,
        height: screenHeight * 0.8,
      };
    } else if (isTablet) {
      return {
        width: screenWidth * 0.65,
        height: screenHeight * 0.8,
      };
    }
    return {
      width: screenWidth * 0.65,
      height: screenHeight * 0.8,
    };
  };

  const videoSize = getVideoSize();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* 左侧视频区域 */}
        {currentEpisode && (
          <View style={[
            styles.videoWrapper,
            isTablet && styles.tabletVideoWrapper,
            isTV && styles.tvVideoWrapper
          ]}>
            <Video
              source={{uri: currentEpisode.url}}
              style={[styles.videoPlayer, videoSize]}
              controls={true}
              resizeMode="contain"
            />
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>返回</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* 右侧选集区域 */}
        <View style={styles.episodeContainer}>
          <Text style={styles.videoTitle}>{video.vod_name}</Text>
          <Text style={styles.episodeTitle}>选集</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    flexDirection: 'row', // 横屏布局
  },
  videoWrapper: {
    flex: 0.65, // 占据65%的宽度
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tabletVideoWrapper: {
    // 平板样式
  },
  tvVideoWrapper: {
    // TV样式
  },
  videoPlayer: {
    // 视频播放器样式由动态计算提供
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  episodeContainer: {
    flex: 0.35, // 占据35%的宽度
    backgroundColor: '#1a1a1a',
    padding: 16,
  },
  episodeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  episodeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  episodeButton: {
    width: '30%', // 每行显示3个
    marginHorizontal: '1.5%',
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#333',
    marginBottom: 12,
    alignItems: 'center',
  },
  activeEpisode: {
    backgroundColor: '#007AFF',
  },
  episodeText: {
    color: '#fff',
    fontSize: 14,
  },
  activeEpisodeText: {
    fontWeight: 'bold',
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  currentEpisode: {
    fontSize: 16,
    color: '#999',
    marginBottom: 16,
  },
});