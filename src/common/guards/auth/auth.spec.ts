import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ApiKeyStrategy } from './api-key.strategy';

describe('ApiKeyStrategy validation', () => {
    let strategy: ApiKeyStrategy;

    const configServiceMock = {
        get: jest.fn().mockReturnValue(JSON.stringify(['apiKey1', 'apiKey2'])),
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PassportModule],
            providers: [
                ApiKeyStrategy,
                {
                    provide: ConfigService,
                    useValue: configServiceMock,
                },
            ],
        }).compile();

        strategy = module.get<ApiKeyStrategy>(ApiKeyStrategy);
    });

    it('should be defined', () => {
        expect(strategy).toBeDefined();
    });

    describe('validateApiKey  method validation', () => {
        it('should call done with true if the provided API key is valid', async () => {
            const doneMock = jest.fn();

            await strategy.validateApiKey('apiKey1', doneMock);

            expect(doneMock).toHaveBeenCalledWith(null, true);
        });

        it('should call done with an HttpException if the provided API key is invalid', async () => {
            const doneMock = jest.fn();

            await strategy.validateApiKey('invalidApiKey', doneMock);

            expect(doneMock).toHaveBeenCalledWith(
                new HttpException(
                    {
                        message: 'Please pass a valid service key to authenticate.',
                    },
                    HttpStatus.UNAUTHORIZED,
                ),
                null,
            );
        });
    });
});
