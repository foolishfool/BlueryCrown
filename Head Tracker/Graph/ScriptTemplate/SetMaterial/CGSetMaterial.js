'use strict';
const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');
class CGSetMaterial extends BaseNode {
  constructor() {
    super();
    this.materialPropertySheetNameMap = {
      Texture2D: 'texmap',
      Double: 'floatmap',
      Vector2f: 'vec2map',
      Vector3f: 'vec3map',
      Vector4f: 'vec4map',
      Color: 'vec4map',
    };
    this.materialSetterMap = {
      Texture2D: 'setTex',
      Double: 'setFloat',
      Vector2f: 'setVec2',
      Vector3f: 'setVec3',
      Vector4f: 'setVec4',
      Color: 'setVec4',
    };
  }

  transValueType(value) {
    if (this.valueType === 'Color' && value instanceof Amaz.Color) {
      return new Amaz.Vector4f(value.r, value.g, value.b, value.a);
    } else {
      return value;
    }
  }

  execute() {
    const materialArray = this.inputs[1]();
    const uniformName = this.inputs[2]();
    const uniformValue = this.inputs[3]();

    if (
      materialArray === null ||
      materialArray === undefined ||
      uniformName === null ||
      uniformName === undefined ||
      uniformValue === null ||
      uniformValue === undefined
    ) {
      return;
    }

    const materialUniform = this.transValueType(uniformValue);

    for(const material of materialArray){
      if(material === null || material === undefined){
        return;
      }

      const propertySheetHasIntUniform = material.properties.intmap.has(uniformName);

      // Handling the int edge case
      if (propertySheetHasIntUniform) {
        material.setInt(uniformName, Math.round(materialUniform));
      } else {
        const propertySheet = material.properties[this.materialPropertySheetNameMap[this.valueType]];
  
        if (propertySheet.has(uniformName)) {
          material[this.materialSetterMap[this.valueType]](uniformName, materialUniform);
        }
      }
    }
    
    if (this.nexts[0]) {
      this.nexts[0]();
    }
  }
}
exports.CGSetMaterial = CGSetMaterial;
