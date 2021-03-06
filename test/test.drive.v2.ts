// Copyright 2014-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as assert from 'power-assert';
import * as nock from 'nock';
import utils from './utils';
let googleapis = require('../');

describe('drive:v2', () => {
  let localDrive, remoteDrive;

  before((done) => {
    nock.cleanAll();
    const google = new googleapis.GoogleApis();
    nock.enableNetConnect();
    utils.loadApi(google, 'drive', 'v2', {}).then((drive) => {
      nock.disableNetConnect();
      remoteDrive = drive;
      done();
    }).catch(err => {
      nock.disableNetConnect();
      return done(err);
    });
  });

  beforeEach(() => {
    nock.cleanAll();
    nock.disableNetConnect();
    const google = new googleapis.GoogleApis();
    localDrive = google.drive('v2');
  });

  it('should exist', (done) => {
    assert.notEqual(typeof googleapis.drive, null);
    done();
  });

  it('should be a function', (done) => {
    assert.equal(typeof googleapis.drive, 'function');
    done();
  });

  it('should create a drive object', (done) => {
    assert.notEqual(typeof localDrive, 'undefined');
    assert.notEqual(typeof remoteDrive, 'undefined');
    done();
  });

  it('should be frozen (immutable)', (done) => {
    assert.equal(Object.isFrozen(localDrive), true);
    assert.equal(Object.isFrozen(remoteDrive), true);
    done();
  });

  describe('.files', () => {
    it('should exist', (done) => {
      assert.notEqual(typeof localDrive.files, 'undefined');
      assert.notEqual(typeof remoteDrive.files, 'undefined');
      done();
    });

    it('should be an object', (done) => {
      assert.equal(typeof localDrive.files, 'object');
      assert.equal(typeof remoteDrive.files, 'object');
      done();
    });

    describe('.insert', () => {
      it('should exist', (done) => {
        assert.notEqual(typeof localDrive.files.insert, 'undefined');
        assert.notEqual(typeof remoteDrive.files.insert, 'undefined');
        done();
      });

      it('should be a function', (done) => {
        assert.equal(typeof localDrive.files.insert, 'function');
        assert.equal(typeof remoteDrive.files.insert, 'function');
        done();
      });

      it('should return a Request object', (done) => {
        let p = localDrive.files.insert({});
        p.catch(utils.noop);
        assert.equal(p.req.constructor.name, 'Request');
        p = remoteDrive.files.insert({});
        p.catch(utils.noop);
        assert.equal(p.req.constructor.name, 'Request');
        done();
      });
    });

    describe('.get', () => {
      it('should exist', () => {
        assert.notEqual(typeof localDrive.files.get, 'undefined');
        assert.notEqual(typeof remoteDrive.files.get, 'undefined');
      });

      it('should be a function', () => {
        assert.equal(typeof localDrive.files.get, 'function');
        assert.equal(typeof remoteDrive.files.get, 'function');
      });

      it('should return a Request object', () => {
        let p = localDrive.files.get({ fileId: '123' });
        p.catch(utils.noop);
        assert.equal(p.req.constructor.name, 'Request');
        p = remoteDrive.files.get({ fileId: '123' });
        p.catch(utils.noop);
        assert.equal(p.req.constructor.name, 'Request');
      });
    });
  });

  describe('._options', () => {
    it('should exist', () => {
      assert.notEqual(typeof localDrive._options, 'undefined');
      assert.notEqual(typeof remoteDrive._options, 'undefined');
    });

    it('should be an object', () => {
      assert.equal(typeof localDrive._options, 'object');
      assert.equal(typeof remoteDrive._options, 'object');
    });
  });

  describe('.files.list()', () => {
    it('should not return missing param error', (done) => {
      const scope = nock('https://www.googleapis.com')
        .get('/drive/v2/files?q=hello')
        .times(2)
        .reply(200);
      localDrive.files.list({ q: 'hello' }).then(() => {
        remoteDrive.files.list({ q: 'hello' }).then(() => {
          scope.done();
          done();
        });
      });
    });
  });

  after(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });
});
