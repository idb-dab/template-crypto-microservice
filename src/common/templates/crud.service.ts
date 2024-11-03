import { Injectable } from '@nestjs/common';
import { CrudRepository } from './crud.repository';
import { Logger } from 'winston';

@Injectable()
export class CrudService<T> {
  private readonly entityName: string;

  constructor(
    private readonly crudRepository: CrudRepository<T>,
    private readonly crudLogger: Logger,
  ) {
    this.entityName = (this.constructor as typeof CrudService).name;
  }

  /**
   * Retrieves all entities.
   * @param requestId - The ID of the request.
   * @returns A promise that resolves to an array of entities.
   */
  async findAll(requestId: string): Promise<T[]> {
    this.crudLogger.info(
      `[${this.entityName}:findAll]: API called to fetch all entities.`,
      [requestId],
    );
    return this.crudRepository.findAll(requestId);
  }

  /**
   * Retrieves multiple entities based on filters.
   * @param filter - The filter criteria.
   * @param requestId - The ID of the request.
   * @returns A promise that resolves to an array of entities.
   */
  async findMany(filter: any, requestId: string): Promise<T[]> {
    this.crudLogger.info(
      `[${this.entityName}:findMany]: API called to fetch all entities using filters.`,
      [requestId],
    );
    return this.crudRepository.findMany(filter, requestId);
  }

  /**
   * Retrieves an entity by ID.
   * @param value - The ID value.
   * @param requestId - The ID of the request.
   * @param fieldIdentifier - The field to identify the entity (default: '_id').
   * @returns A promise that resolves to the requested entity.
   */
  async findOne(
    value: string,
    requestId: string,
    fieldIdentifier = '_id',
  ): Promise<T> {
    this.crudLogger.info(
      `[${this.entityName}:findOne]: API called to fetch an entity using ID.`,
      [requestId],
    );
    return this.crudRepository.findOne(
      value,
      requestId,
      fieldIdentifier,
    );
  }

  /**
   * Creates a new entity.
   * @param data - The data of the entity to be created.
   * @param requestId - The ID of the request.
   * @param fieldIdentifier - The field to identify the entity (default: '_id').
   * @returns A promise that resolves to the created entity.
   */
  async create(
    data: T,
    requestId: string,
    fieldIdentifier = '_id',
  ): Promise<T> {
    this.crudLogger.info(
      `[${this.entityName}:create]: API called to create an entity.`,
      [requestId],
    );
    return this.crudRepository.create(data, requestId, fieldIdentifier);
  }

  /**
   * Creates multiple entities.
   * @param data - The data of the entities to be created.
   * @param requestId - The ID of the request.
   * @param fieldIdentifier - The field to identify the entity (default: '_id').
   * @returns A promise that resolves to the created entities.
   */
  async createMany(
    data: T[],
    requestId: string,
    fieldIdentifier = '_id',
  ): Promise<any> {
    this.crudLogger.info(
      `[${this.entityName}:createMany]: API called to create many entities.`,
      [requestId],
    );
    return this.crudRepository.createMany(
      data,
      requestId,
      fieldIdentifier,
    );
  }

  /**
   * Updates an existing entity by ID.
   * @param id - The ID of the entity to be updated.
   * @param data - The updated data for the entity.
   * @param requestId - The ID of the request.
   * @param fieldIdentifier - The field to identify the entity (default: '_id').
   * @returns A promise that resolves to the updated entity.
   */
  async update(
    id: string,
    data: Partial<T>,
    requestId: string,
    fieldIdentifier = '_id',
  ): Promise<T> {
    this.crudLogger.info(
      `[${this.entityName}:update]: API called to update an entity using ID.`,
      [requestId],
    );
    return this.crudRepository.update(
      id,
      data,
      requestId,
      fieldIdentifier,
    );
  }

  /**
   * Removes an entity by ID.
   * @param fieldValue - The ID value of the entity to be removed.
   * @param requestId - The ID of the request.
   * @param fieldIdentifier - The field to identify the entity (default: '_id').
   * @returns A promise that resolves to a success message.
   */
  async remove(
    fieldValue: string,
    requestId: string,
    fieldIdentifier = '_id',
  ): Promise<string> {
    this.crudLogger.info(
      `[${this.entityName}:remove]: API called to delete an entity using ID.`,
      [requestId],
    );
    return this.crudRepository.remove(
      fieldValue,
      requestId,
      fieldIdentifier,
    );
  }
}
