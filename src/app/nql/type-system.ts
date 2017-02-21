import * as _ from 'underscore';
import { IType } from './itype';
import { ITypeSystem } from './itype-system';

export default class TypeSystem implements ITypeSystem {
  private types: IType[] = [];

  constructor() {
    this.registerType({ name: 'Boolean' });
    this.registerType({ name: 'Number' });
    this.registerType({ name: 'String' });
    this.registerType({ name: 'Entity' });
  }

  registerType(type: IType) {
    this.types.push(type);
  }

  registerTypes(types: IType[]) {
    this.types.push(...types);
  }

  get(name: string) {
    return _.find(this.types, type => type.name === name);
  }

  getTypeHierarchy(type: IType) {
    let hierarchy: IType[] = [];

    while (type) {
      hierarchy.push(type);

      if (!type.base)
        break;

      type = _.find(this.types, _type => _type.name === type.base);
    }

    return hierarchy;
  }

  isOfType(type: IType, baseType: IType) {
    return this.getTypeHierarchy(type).some(_type => _type.name === baseType.name);
  }

  getCommonType(type1: IType, type2: IType) {
    let type1Hierarchy = this.getTypeHierarchy(type1);
    let type2Hierarchy = this.getTypeHierarchy(type2);

    for (let t1 of type1Hierarchy)
      for (let t2 of type2Hierarchy)
        if (t1 === t2)
          return t1;

    return null;
  }
}
