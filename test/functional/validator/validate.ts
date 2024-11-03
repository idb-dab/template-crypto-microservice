import * as jsonschema from 'jsonschema'
function validateSchema(data: any, schema: any) {
    const validator = jsonschema.Validator;
    const v = new validator();
    return v.validate(data, schema)
}
export default validateSchema