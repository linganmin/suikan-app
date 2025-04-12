import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import axios from 'axios';
import {API} from '../config/api';
import {VideoItem, SearchResponse} from '../types/video';

export const HomeScreen = ({navigation}: any) => {
  const [searchText, setSearchText] = useState('');
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { width, height } = useWindowDimensions();
  
  // 判断是否为大屏设备（平板或电视）
  const isLargeScreen = width >= 768;

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
         
      const response = await axios.get<SearchResponse>(`${API.BASE_URL}${API.SEARCH}`, {
        params: {
          ac: 'videolist',
          wd: searchText,
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0',
        },
      });
        
      setVideos(response.data.list || []);
    } catch (err) {
        console.error(err);
      setError('搜索失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const renderVideoItem = ({item}: {item: VideoItem}) => (
    <TouchableOpacity
      style={[styles.videoItem, isLargeScreen && styles.videoItemLarge]}
      onPress={() => navigation.navigate('Player', {video: item})}>
      <View style={styles.videoContent}>
        <Image 
          source={{uri: item.vod_pic}} 
          style={[styles.thumbnail, isLargeScreen && styles.thumbnailLarge]}
          resizeMode="cover" 
        />
         <View style={styles.videoTextOverlay}>
          <Text 
            style={[styles.videoTitle, isLargeScreen && styles.videoTitleLarge]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.vod_name}
          </Text>
          <Text style={[styles.videoRemarks, isLargeScreen && styles.videoRemarksLarge]}>
            {item.vod_remarks}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={true}
      />
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          {/* 左侧区域 */}
          <View style={styles.leftPanel}>
            <View style={styles.logoContainer}>
              <Text style={[styles.logoText, isLargeScreen && styles.logoTextLarge]}>随看</Text>
              <Text style={styles.logoSubtitle}>海量影视资源</Text>
            </View>
            
            {/* 增加间隔 */}
            <View style={styles.spacer} />
            
            <View style={styles.searchBox}>
              <TextInput
                style={[styles.searchInput, isLargeScreen && styles.searchInputLarge]}
                placeholder="剧集/电影/综艺名"
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleSearch}
              />
            </View>
          </View>

          {/* 右侧结果区域 */}
          <View style={styles.rightPanel}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size={isLargeScreen ? "large" : "small"} color="#fff" />
                <Text style={[styles.loadingText, isLargeScreen && styles.loadingTextLarge]}>
                  正在加载中...
                </Text>
              </View>
            ) : error ? (
              <Text style={[styles.errorText, isLargeScreen && styles.errorTextLarge]}>{error}</Text>
            ) : videos.length === 0 ? (
              <Text style={[styles.emptyText, isLargeScreen && styles.emptyTextLarge]}>暂无搜索结果</Text>
            ) : (
              <FlatList
                data={videos}
                renderItem={renderVideoItem}
                keyExtractor={item => item.vod_id}
                contentContainerStyle={styles.listContainer}
                numColumns={3}
                columnWrapperStyle={styles.columnWrapper}
              />
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};



// 在文件顶部添加颜色常量
const COLORS = {
  primary: '#000',
  secondary: '#696969',
  text: {
    light: '#fff',
    gray: '#666',
  },
  background: {
    light: '#f0f0f0',
    dark: '#000',
  },
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background.dark,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background.dark,
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.background.dark,
    alignItems: 'center',
    shadowColor: '#121212',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPanel: {
    width: 300,
    padding: 16,
    backgroundColor: COLORS.background.dark,
    borderRightWidth: 1,
    borderRightColor: COLORS.secondary,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 16, // 增加顶部内边距
  },
  rightPanel: {
    flex: 1,
    padding: 16,
  },
  searchBox: {
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  searchInputLarge: {
    height: 50,
    fontSize: 18,
  },
  listContainer: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 12,
  },
  videoItem: {
    flex: 1,
    maxWidth: '32%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  videoItemLarge: {
    maxWidth: '32%',
  },
  videoContent: {
    flex: 1,
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: 160,  // 固定高度
  },
  thumbnailLarge: {
    height: 180,  // 大屏下的高度
  },
  videoTitle: {
    width: '100%',
    padding: 4,  // 减小内边距
    fontSize: 12,  // 减小字体大小
    fontWeight: '600',
    color: COLORS.text.light,
    textAlign: 'center',
  },
  videoTitleLarge: {
    fontSize: 14,  // 大屏下的字体大小
  },
  videoRemarks: {
    padding: 2,  // 减小内边距
    fontSize: 10,  // 减小字体大小
    color: COLORS.text.light,
    textAlign: 'center',
  },
  videoRemarksLarge: {
    fontSize: 12,  // 大屏下的字体大小
  },
  videoBlurb: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    lineHeight: 16,
  },
  videoBlurbLarge: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    margin: 16,
  },
  videoTextOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明黑色背景
    width: '100%',
  },
  errorTextLarge: {
    fontSize: 18,
    margin: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    margin: 16,
  },
  emptyTextLarge: {
    fontSize: 18,
    margin: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.text.light, 
  },
  loadingTextLarge: {
    fontSize: 18,
    marginTop: 16,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.light,
  },
  logoTextLarge: {
    fontSize: 30,
  },
  logoSubtitle: {
    fontSize: 14,
    color: COLORS.text.light,
    marginTop: 4,
  },
  spacer: {
    height: 20, // 间隔高度
  },
});