import {UnitModel} from '../unit';
import * as mixins from './mixins';

import {Config} from '../../config';
import {getMarkConfig} from '../common';
import {MarkCompiler} from './base';
import * as ref from './valueref';

import {FieldDef, isFieldDef, isProjection} from '../../fielddef';
import {LATITUDE, LONGITUDE} from '../../type';
import {contains, keys} from '../../util';
import {VgGeoPointTransform} from '../../vega.schema';

function encodeEntry(model: UnitModel, fixedShape?: 'circle' | 'square') {
  const {config, encoding, width, height} = model;

  const shared = {
    ...mixins.color(model),
    ...shapeMixins(model, config, fixedShape),
    ...mixins.nonPosition('opacity', model)
  };

  const x = encoding.x;
  const y = encoding.y;
  let coordinates = {};

  if (isProjection(x) || isProjection(y)) {
    coordinates = {
      x: x,
      y: y
    };
  } else {
    coordinates = {
      x: mixins.pointPosition('x', model, ref.midX(width, config)),
      y: mixins.pointPosition('y', model, ref.midY(height, config))
    };
  }

  return {
    ...coordinates,
    ...mixins.nonPosition('size', model),
    ...shared
  };
}

function transform(model: UnitModel): VgGeoPointTransform {
  const {encoding} = model;
  let geo = {};
  keys(encoding).forEach(key => {
    const field = encoding[key] as FieldDef;
    if (isFieldDef(field) && contains([LONGITUDE, LATITUDE], field.type)) {
      geo[field.type] = {
        channel: key,
        encoding: field
      };
    }
  });

  if (keys(geo).length <= 0) {
    return null;
  }

  return {
    type: 'geopoint',
    projection: model.getName('projection'),
    as: [geo[LONGITUDE].channel, geo[LATITUDE].channel],
    fields: [geo[LONGITUDE].encoding.field, geo[LATITUDE].encoding.field]
  } as VgGeoPointTransform;
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
  transform: (model: UnitModel) => {
    return transform(model);
  }
};

export const circle: MarkCompiler = {
  vgMark: 'symbol',
  defaultRole: 'circle',
  encodeEntry: (model: UnitModel) => {
    return encodeEntry(model, 'circle');
  },
  transform: (model: UnitModel) => {
    return transform(model);
  }
};

export const square: MarkCompiler = {
  vgMark: 'symbol',
  defaultRole: 'square',
  encodeEntry: (model: UnitModel) => {
    return encodeEntry(model, 'square');
  },
  transform: (model: UnitModel) => {
    return transform(model);
  }
};
