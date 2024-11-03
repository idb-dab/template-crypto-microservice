import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { flatten } from 'safe-flat';
import { Logger } from 'winston';

@Injectable()
export class CrudRepository<T> {
  private readonly entityName: string;

  constructor(
    private readonly crudModel: Model<T>,
    private readonly crudLogger: Logger,
  ) {
    this.entityName = (this.constructor as typeof CrudRepository).name;
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
    try {
      return await this.crudModel.find({}).exec();
    } catch (error) {
      throw new InternalServerErrorException({
        error,
        requestId,
      });
    }
  }

  /**
   * Retrieves multiple entities using filters.
   * @param filter - The filters to apply.
   * @param requestId - The ID of the request.
   * @returns A promise that resolves to an array of entities.
   */
  async findMany(filter: any, requestId: string): Promise<T[]> {
    this.crudLogger.info(
      `[${this.entityName}:findMany]: API called to fetch all entities using filters.`,
      [requestId],
    );
    try {
      return await this.crudModel.find(filter).exec();
    } catch (error) {
      throw new InternalServerErrorException({
        error,
        requestId,
      });
    }
  }

  /**
   * Retrieves a single entity by ID.
   * @param value - The value of the identifier to search for.
   * @param requestId - The ID of the request.
   * @param fieldIdentifier - Optional field identifier.
   * @returns A promise that resolves to the fetched entity.
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
    try {
      return await this.crudModel
        .findOne(this.createFindObject(value, fieldIdentifier))
        .exec();
    } catch (error) {
      throw new InternalServerErrorException({
        error,
        requestId,
      });
    }
  }

  /**
   * Creates a new entity.
   * @param data - The data of the entity to create.
   * @param requestId - The ID of the request.
   * @param fieldIdentifier - Optional field identifier.
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
    try {
      const res = await this.findOne(
        data[`${fieldIdentifier}`],
        requestId,
        fieldIdentifier,
      );
      if (res) {
        throw new ConflictException({
          error: { description: 'Data already exists' },
          requestId,
        });
      }
      return await this.crudModel.create(data);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          error,
          requestId,
        });
      }
    }
  }

  /**
   * Creates multiple entities.
   * @param data - The data of the entities to create.
   * @param requestId - The ID of the request.
   * @param fieldIdentifier - Optional field identifier.
   * @returns A promise that resolves to the created entities.
   */
  async createMany(
    data: T[],
    requestId: string,
    fieldIdentifier = '_id',
  ): Promise<T | any> {
    this.crudLogger.info(
      `[${this.entityName}:createMany]: API called to create many entities.`,
      [requestId],
    );
    try {
      const response = await this.findAll(requestId);
      const bulkObj = [];
      data.forEach(async element => {
        let flag = 0;
        response.forEach(async item => {
          if (element[`${fieldIdentifier}`] === item[`${fieldIdentifier}`]) {
            flag = 1;
          }
        });
        if (flag === 0) {
          const insertDoc = {
            insertOne: {
              document: element,
            },
          };
          bulkObj.push(insertDoc);
        }
      });
      const records = await this.crudModel.bulkWrite(bulkObj);

      if (!records) {
        throw new ConflictException({
          error: { description: `Bulk data not created` },
          requestId,
        });
      }
      return records;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          error,
          requestId,
        });
      }
    }
  }

  /**
   * Updates an entity by ID.
   * @param fieldValue - The value of the identifier to search for.
   * @param data - The partial data of the entity to update.
   * @param requestId - The ID of the request.
   * @param fieldIdentifier - Optional field identifier.
   * @returns A promise that resolves to the updated entity.
   */
  async update(
    fieldValue: string,
    data: Partial<T>,
    requestId: string,
    fieldIdentifier = '_id',
  ): Promise<T> {
    this.crudLogger.info(
      `[${this.entityName}:update]: API called to update an entity using ID.`,
      [requestId],
    );
    try {
      const res: any = await this.findOne(
        fieldValue,
        requestId,
        fieldIdentifier,
      );
      if (!res) {
        throw new BadRequestException({
          error: {
            description: 'Entity not found to update',
          },
          requestId,
        });
      }
      return await this.crudModel
        .findOneAndUpdate(
          this.createFindObject(fieldValue, fieldIdentifier),
          flatten(JSON.parse(JSON.stringify({ ...res._doc, ...data }))),
          { upsert: true, new: true, overwrite: true },
        )
        .exec();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException({
        error,
        requestId,
      });
    }
  }

  /**
   * Deletes an entity by ID.
   * @param fieldValue - The value of the identifier to search for.
   * @param requestId - The ID of the request.
   * @param fieldIdentifier - Optional field identifier.
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
    try {
      const deletedEntity = await this.crudModel
        .findOneAndDelete(this.createFindObject(fieldValue, fieldIdentifier))
        .exec();
      if (!deletedEntity) {
        this.handleError('No record found to delete', requestId, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      return 'Deleted record successfully!';
    } catch (error) {
      throw new InternalServerErrorException({
        error: { description: error.toString() },
        requestId,
      });
    }
  }

  /**
   * Creates an object for finding an entity based on the field value.
   * @param fieldValue - The value of the field to search for.
   * @param fieldIdentifier - The identifier of the field.
   * @returns An object used for finding an entity.
   */
  createFindObject(fieldValue: string, fieldIdentifier: string) {
    const findObject = {};
    findObject[`${fieldIdentifier}`] = fieldValue;
    return findObject;
  }

  /**
   * Throws a custom HTTP exception.
   * @param message - The error message.
   * @param requestId - The ID of the request.
   * @param statusCode - The HTTP status code.
   */
  private handleError(message: string, requestId: string, statusCode: number) {
    throw new HttpException({ message, requestId }, statusCode);
  }
}
