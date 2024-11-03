import { EncryptDecryptHelper } from "@idb-dab/ms-utils";
import config from '../../test-config';
import axios from "axios";

export async function encryptDecryptHelper(): Promise<EncryptDecryptHelper> {
    //getting a public key to encrypt the data
    return await axios
        .post(
            `${config.functional.cryptoService.baseUrl}${config.functional.cryptoService.serviceUrl}`,
            {
                "uuid": crypto.randomUUID()
            },
        )
        .then(async (res) => {
            return new EncryptDecryptHelper(res.data.data)
        })
        .catch((error) => {
            return error;
        });
}
