/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { TranscriptContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('TranscriptContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new TranscriptContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"transcript 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"transcript 1002 value"}'));
    });

    describe('#transcriptExists', () => {

        it('should return true for a transcript', async () => {
            await contract.transcriptExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a transcript that does not exist', async () => {
            await contract.transcriptExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createTranscript', () => {

        it('should create a transcript', async () => {
            await contract.createTranscript(ctx, '1003', 'transcript 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"transcript 1003 value"}'));
        });

        it('should throw an error for a transcript that already exists', async () => {
            await contract.createTranscript(ctx, '1001', 'myvalue').should.be.rejectedWith(/The transcript 1001 already exists/);
        });

    });

    describe('#readTranscript', () => {

        it('should return a transcript', async () => {
            await contract.readTranscript(ctx, '1001').should.eventually.deep.equal({ value: 'transcript 1001 value' });
        });

        it('should throw an error for a transcript that does not exist', async () => {
            await contract.readTranscript(ctx, '1003').should.be.rejectedWith(/The transcript 1003 does not exist/);
        });

    });

    describe('#updateTranscript', () => {

        it('should update a transcript', async () => {
            await contract.updateTranscript(ctx, '1001', 'transcript 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"transcript 1001 new value"}'));
        });

        it('should throw an error for a transcript that does not exist', async () => {
            await contract.updateTranscript(ctx, '1003', 'transcript 1003 new value').should.be.rejectedWith(/The transcript 1003 does not exist/);
        });

    });

    describe('#deleteTranscript', () => {

        it('should delete a transcript', async () => {
            await contract.deleteTranscript(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a transcript that does not exist', async () => {
            await contract.deleteTranscript(ctx, '1003').should.be.rejectedWith(/The transcript 1003 does not exist/);
        });

    });

});