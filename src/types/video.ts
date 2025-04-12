export interface VideoItem {
  vod_id: string;
  vod_name: string;
  vod_pic: string;
  vod_play_url: string;
  vod_remarks: string;
}

export interface SearchResponse {
  code: number;
  msg: string;
  page: number;
  pagecount: number;
  limit: number;
  total: number;
  list: VideoItem[];
}