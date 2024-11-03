import { binding, given, then, when } from 'cucumber-tsflow';
import { assert } from 'chai';
import axios from 'axios';
import config from '../../test-config';
import * as https from 'https';

https.globalAgent.options.rejectUnauthorized = false;
@binding()
export class StatusSpec {
    private res: any;

    @given(/User sets correct parameters if any/)
    public setParams() {
        console.log('No params for status url');
    }

    @when(/User makes a Get Http Request for status/)
    public async getUrlFor() {
        const agent = new https.Agent({ rejectUnauthorized: true });
        this.res = await axios
            .get(`${config.functional.baseUrl}/health`, { httpsAgent: agent })
            .then((res) => {
                return res;
            })
            .catch((error) => {
                return error;
            });
    }

    @then(/User gets a response for status request/)
    public async checkResponseStatus() {
        assert.equal(this.res.status, 200);
    }
}