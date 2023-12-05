import {CommonListParams} from '../types/api/requestParams';
import {ArtWorkListResponse} from '../types/api/responses/artworksResponse';

class ApiManager {
  static instance: ApiManager;
  static getSharedInstance() {
    if (!ApiManager.instance) {
      ApiManager.instance = new ApiManager();
    }
    return ApiManager.instance;
  }
  private get = async <T>({
    path,
    data = {},
  }: {
    path: string;
    data?: Object;
  }): Promise<T> => {
    const endpoint = `${path}${encodeQueryData(data)}`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    console.log('Get api result:', {
      response,
      result: JSON.stringify(result),
    });

    return result;
  };

  fetchArtworkList = (data: CommonListParams): Promise<ArtWorkListResponse> => {
    return this.get({
      path: 'https://api.artic.edu/api/v1/artworks',
      data,
    });
  };
}

const encodeQueryData = (data = {}, originPath = '') => {
  let ret = [];
  if (Object.keys(data).length === 0) {
    return '';
  }
  for (let d in data) {
    ret.push(
      encodeURIComponent(d) +
        '=' +
        encodeURIComponent(data[d as keyof typeof data]),
    );
  }
  const queryString = `${ret.join('&')}`;
  if (originPath?.includes('?')) {
    return `&${queryString}`;
  }
  return `?${queryString}`;
};

export default ApiManager.getSharedInstance();
