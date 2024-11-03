import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Put,
  Delete,
  UseInterceptors,
  Headers,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CrudService } from './crud.service';
import { Logger } from 'winston';
import { CONSTANTS } from '../config/configuration';
import { HeaderInterceptor } from '@idb-dab/ms-interceptors';
import { ApiBody } from '@nestjs/swagger';

/**
 * Controller for CRUD operations on entities.
 */
@Controller({
  path: CONSTANTS.ROUTES.CRUD_TEMPLATE.CONTROLLER,
  version: CONSTANTS.ROUTES.CRUD_TEMPLATE.VERSION,
})
@UsePipes(new ValidationPipe({ whitelist: true })) // Apply a validation pipe for DTO validations
@UseInterceptors(HeaderInterceptor) // Apply an interceptor to set the requestId in request headers
export class CrudController<T> {
  private readonly entityName: string;

  /**
   * Constructor for the CRUD controller.
   * @param crudService - The CRUD service instance.
   * @param crudLogger - The logger instance.
   * @param fieldIdentifier - Optional field identifier.
   */
  constructor(
    private readonly crudService: CrudService<T>,
    private readonly crudLogger: Logger,
    private readonly fieldIdentifier?: string,
  ) {
    this.entityName = (this.constructor as typeof CrudController).name;
  }

  /**
   * Retrieves all entities.
   * @param headers - The headers of the request.
   * @returns A promise that resolves to an array of entities.
   */
  @Get()
  async findAll(@Headers() headers: Headers): Promise<T[]> {
    const requestId = headers[CONSTANTS.REQUEST_ID];
    this.crudLogger.info(
      `[${this.entityName}:findAll]: API called to fetch all entities.`,
      [requestId],
    );
    return this.crudService.findAll(requestId);
  }

  /**
   * Retrieves a single entity by ID.
   * @param id - The ID of the entity to fetch.
   * @param headers - The headers of the request.
   * @returns A promise that resolves to the fetched entity.
   */
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers() headers: Headers,
  ): Promise<T> {
    const requestId = headers[CONSTANTS.REQUEST_ID];
    this.crudLogger.info(
      `[${this.entityName}:findOne]: API called to fetch an entity using ID.`,
      [requestId],
    );
    return this.crudService.findOne(
      id,
      requestId,
      this.fieldIdentifier,
    );
  }

  /**
   * Retrieves multiple entities using filters.
   * @param filter - The filters to apply.
   * @param headers - The headers of the request.
   * @returns A promise that resolves to an array of entities.
   */
  @Get('/search')
  async findMany(
    @Query() filter: any,
    @Headers() headers: Headers,
  ): Promise<T[]> {
    const requestId = headers[CONSTANTS.REQUEST_ID];
    this.crudLogger.info(
      `[${this.entityName}:findMany]: API called to fetch all entities using filters.`,
      [requestId],
    );
    return this.crudService.findMany(filter, requestId);
  }

  /**
   * Creates a new entity.
   * @param data - The data of the entity to create.
   * @param headers - The headers of the request.
   * @returns A promise that resolves to the created entity.
   */
  @Post()
  @ApiBody({})
  async create(@Body() data: T, @Headers() headers: Headers): Promise<T> {
    const requestId = headers[CONSTANTS.REQUEST_ID];
    this.crudLogger.info(
      `[${this.entityName}:create]: API called to create an entity.`,
      [requestId],
    );
    return this.crudService.create(
      data,
      requestId,
      this.fieldIdentifier,
    );
  }

  /**
   * Creates multiple entities.
   * @param data - The data of the entities to create.
   * @param headers - The headers of the request.
   * @returns A promise that resolves to an array of created entities.
   */
  @Post('/batch')
  @ApiBody({})
  async createMany(
    @Body() data: T[],
    @Headers() headers: Headers,
  ): Promise<T[]> {
    const requestId = headers[CONSTANTS.REQUEST_ID];
    this.crudLogger.info(
      `[${this.entityName}:createMany]: API called to create many entities.`,
      [requestId],
    );
    return this.crudService.createMany(
      data,
      requestId,
      this.fieldIdentifier,
    );
  }

  /**
   * Updates an entity by ID.
   * @param id - The ID of the entity to update.
   * @param data - The partial data of the entity to update.
   * @param headers - The headers of the request.
   * @returns A promise that resolves to the updated entity.
   */
  @Put(':id')
  @ApiBody({})
  async update(
    @Param('id') id: string,
    @Body() data: Partial<T>,
    @Headers() headers: Headers,
  ): Promise<T> {
    const requestId = headers[CONSTANTS.REQUEST_ID];
    this.crudLogger.info(
      `[${this.entityName}:update]: API called to update an entity using ID.`,
      [requestId],
    );
    return this.crudService.update(
      id,
      data,
      requestId,
      this.fieldIdentifier,
    );
  }

  /**
   * Deletes an entity by ID.
   * @param id - The ID of the entity to delete.
   * @param headers - The headers of the request.
   * @returns A promise that resolves to a success message.
   */
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers() headers: Headers,
  ): Promise<string> {
    const requestId = headers[CONSTANTS.REQUEST_ID];
    this.crudLogger.info(
      `[${this.entityName}:remove]: API called to delete an entity using ID.`,
      [requestId],
    );
    return this.crudService.remove(id, requestId, this.fieldIdentifier);
  }
}