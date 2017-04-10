import {UnitModel} from '../unit';
import * as mixins from './mixins';

import {FieldDef, isFieldDef} from '../../fielddef';
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
    const {encoding} = model;
    let field: FieldDef = encoding.shape && isFieldDef(encoding.shape) ? encoding.shape.field : undefined;
    return [{
      type: 'geoshape',
      projection: model.getName('projection'),
      as: 'shape',
      ...field ? {field: field} : {},
    } as VgPostEncodingTransform];
  }
};
