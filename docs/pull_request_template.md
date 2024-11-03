# NestJS Microservice New Feature PR Review Checklist

## Restricted Files

- [ ] Ensure the following files should not be changed for PR, they should be done at skeleton level
* package.json
* env
* eslintrc.js

## Common

- [ ] Proper naming conventions must be followed
- [ ] Check for any spelling mistakes
- [ ] Check everything in code is in camel case
- [ ] Check URL endpoint is in kebab case.
- [ ] Logger must be of format Class name : method name for e.g 
    
    ```this.logger.error( `[AccountStatementController:getAccountStatement]: Error occurred while fetching statement of type: ${accountStatementDto.type} for accountNumber: ${accountStatementDto.accountNumber}.`, [requestId], ```

- [ ] Never log any sensitive information like Account number, PAN, PAssword etc in log
- [ ] Each Function should have function header comments like below
      ```/** * Fetches the given type of statement for the specified account number. * * @Body accountStatementDto - The Mandatory request body passed by the caller of this end point. * @Headers headers - { requestid, channelid } - The Mandatory headers passed by the caller of this end point. * @returns A promise that resolves to an array of objects representing the summary statement. */ ```

## Controller

- [ ] Ensure the HTTP method is POST. Only exception is Master microservice
- [ ] Controller Class must have the mandatory Filters and Interceptors
- [ ] Constructor should inject only service and logger, Nothing else should be required in the controller
- [ ] Each end point should have interceptors for encryption / decryption unless specified otherwise by the usecase     ```@UseInterceptors(DecryptRequestInterceptor, EncryptResponseInterceptor, TransformInterceptor)```
- [ ] Every endpoint must first read the requestId from header
- [ ] It should have proper error handling , with error log writing a detailed error object, not just one line message
- [ ] End point must have the format api//version/resource for example ```/api/account/v1/statement/```

## Controller Spec

- [ ] describe() and it() should have a very descriptive text, not just method name. It should be very clear to reader what the test is supposed to do
- [ ] It should have test for positive and negative scenarios.
- [ ] It should not just check for statusCode but should do a deep comparison of entire response object
- [ ] Do not Copy Request / Response schema all over the code. Make sure it is there in one file and used from other files.
- [ ] Test coverage should be 100%

## Service

- [ ] Double check the business logic , to ensure it covers all the required business feature
- [ ] If any external service is called ensure proper error handling is performed

## Service Spec

- [ ] Test Coverage should be 100%

## DTO

- [ ] Make use of Enums where ever applicable
- [ ] All RegEx must be read from common file '@idb-dab/ms-regex-validations'; There should be no hard coding of RegEx
- [ ] Ensure every attribute has decorator @ApiProperty() with values type,default and description
- [ ] Ensure correct decorators for validations are present, for example @IsString() @IsNumber()
- [ ] For Text related properties ensure you have Max value defined also

### DTO Spec

- [ ] Write separate test cases for each attribute
- [ ] Each Attribute must be tested for every decorator used
- [ ] Test Coverage must be 100%