import { renderLinkPlainMD } from '../../../markdown/renderLinkMD'
import { renderListMD } from '../../../markdown/renderListMD'
import { getSocialChannelUrl } from '../../../social/models/SocialChannel/getSocialChannelUrl'
import { SocialChannel } from '../SocialChannel'

export function renderSocialChannelsMD(channels: SocialChannel[]) {
  return renderListMD(channels, c => renderLinkPlainMD(getSocialChannelUrl(c)))
}
