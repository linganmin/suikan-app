import Config from 'react-native-config';

console.log('Config:', Config); // 添加这行来调试

export const API = {
  BASE_URL: Config.API_BASE_URL || 'https://overseas.linganmin.cn', // 添加默认值
  SEARCH: '/api.php/provide/vod',
};