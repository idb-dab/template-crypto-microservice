import {
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { flatten } from 'safe-flat';
import { Logger } from 'winston';
import { CrudRepository } from './crud.repository';

describe('CrudRepository validation', () => {
    let crudRepository: CrudRepository<any>;
    let crudModel: Model<any>;
    let crudLogger: Logger;

    beforeAll(() => {
        crudModel = {} as Model<any>;
        crudLogger = {} as Logger;
        crudRepository = new CrudRepository<any>(crudModel, crudLogger);
        crudLogger.info = jest.fn().mockResolvedValue(true);
    });

    describe('findAll method validation', () => {
        it('should fetch all entities', async () => {
            const requestId = 'requestId';

            // Mock the implementation of the crudModel find method
            crudModel.find = jest.fn().mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce(['entity1', 'entity2']),
            }) as any;

            const result = await crudRepository.findAll(requestId);

            expect(result).toEqual(['entity1', 'entity2']);
            expect(crudModel.find).toHaveBeenCalledWith({});
        });

        it('should throw an InternalServerErrorException if an exception occurs', async () => {
            const requestId = 'requestId';

            // Mock the implementation of the crudModel find method to throw an error
            crudModel.find = jest.fn().mockReturnValueOnce({
                exec: jest.fn().mockRejectedValueOnce(new Error('Database Error')),
            }) as any;

            await expect(crudRepository.findAll(requestId)).rejects.toThrowError(
                InternalServerErrorException,
            );
            expect(crudModel.find).toHaveBeenCalledWith({});
        });
    });

    describe('findMany method validation', () => {
        it('should fetch all entities using filters', async () => {
            const requestId = 'requestId';
            const filter = { property: 'value' };

            // Mock the implementation of the crudModel find method
            crudModel.find = jest.fn().mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce(['entity1', 'entity2']),
            }) as any;

            const result = await crudRepository.findMany(filter, requestId);

            expect(result).toEqual(['entity1', 'entity2']);
            expect(crudModel.find).toHaveBeenCalledWith(filter);
        });

        it('should throw an InternalServerErrorException if an exception occurs', async () => {
            const requestId = 'requestId';
            const filter = { property: 'value' };

            // Mock the implementation of the crudModel find method to throw an error
            crudModel.find = jest.fn().mockReturnValueOnce({
                exec: jest.fn().mockRejectedValueOnce(new Error('Database Error')),
            }) as any;

            await expect(
                crudRepository.findMany(filter, requestId),
            ).rejects.toThrowError(InternalServerErrorException);
            expect(crudModel.find).toHaveBeenCalledWith(filter);
        });
    });

    describe('findOne method validation', () => {
        it('should fetch an entity using id', async () => {
            const requestId = 'requestId';
            const value = 'id';

            // Mock the implementation of the crudModel findOne method
            crudModel.findOne = jest.fn().mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce('entity'),
            }) as any;

            const result = await crudRepository.findOne(value, requestId);

            expect(result).toEqual('entity');
            expect(crudModel.findOne).toHaveBeenCalledWith({
                _id: value,
            });
        });

        it('should throw an InternalServerErrorException if an exception occurs', async () => {
            const requestId = 'requestId';
            const value = 'id';

            // Mock the implementation of the crudModel findOne method to throw an error
            crudModel.findOne = jest.fn().mockReturnValueOnce({
                exec: jest.fn().mockRejectedValueOnce(new Error('Database Error')),
            }) as any;

            await expect(
                crudRepository.findOne(value, requestId),
            ).rejects.toThrowError(InternalServerErrorException);
            expect(crudModel.findOne).toHaveBeenCalledWith({
                _id: value,
            });
        });
    });

    describe('create method validation', () => {
        it('should create an entity', async () => {
            const requestId = 'requestId';
            const data = { _id: 'id', property: 'value' };

            // Mock the implementation of the crudModel findOne method
            crudRepository.findOne = jest.fn().mockResolvedValueOnce(null);
            crudModel.create = jest.fn().mockResolvedValueOnce('createdEntity');

            const result = await crudRepository.create(data, requestId);

            expect(result).toEqual('createdEntity');
            expect(crudRepository.findOne).toHaveBeenCalledWith(
                data._id,
                requestId,
                '_id',
            );
            expect(crudModel.create).toHaveBeenCalledWith(data);
        });

        it('should throw a ConflictException if the entity already exists', async () => {
            const requestId = 'requestId';
            const data = { _id: 'id', property: 'value' };

            // Mock the implementation of the crudModel findOne method to return an existing entity
            crudRepository.findOne = jest.fn().mockResolvedValueOnce('existingEntity');

            await expect(
                crudRepository.create(data, requestId),
            ).rejects.toThrowError(ConflictException);
            expect(crudRepository.findOne).toHaveBeenCalledWith(
                data._id,
                requestId,
                '_id',
            );
        });

        it('should throw an InternalServerErrorException if an exception occurs during create', async () => {
            const requestId = 'requestId';
            const data = { _id: 'id', property: 'value' };

            // Mock the implementation of the crudModel findOne method to return null
            crudRepository.findOne = jest.fn().mockResolvedValueOnce(null);
            // Mock the implementation of the crudModel create method to throw an error
            crudModel.create = jest.fn().mockRejectedValueOnce(new Error('Database Error'));

            await expect(
                crudRepository.create(data, requestId),
            ).rejects.toThrowError(InternalServerErrorException);
            expect(crudRepository.findOne).toHaveBeenCalledWith(
                data._id,
                requestId,
                '_id',
            );
            expect(crudModel.create).toHaveBeenCalledWith(data);
        });
    });

    describe('createMany method validation', () => {
        it('should create multiple entities', async () => {
            const requestId = 'requestId';
            const data = [
                { _id: 'id1', property: 'value1' },
                { _id: 'id2', property: 'value2' },
            ];

            // Mock the implementation of the crudRepository.findAll method
            crudRepository.findAll = jest.fn().mockResolvedValueOnce([{ _id: 'id1', property: 'value1' }, 'existingEntity2']);
            // Mock the implementation of the crudModel.bulkWrite method
            crudModel.bulkWrite = jest.fn().mockResolvedValueOnce('bulkWriteResult');

            const result = await crudRepository.createMany(data, requestId);

            expect(result).toEqual('bulkWriteResult');
            expect(crudRepository.findAll).toHaveBeenCalledWith(requestId);
            expect(crudModel.bulkWrite).toHaveBeenCalledWith([
                { insertOne: { document: data[1] } },
            ]);
        });

        it('should throw a ConflictException if any entity already exists', async () => {
            const requestId = 'requestId';
            const data = [
                { _id: 'id1', property: 'value1' },
                { _id: 'id2', property: 'value2' },
            ];

            // Mock the implementation of the crudRepository.findAll method
            crudRepository.findAll = jest.fn().mockResolvedValueOnce(['existingEntity', 'existingEntity2']);
            crudModel.bulkWrite = jest.fn().mockResolvedValueOnce(null);

            await expect(
                crudRepository.createMany(data, requestId),
            ).rejects.toThrowError(ConflictException);
            expect(crudRepository.findAll).toHaveBeenCalledWith(requestId);
        });

        it('should throw an InternalServerErrorException if an exception occurs during createMany', async () => {
            const requestId = 'requestId';
            const data = [
                { _id: 'id1', property: 'value1' },
                { _id: 'id2', property: 'value2' },
            ];

            // Mock the implementation of the crudRepository.findAll method
            crudRepository.findAll = jest.fn().mockResolvedValueOnce([]);
            // Mock the implementation of the crudModel.bulkWrite method to throw an error
            crudModel.bulkWrite = jest.fn().mockRejectedValueOnce(new Error('Database Error'));

            await expect(
                crudRepository.createMany(data, requestId),
            ).rejects.toThrowError(InternalServerErrorException);
            expect(crudRepository.findAll).toHaveBeenCalledWith(requestId);
            expect(crudModel.bulkWrite).toHaveBeenCalledWith([
                { insertOne: { document: data[0] } },
                { insertOne: { document: data[1] } },
            ]);
        });
    });

    describe('update method validation', () => {
        it('should update an entity using id', async () => {
            const requestId = 'requestId';
            const fieldValue = 'id';
            const data = { property: 'updatedValue' };

            // Mock the implementation of the crudRepository.findOne method
            crudRepository.findOne = jest.fn().mockResolvedValueOnce('existingEntity');
            // Mock the implementation of the crudModel.findOneAndUpdate method
            crudModel.findOneAndUpdate = jest.fn().mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce('updatedEntity'),
            }) as any;

            const result = await crudRepository.update(
                fieldValue,
                data,
                requestId,
            );

            expect(result).toEqual('updatedEntity');
            expect(crudRepository.findOne).toHaveBeenCalledWith(
                fieldValue,
                requestId,
                '_id',
            );
            expect(crudModel.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: fieldValue },
                flatten({ ...data }),
                { upsert: true, new: true, overwrite: true },
            );
        });

        it('should throw a BadRequestException if the entity does not exist', async () => {
            const requestId = 'requestId';
            const fieldValue = 'id';
            const data = { property: 'updatedValue' };

            // Mock the implementation of the crudRepository.findOne method to return null
            crudRepository.findOne = jest.fn().mockResolvedValueOnce(null);

            await expect(
                crudRepository.update(fieldValue, data, requestId),
            ).rejects.toThrowError(BadRequestException);
            expect(crudRepository.findOne).toHaveBeenCalledWith(
                fieldValue,
                requestId,
                '_id',
            );
        });

        it('should throw an InternalServerErrorException if an exception occurs during update', async () => {
            const requestId = 'requestId';
            const fieldValue = 'id';
            const data = { property: 'updatedValue' };

            // Mock the implementation of the crudRepository.findOne method
            crudRepository.findOne = jest.fn().mockResolvedValueOnce('existingEntity');
            // Mock the implementation of the crudModel.findOneAndUpdate method to throw an error
            crudModel.findOneAndUpdate = jest.fn().mockReturnValueOnce({
                exec: jest.fn().mockRejectedValueOnce(new Error('Database Error')),
            })

            await expect(
                crudRepository.update(fieldValue, data, requestId),
            ).rejects.toThrowError(InternalServerErrorException);
            expect(crudRepository.findOne).toHaveBeenCalledWith(
                fieldValue,
                requestId,
                '_id',
            );
            expect(crudModel.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: fieldValue },
                flatten({ ...data }),
                { upsert: true, new: true, overwrite: true },
            );
        });
    });

    describe('delete method validation', () => {
        it('should delete an entity using id', async () => {
            const requestId = 'requestId';
            const value = 'id';

            // Mock the implementation of the crudModel.deleteOne method
            crudModel.findOneAndDelete = jest.fn().mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce('deleteResult'),
            }) as any;

            const result = await crudRepository.remove(value, requestId);

            expect(result).toEqual("Deleted record successfully!");
            expect(crudModel.findOneAndDelete).toHaveBeenCalledWith({
                _id: value,
            });
        });

        it('should throw an InternalServerErrorException if an exception occurs during delete', async () => {
            const requestId = 'requestId';
            const value = 'id';

            // Mock the implementation of the crudModel.deleteOne method to throw an error
            crudModel.findOneAndDelete = jest.fn().mockReturnValueOnce({
                exec: jest.fn().mockResolvedValue(null),
            }) as any;

            await expect(
                crudRepository.remove(value, requestId),
            ).rejects.toThrowError(InternalServerErrorException);
            expect(crudModel.findOneAndDelete).toHaveBeenCalledWith({
                _id: value,
            });
        });
    });
});
