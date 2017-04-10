import {UnitModel} from '../unit';
import * as mixins from './mixins';

import {Config} from '../../config';
import {getMarkConfig} from '../common';
import {MarkCompiler} from './base';
import * as ref from './valueref';

import {isFieldDef, isProjection} from '../../fielddef';
import {LATITUDE, LONGITUDE} from '../../type';
import {contains, keys} from '../../util';
import {VgPostEncodingTransform} from '../../vega.schema';

function encodeEntry(model: UnitModel, fixedShape?: 'circle' | 'square') {
  const {config, encoding, width, height} = model;
  return {
    ...(isProjection(encoding.x) || isProjection(encoding.y)) ? {
      x: {'field': model.getName(LONGITUDE)},
      y: {'field': model.getName(LATITUDE)}
    } : {
      x: mixins.pointPosition('x', model, ref.midX(width, config)),
      y: mixins.pointPosition('y', model, ref.midY(height, config))
    },
    ...mixins.nonPosition('size', model),
    ...mixins.color(model),
    ...shapeMixins(model, config, fixedShape),
    ...mixins.nonPosition('opacity', model)
  };
}

function postEncodingTransform(model: UnitModel): VgPostEncodingTransform[] {
  const {encoding} = model;
  let geo = {};

  keys(encoding).forEach(key => {
    const def = encoding[key];
    if (isFieldDef(def) && contains([LONGITUDE, LATITUDE], def.type)) {
      geo[def.type] = def;
    }
  });

  if (keys(geo).length <= 0) { // lat lng not found
    return null;
  }

  return [{
    type: 'geopoint',
    projection: model.getName('projection'),
    as: [model.getName(LONGITUDE), model.getName(LATITUDE)],
    fields: [geo[LONGITUDE].field, geo[LATITUDE].field]
  } as VgPostEncodingTransform];
}

export function shapeMixins(model: UnitModel, config: Config, fixedShape?: 'circle' | 'square') {
  if (fixedShape) {
    return {shape: {value: fixedShape}};
  }
  return mixins.nonPosition('shape', model, {
    defaultValue: getMarkConfig('shape', 'point', config) as string
  });
}

export const point: MarkCompiler = {
  vgMark: 'symbol',
  defaultRole: 'point',
  encodeEntry: (model: UnitModel) => {
    return encodeEntry(model);
  },
  postEncodingTransform: (model: UnitModel) => {
    return postEncodingTransform(model);
  }
};

export const circle: MarkCompiler = {
  vgMark: 'symbol',
  defaultRole: 'circle',
  encodeEntry: (model: UnitModel) => {
    return encodeEntry(model, 'circle');
  },
  postEncodingTransform: (model: UnitModel) => {
    return postEncodingTransform(model);
  }
};

export const square: MarkCompiler = {
  vgMark: 'symbol',
  defaultRole: 'square',
  encodeEntry: (model: UnitModel) => {
    return encodeEntry(model, 'square');
  },
  postEncodingTransform: (model: UnitModel) => {
    return postEncodingTransform(model);
  }
};
