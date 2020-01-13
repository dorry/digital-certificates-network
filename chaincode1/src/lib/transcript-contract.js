/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

import Transcript from "../model/Transcript.js.js";
// const { Transript } = require('../model/Transcipt.js');
class TranscriptContract extends Contract {



    async transcriptExists(ctx, transcriptId) {
        const buffer = await ctx.stub.getState(transcriptId);
        return (!!buffer && buffer.length > 0);
    }

    async createTranscript(ctx, transcriptId, value) {
        const exists = await this.transcriptExists(ctx, transcriptId);
        if (exists) {
            throw new Error(`The transcript ${transcriptId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(transcriptId, buffer);
    }

    async readTranscript(ctx, transcriptId) {
        const exists = await this.transcriptExists(ctx, transcriptId);
        if (!exists) {
            throw new Error(`The transcript ${transcriptId} does not exist`);
        }
        const buffer = await ctx.stub.getState(transcriptId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateTranscript(ctx, transcriptId, newValue) {
        const exists = await this.transcriptExists(ctx, transcriptId);
        if (!exists) {
            throw new Error(`The transcript ${transcriptId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(transcriptId, buffer);
    }

    async deleteTranscript(ctx, transcriptId) {
        const exists = await this.transcriptExists(ctx, transcriptId);
        if (!exists) {
            throw new Error(`The transcript ${transcriptId} does not exist`);
        }
        await ctx.stub.deleteState(transcriptId);
    }

}

module.exports = TranscriptContract;
