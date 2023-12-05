import {makeAutoObservable} from 'mobx';
import apiManager from '../managers/apiManager';
import {ArtWorkListResponse} from '../types/api/responses/artworksResponse';

const Limit = 50;
class WaterfallStore {
  list: ArtWorkListResponse['data'] = [];
  isFetching = false;
  private page = 1;

  constructor() {
    makeAutoObservable(this);
  }

  async fetcher(): Promise<void> {
    try {
      this.isFetching = true;
      const result = await apiManager.fetchArtworkList({
        limit: Limit,
        page: this.page,
      });

      result.data.forEach(item => {
        item.height = Math.floor(Math.random() * 40) + 150;
      });

      this.updateList(result.data);
      this.page++;
    } catch (e) {
      console.log('fetch failed', e);
    } finally {
      this.isFetching = false;
    }
  }

  updateList = (list: ArtWorkListResponse['data']) => {
    this.list = [...this.list, ...list];
  };
}

const waterfallStore = new WaterfallStore();

export default waterfallStore;
