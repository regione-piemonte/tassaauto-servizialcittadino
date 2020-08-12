import { CommonService } from '@/common/api/tassa-auto'
import { COMMON_PRIVACY } from './actions.type'

export const actions = {
  async [COMMON_PRIVACY] (context, params) {
    return CommonService.scaricaInformativaPrivacy()
  }
}

export default {
  actions
}
