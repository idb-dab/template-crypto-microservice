import { ApiHeaderOptions } from '@nestjs/swagger';
import { CONSTANTS } from '../config/configuration';

const requestId: ApiHeaderOptions = {
    name: CONSTANTS.REQUEST_ID,
    required: true,
    description:'it will be providing a unique identifier for each request'
}

const channelId: ApiHeaderOptions = {
    name: CONSTANTS.CHANNEL_ID,
    required: true,
    description:'it will be identifying the specific channel or communication context associated with the request'
}

export const headers = [requestId, channelId];
