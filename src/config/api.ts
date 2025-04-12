import Config from 'react-native-config';


export const API = {
  BASE_URL: Config.API_BASE_URL || 'https://overseas.linganmin.cn', // 添加默认值
  SEARCH: '/api.php/provide/vod',
};