import { CrudService } from './crud.service';
import { CrudRepository } from './crud.repository';
import { Logger } from 'winston';

describe('CrudService validation', () => {
    let crudService: CrudService<any>;
    let crudRepository: CrudRepository<any>;
    let crudLogger: Logger;

    beforeAll(() => {
        crudRepository = {} as CrudRepository<any>; // Mocked instance of CrudRepository
        crudLogger = {} as Logger; // Mocked instance of Logger
        crudService = new CrudService(crudRepository, crudLogger);
        crudLogger.info = jest.fn().mockResolvedValue(true);
    });

    describe('findAll method validation', () => {
        it('should fetch all entities', async () => {
            const requestId = 'requestId';

            // Mock the implementation of the CrudRepository findAll method
            crudRepository.findAll = jest.fn().mockResolvedValueOnce(['entity1', 'entity2']);

            const result = await crudService.findAll(requestId);

            expect(result).toEqual(['entity1', 'entity2']);
            expect(crudRepository.findAll).toHaveBeenCalledWith(requestId);
        });

        it('should throw an error if an exception occurs', async () => {
            const requestId = 'requestId';

            // Mock the implementation of the CrudRepository findAll method to throw an error
            crudRepository.findAll = jest.fn().mockRejectedValueOnce(new Error('Internal Server Error'));

            await expect(crudService.findAll(requestId)).rejects.toThrowError('Error');
            expect(crudRepository.findAll).toHaveBeenCalledWith(requestId);
        });
    });

    describe('findMany method validation', () => {
        it('should fetch entities using filters', async () => {
            const requestId = 'requestId';
            const filter = { property: 'value' };

            // Mock the implementation of the CrudRepository findMany method
            crudRepository.findMany = jest.fn().mockResolvedValueOnce(['entity1', 'entity2']);

            const result = await crudService.findMany(filter, requestId);

            expect(result).toEqual(['entity1', 'entity2']);
            expect(crudRepository.findMany).toHaveBeenCalledWith(filter, requestId);
        });

        it('should throw an error if an exception occurs', async () => {
            const requestId = 'requestId';
            const filter = { property: 'value' };

            // Mock the implementation of the CrudRepository findMany method to throw an error
            crudRepository.findMany = jest.fn().mockRejectedValueOnce(new Error('Internal Server Error'));

            await expect(crudService.findMany(filter, requestId)).rejects.toThrowError('Error');
            expect(crudRepository.findMany).toHaveBeenCalledWith(filter, requestId);
        });
    });

    describe('findOne method validation', () => {
        it('should fetch an entity using id', async () => {
            const requestId = 'requestId';
            const value = 'id';

            // Mock the implementation of the CrudRepository findOne method
            crudRepository.findOne = jest.fn().mockResolvedValueOnce('entity');

            const result = await crudService.findOne(value, requestId);

            expect(result).toEqual('entity');
            expect(crudRepository.findOne).toHaveBeenCalledWith(value, requestId, '_id');
        });

        it('should throw an error if an exception occurs', async () => {
            const requestId = 'requestId';
            const value = 'id';

            // Mock the implementation of the CrudRepository findOne method to throw an error
            crudRepository.findOne = jest.fn().mockRejectedValueOnce(new Error('Internal Server Error'));

            await expect(crudService.findOne(value, requestId)).rejects.toThrowError('Error');
            expect(crudRepository.findOne).toHaveBeenCalledWith(value, requestId, '_id');
        });
    });

    describe('create method validation', () => {
        it('should create an entity', async () => {
            const requestId = 'requestId';
            const data = { property: 'value' };

            // Mock the implementation of the CrudRepository create method
            crudRepository.create = jest.fn().mockResolvedValueOnce('createdEntity');

            const result = await crudService.create(data, requestId);

            expect(result).toEqual('createdEntity');
            expect(crudRepository.create).toHaveBeenCalledWith(data, requestId, '_id');
        });

        it('should throw an error if an exception occurs', async () => {
            const requestId = 'requestId';
            const data = { property: 'value' };

            // Mock the implementation of the CrudRepository create method to throw an error
            crudRepository.create = jest.fn().mockRejectedValueOnce(new Error('Internal Server Error'));

            await expect(crudService.create(data, requestId)).rejects.toThrowError('Error');
            expect(crudRepository.create).toHaveBeenCalledWith(data, requestId, '_id');
        });
    });

    describe('createMany method validation', () => {
        it('should create many entities', async () => {
            const requestId = 'requestId';
            const data = [{ property: 'value1' }, { property: 'value2' }];

            // Mock the implementation of the CrudRepository createMany method
            crudRepository.createMany = jest.fn().mockResolvedValueOnce('createdEntities');

            const result = await crudService.createMany(data, requestId);

            expect(result).toEqual('createdEntities');
            expect(crudRepository.createMany).toHaveBeenCalledWith(data, requestId, '_id');
        });

        it('should throw an error if an exception occurs', async () => {
            const requestId = 'requestId';
            const data = [{ property: 'value1' }, { property: 'value2' }];

            // Mock the implementation of the CrudRepository createMany method to throw an error
            crudRepository.createMany = jest.fn().mockRejectedValueOnce(new Error('Internal Server Error'));

            await expect(crudService.createMany(data, requestId)).rejects.toThrowError('Error');
            expect(crudRepository.createMany).toHaveBeenCalledWith(data, requestId, '_id');
        });
    });

    describe('update method validation', () => {
        it('should update an entity using id', async () => {
            const requestId = 'requestId';
            const id = 'id';
            const data = { property: 'updatedValue' };

            // Mock the implementation of the CrudRepository update method
            crudRepository.update = jest.fn().mockResolvedValueOnce('updatedEntity');

            const result = await crudService.update(id, data, requestId);

            expect(result).toEqual('updatedEntity');
            expect(crudRepository.update).toHaveBeenCalledWith(id, data, requestId, '_id');
        });

        it('should throw an error if an exception occurs', async () => {
            const requestId = 'requestId';
            const id = 'id';
            const data = { property: 'updatedValue' };

            // Mock the implementation of the CrudRepository update method to throw an error
            crudRepository.update = jest.fn().mockRejectedValueOnce(new Error('Internal Server Error'));

            await expect(crudService.update(id, data, requestId)).rejects.toThrowError('Error');
            expect(crudRepository.update).toHaveBeenCalledWith(id, data, requestId, '_id');
        });
    });

    describe('remove method validation', () => {
        it('should delete an entity using id', async () => {
            const requestId = 'requestId';
            const fieldValue = 'id';

            // Mock the implementation of the CrudRepository remove method
            crudRepository.remove = jest.fn().mockResolvedValueOnce('removedEntity');

            const result = await crudService.remove(fieldValue, requestId);

            expect(result).toEqual('removedEntity');
            expect(crudRepository.remove).toHaveBeenCalledWith(fieldValue, requestId, '_id');
        });

        it('should throw an error if an exception occurs', async () => {
            const requestId = 'requestId';
            const fieldValue = 'id';

            // Mock the implementation of the CrudRepository remove method to throw an error
            crudRepository.remove = jest.fn().mockRejectedValueOnce(new Error('Internal Server Error'));

            await expect(crudService.remove(fieldValue, requestId)).rejects.toThrowError('Error');
            expect(crudRepository.remove).toHaveBeenCalledWith(fieldValue, requestId, '_id');
        });
    });
});
