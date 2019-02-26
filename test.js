'use strict';

const { expect } = require('chai');
const sinon = require('sinon');

const AutoBlacklist = require('./index');

describe('auto blacklist', () => {
  afterEach(() => sinon.restore());

  it('auto-blocks after two requests', () => {
    const autoBlacklist = new AutoBlacklist([/foo/]);

    const req = {
      ip: '192.0.0.1',
      path: 'foo.something',
    };

    const status = {
      json: sinon.stub(),
    };

    const res = {
      status: sinon.stub().returns(status),
    };

    const next = sinon.stub();

    autoBlacklist.check(req, res, next);
    expect(next.callCount).to.eql(1);

    autoBlacklist.check(req, res, next);
    expect(next.callCount).to.eql(2);

    autoBlacklist.check(req, res, next);
    expect(next.callCount).to.eql(2);
    expect(res.status.callCount).to.eql(1);
    expect(res.status.args[0][0]).to.eql(404);
    expect(status.json.callCount).to.eql(1);
    expect(status.json.args[0][0]).to.eql({ error: 'missing' });
  });
});
