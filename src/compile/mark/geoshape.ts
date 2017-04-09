import {UnitModel} from '../unit';
import * as mixins from './mixins';

import {MarkCompiler} from './base';

import {VgGeoShapeTransform} from '../../vega.schema';

export const geoshape: MarkCompiler = {
  vgMark: 'shape',
  defaultRole: 'geoshape',
  encodeEntry: (model: UnitModel) => {
    return {
      ...mixins.color(model),
      ...mixins.nonPosition('opacity', model)
    };
  },
  transform: (model: UnitModel): VgGeoShapeTransform => {
    // TODO: add support for field
    return {
      type: 'geoshape',
      projection: model.getName('projection'),
      as: 'shape'
    } as VgGeoShapeTransform;
  }
};
