import {X, Y} from '../../channel';
import {Config} from '../../config';
import {Encoding} from '../../encoding';
import {isFieldDef} from '../../fielddef';
import {GEOSHAPE, Mark} from '../../mark';
import {Projection} from '../../projection';
import {LATITUDE, LONGITUDE} from '../../type';

export function initProjection(config: Config, projection: Projection = {}, parentProjection: Projection = {}, mark?: Mark, encoding?: Encoding): Projection {
  const p = {
    ...config.projection,
    ...parentProjection,
    ...projection
  } as Projection;

  if (projection || (mark && mark === GEOSHAPE)) {
    return p;
  }

  if (encoding) {
    let latLng = false;
    [X, Y].forEach((channel) => {
      const channelDef = encoding[channel];
      if (isFieldDef(channelDef) && (channelDef.type === LATITUDE || channelDef.type === LONGITUDE)) {
        latLng = true;
      }
    });

    if (latLng) {
      return p;
    }
  }

  return undefined;
}
