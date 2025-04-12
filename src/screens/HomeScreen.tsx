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
      console.log( `${API.BASE_URL}${API.SEARCH}`)
         
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
      <Image source={{uri: item.vod_pic}} style={styles.thumbnail} />
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{item.vod_name}</Text>
        <Text style={styles.videoRemarks}>{item.vod_remarks}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>视频播放器</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="搜索视频..."
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
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
  );
};

const styles = StyleSheet.create({
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
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
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
  },
  thumbnail: {
    width: 120,
    height: 80,
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
});