import $ from "../helpers/util";
import Config from "../config/config"

export function getPublicKey(data, success, fail) {
  return $.request({
    url: Config.URL.listTranslateLang,
    method: 'get',
    data: data,
    loading: false,
    ajaxCache: {
      timeout: Config.CACHE_EXPIRE
    },
    success:success,
    fail:fail
  })
}
