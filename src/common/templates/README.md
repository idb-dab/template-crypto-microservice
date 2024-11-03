# CRUD OPERATIONS TEMPLATE
These templates (controller, service, repository) provide generic CRUD operations that can be used with any entity of MongoDB. They can also be adjusted according to specific use cases by overwriting existing methods or by adding new additional methods to your file.


## Controller Template
### Methods
| Method | Route                | RequestBody   |
| ------ | -------------------- | ------------- |  
| Get    | /                    | NIL           |
| Get    | /:id                 | NIL           |
| Get    | /search?filter="..." | NIL           |
| Post   | /                    | T             |
| Post   | /batch               | T[]           |
| Put    | /:id                 | Partial< T >  |
| Delete | /:id                 | NIL           |

### Usage
```
...
@UseInterceptors(TransformInterceptor) // to transform the response into CommonApiResponse
export class CustomerController extends CrudController<YourEntity> {
  constructor(
    private readonly customerService: CustomerService, // Your service file should extend CrudService<YourEntity>
    @Inject(LOGGER) private readonly logger: Logger, // Logger is imported from winston
  ) {
    super(customerService, logger, 'yourFieldIdentifier'); // FieldIdentifier is optional, by default it takes _id
  }

  // overwrite/add new methods/routes if needed
}
```

## Service Template
### Methods
| Method     | FunctionParameters                    | ReturnType      |               
| ------     | ------------------------------------- | --------------- |
| findAll    | requestId                             | Promise<T[]>    |
| findMany   | filter, requestId                     | Promise<T[]>    |
| findOne    | value, requestId, fieldIdentifier?    | Promise<T>      |
| create     | data, requestId, fieldIdentifier?     | Promise<T>      |
| createMany | data, requestId, fieldIdentifier?     | Promise<T[]>    | 
| update     | id, data, requestId, fieldIdentifier? | Promise<T>      |              
| remove     | id, requestId                         | Promise<string> |          

### Usage
```
...
export class YourService extends CrudService<YourEntity> {
  constructor(
    private readonly yourRepository: YourRepository, // Your repository file should extend CrudRepository<YourEntity>
    @Inject(LOGGER) private readonly logger: Logger, // Logger is imported from winston
  ) {
    super(yourRepository, logger);
  }

  // overwrite/add new methods/routes if needed
}
```

## Repository Template
### Methods
| Method           | FunctionParameters                    | ReturnType      |          
| ---------------- | ------------------------------------- | --------------- | 
| findAll          | requestId                             | Promise<T[]>    |
| findMany         | filter, requestId                     | Promise<T[]>    |
| findOne          | value, requestId, fieldIdentifier?    | Promise<T>      |
| create           | data, requestId, fieldIdentifier?     | Promise<T>      |
| createMany       | data, requestId, fieldIdentifier?     | Promise<T[]>    |          
| update           | id, data, requestId, fieldIdentifier? | Promise<T>      |                
| remove           | id, requestId                         | Promise<string> |    
| createFindObject | fieldValue, fieldIdentifier           | { ... }         |  

### Usage
```
...
export class YourRepository extends CrudRepository<YourEntity> {
  constructor(
    @InjectModel(YourEntity.name) private readonly yourModel: Model<YourEntity>,
    @Inject(LOGGER) private readonly logger: Logger, // Logger is imported from winston
  ) {
    super(yourModel, logger);
  }

  // overwrite/add new methods/routes if needed
}
```