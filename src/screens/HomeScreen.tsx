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
      <Image 
        source={{uri: item.vod_pic}} 
        style={[styles.thumbnail, isLargeScreen && styles.thumbnailLarge]}
        resizeMode="cover" 
      />
      <View style={styles.videoInfo}>
        <Text style={[styles.videoTitle, isLargeScreen && styles.videoTitleLarge]}>
          {item.vod_name}
        </Text>
        <Text style={[styles.videoRemarks, isLargeScreen && styles.videoRemarksLarge]}>
          {item.vod_remarks}
        </Text>
        <Text 
          style={[styles.videoBlurb, isLargeScreen && styles.videoBlurbLarge]}
          numberOfLines={isLargeScreen ? 3 : 2}
          ellipsizeMode="tail"
        >
          {item.vod_blurb}
        </Text>
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
        <View style={[styles.header, isLargeScreen && styles.headerLarge]}>
          <View style={styles.logoContainer}>
            <Text style={[styles.logoText, isLargeScreen && styles.logoTextLarge]}>随看</Text>
          </View>
          <View style={[styles.searchContainer, isLargeScreen && styles.searchContainerLarge]}>
            <TextInput
              style={[styles.searchInput, isLargeScreen && styles.searchInputLarge]}
              placeholder="请输入想看的剧集/电影/综艺..."
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
            />
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={isLargeScreen ? "large" : "small"} color="#0000ff" />
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
            numColumns={isLargeScreen ? 2 : 1}
            key={isLargeScreen ? 'grid' : 'list'}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerLarge: {
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  logoTextLarge: {
    fontSize: 40,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
  },
  searchContainerLarge: {
    maxWidth: '70%',
    alignSelf: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  searchInputLarge: {
    height: 50,
    fontSize: 18,
    paddingHorizontal: 24,
  },
  listContainer: {
    padding: 16,
  },
  videoItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    height: 160,
  },
  videoItemLarge: {
    height: 200,
    margin: 8,
    flex: 1,
  },
  thumbnail: {
    width: 90,
    height: 160,
  },
  thumbnailLarge: {
    width: 120,
    height: 200,
  },
  videoInfo: {
    flex: 1,
    padding: 12,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  videoTitleLarge: {
    fontSize: 20,
  },
  videoRemarks: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  videoRemarksLarge: {
    fontSize: 16,
    marginTop: 8,
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
    color: '#666',
  },
  loadingTextLarge: {
    fontSize: 18,
    marginTop: 16,
  },
});