import {UnitModel} from '../unit';
import * as mixins from './mixins';

import {VgPostEncodingTransform} from '../../vega.schema';
import {MarkCompiler} from './base';

export const geoshape: MarkCompiler = {
  vgMark: 'shape',
  defaultRole: 'geoshape',
  encodeEntry: (model: UnitModel) => {
    return {
      ...mixins.color(model),
      ...mixins.nonPosition('opacity', model)
    };
  },
  postEncodingTransform: (model: UnitModel): VgPostEncodingTransform[] => {
    // TODO: add support for field
    return [{
      type: 'geoshape',
      projection: model.getName('projection'),
      as: 'shape',
      field:
    } as VgPostEncodingTransform];
  }
};
