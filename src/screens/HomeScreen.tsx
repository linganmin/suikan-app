import React, {useState} from 'react';
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
} from 'react-native';
import axios from 'axios';
import {API} from '../config/api';
import {VideoItem, SearchResponse} from '../types/video';

export const HomeScreen = ({navigation}: any) => {
  const [searchText, setSearchText] = useState('');
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      style={styles.videoItem}
      onPress={() => navigation.navigate('Player', {video: item})}>
      <Image 
        source={{uri: item.vod_pic}} 
        style={styles.thumbnail}
        resizeMode="cover" 
      />
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{item.vod_name}</Text>
        <Text style={styles.videoRemarks}>{item.vod_remarks}</Text>
        <Text 
          style={styles.videoBlurb}
          numberOfLines={2}
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
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>随看</Text>
          </View>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="请输入想看的剧集/电影/综艺..."
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
            />
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>正在加载中...</Text>
          </View>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : videos.length === 0 ? (
          <Text style={styles.emptyText}>暂无搜索结果</Text>
        ) : (
          <FlatList
            data={videos}
            renderItem={renderVideoItem}
            keyExtractor={item => item.vod_id}
            contentContainerStyle={styles.listContainer}
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
  
  // 移除原来的 appTitle 样式，改用 logoText
  // appTitle: {
  //   fontSize: 24,
  //   fontWeight: 'bold',
  //   marginBottom: 16,
  //   color: '#333',
  // },
  searchContainer: {
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 16,
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
    height: 160, // 调整整体高度以适应新的图片比例
  },
  thumbnail: {
    width: 90, // 宽度设为高度的9/16
    height: 160,
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
  videoRemarks: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  videoBlurb: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    lineHeight: 16,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    margin: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    margin: 16,
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
});