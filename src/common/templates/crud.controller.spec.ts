import { Logger } from 'winston';
import { CrudService } from './crud.service';
import { CrudController } from './crud.controller';
import { CONSTANTS } from '../config/configuration';

const headers = { [CONSTANTS.REQUEST_ID]: 'requestId' };


describe('CrudController validation', () => {
    let crudController: CrudController<any>;
    let crudService: CrudService<any>;
    let crudLogger: Logger;

    beforeAll(() => {
        crudService = {} as CrudService<any>; // Mock the CrudService
        crudLogger = {} as Logger; // Mock the logger
        crudController = new CrudController(crudService, crudLogger);
        crudLogger.info = jest.fn().mockResolvedValue(true);
    });
    
    // Test cases for findAll method
    describe('findAll method validation', () => {
        it('should fetch all entities', async () => {
            // Mock the implementation of the CrudService findAll method
            crudService.findAll = jest.fn().mockResolvedValueOnce(['entity1', 'entity2']);

            const result = await crudController.findAll(headers as any);

            expect(result).toEqual(['entity1', 'entity2']);
            expect(crudService.findAll).toHaveBeenCalledWith('requestId');
        });

        it('should throw an error if an exception occurs', async () => {
            // Mock the implementation of the CrudService findAll method to throw an error
            crudService.findAll = jest.fn().mockRejectedValueOnce(new Error('Internal Server Error'));

            await expect(crudController.findAll(headers as any)).rejects.toThrowError('Error');
            expect(crudService.findAll).toHaveBeenCalledWith('requestId');
        });
    });

    // Test cases for findOne method
    describe('findOne method validation', () => {
        it('should fetch an entity using the provided id', async () => {
            // Mock the implementation of the CrudService findOne method
            crudService.findOne = jest.fn().mockResolvedValueOnce('entity');

            const result = await crudController.findOne('id', headers as any);

            expect(result).toEqual('entity');
            expect(crudService.findOne).toHaveBeenCalledWith('id', 'requestId', undefined);
        });

        it('should throw an error if an exception occurs', async () => {
            // Mock the implementation of the CrudService findOne method to throw an error
            crudService.findOne = jest.fn().mockRejectedValueOnce(new Error('Internal Server Error'));

            await expect(crudController.findOne('id', headers as any)).rejects.toThrowError('Error');
            expect(crudService.findOne).toHaveBeenCalledWith('id', 'requestId', undefined);
        });
    });

    // Test cases for findMany method
    describe('findMany method validation', () => {
        it('should fetch all entities using filters', async () => {
            const filter = { property: 'value' };
            // Mock the implementation of the CrudService findMany method
            crudService.findMany = jest.fn().mockResolvedValueOnce(['entity1', 'entity2']);

            const result = await crudController.findMany(filter, headers as any);

            expect(result).toEqual(['entity1', 'entity2']);
            expect(crudService.findMany).toHaveBeenCalledWith(filter, 'requestId');
        });

        it('should throw an error if an exception occurs', async () => {
            const filter = { property: 'value' };
            // Mock the implementation of the CrudService findMany method to throw an error
            crudService.findMany = jest.fn().mockRejectedValueOnce(new Error('Internal Server Error'));

            await expect(crudController.findMany(filter, headers as any)).rejects.toThrowError('Error');
            expect(crudService.findMany).toHaveBeenCalledWith(filter, 'requestId');
        });
    });

    // Test cases for create method
    describe('create method validation', () => {
        it('should create a new entity', async () => {
            const data = { property: 'value' };
            // Mock the implementation of the CrudService create method
            crudService.create = jest.fn().mockResolvedValueOnce('newEntity');

            const result = await crudController.create(data, headers as any);

            expect(result).toEqual('newEntity');
            expect(crudService.create).toHaveBeenCalledWith(data, 'requestId', undefined);
        });

        it('should throw an error if an exception occurs', async () => {
            const data = { property: 'value' };
            // Mock the implementation of the CrudService create method to throw an error
            crudService.create = jest.fn().mockRejectedValueOnce(new Error('Internal Server Error'));

            await expect(crudController.create(data, headers as any)).rejects.toThrowError('Error');
            expect(crudService.create).toHaveBeenCalledWith(data, 'requestId', undefined);
        });
    });

    // Test cases for createMany method
    describe('createMany method validation', () => {
        it('should create multiple entities', async () => {
            const data = [{ property: 'value1' }, { property: 'value2' }];
            // Mock the implementation of the CrudService createMany method
            crudService.createMany = jest.fn().mockResolvedValueOnce(['entity1', 'entity2']);

            const result = await crudController.createMany(data, headers as any);

            expect(result).toEqual(['entity1', 'entity2']);
            expect(crudService.createMany).toHaveBeenCalledWith(data, 'requestId', undefined);
        });

        it('should throw an error if an exception occurs', async () => {
            const data = [{ property: 'value1' }, { property: 'value2' }];
            // Mock the implementation of the CrudService createMany method to throw an error
            crudService.createMany = jest.fn().mockRejectedValueOnce(new Error('Internal Server Error'));

            await expect(crudController.createMany(data, headers as any)).rejects.toThrowError('Error');
            expect(crudService.createMany).toHaveBeenCalledWith(data, 'requestId', undefined);
        });
    });

    // Test cases for update method
    describe('update method validation', () => {
        it('should update an existing entity', async () => {
            const data = { property: 'updatedValue' };
            // Mock the implementation of the CrudService update method
            crudService.update = jest.fn().mockResolvedValueOnce('updatedEntity');

            const result = await crudController.update('id', data, headers as any);

            expect(result).toEqual('updatedEntity');
            expect(crudService.update).toHaveBeenCalledWith('id', data, 'requestId', undefined);
        });

        it('should throw an error if an exception occurs', async () => {
            const data = { property: 'updatedValue' };
            // Mock the implementation of the CrudService update method to throw an error
            crudService.update = jest.fn().mockRejectedValueOnce(new Error('Internal Server Error'));

            await expect(crudController.update('id', data, headers as any)).rejects.toThrowError('Error');
            expect(crudService.update).toHaveBeenCalledWith('id', data, 'requestId', undefined);
        });
    });

    // Test cases for remove method
    describe('remove method validation', () => {
        it('should remove an existing entity', async () => {
            // Mock the implementation of the CrudService remove method
            crudService.remove = jest.fn().mockResolvedValueOnce('removedEntity');

            const result = await crudController.remove('id', headers as any);

            expect(result).toEqual('removedEntity');
            expect(crudService.remove).toHaveBeenCalledWith('id', 'requestId', undefined);
        });

        it('should throw an error if an exception occurs', async () => {
            // Mock the implementation of the CrudService remove method to throw an error
            crudService.remove = jest.fn().mockRejectedValueOnce(new Error('Internal Server Error'));

            await expect(crudController.remove('id', headers as any)).rejects.toThrowError('Error');
            expect(crudService.remove).toHaveBeenCalledWith('id', 'requestId', undefined);
        });
    });
});