import {Keyring} from '@polkadot/api';
import {randomAsHex, encodeAddress} from '@polkadot/util-crypto';

import {DockSDK} from '../src/dock-sdk';

import {
  validateDockDIDIdentifier,
  getHexIdentifierFromDID,
  DockDIDQualifier,
  createNewDockDID,
  createKeyDetail
} from '../src/utils/did';
import {FullNodeEndpoint, TestKeyringOpts, TestAccount} from './test-constants';
import {getPublicKeyFromKeyringPair} from '../src/utils/misc';
import {PublicKeyEd25519} from '../src/public-key';
import {SignatureEd25519, SignatureSr25519} from '../src/signature';

import BTreeSet from '@polkadot/types/codec/BTreeSet';
import { Registry } from "@polkadot/types/types";

import { Struct, Tuple, TypeRegistry, u128 } from "@polkadot/types";

// pub struct Registry {
//     /// Who is allowed to update this registry.
//     pub policy: Policy,
//     /// true: credentials can be revoked, but not un-revoked
//     /// false: credentials can be revoked and un-revoked
//     pub add_only: bool,
// }

// pub enum Policy {
//     OneOf {
//         /// Set of dids allowed to modify a registry.
//         controllers: BTreeSet<Did>,
//     },
// }

import {hexToU8a} from '@polkadot/util';

class RevokeRegistry {
  constructor(policy, addOnly = true) {
    this.policy = policy;
    this.addOnly = addOnly;
  }

  toJSON() {
    return {
      policy: this.policy.toJSON(),
      add_only: this.addOnly,
    };
  }
}

class Did {
  constructor(registry, value) {
    console.log('new Did', registry, value)
    this.value = value;
  }

  toU8a() {
    console.log('this.value', this.value)
    return hexToU8a(this.value);
  }

  toJSON() {
    return this.value;
  }
}

class Policy {
  constructor(treeSet) {
    this.treeSet = treeSet;
  }

  toJSON() {
    return {
      "OneOf": {
        controllers: this.treeSet,
      }
    };
  }
}

describe('Revocation Module', () => {
  const dock = new DockSDK(FullNodeEndpoint);

  // TODO: Uncomment the `beforeAll` and unskip the tests once a node is deployed.
  beforeAll(async (done) => {
    await dock.init();
    done();
  });

  test('Can connect to node', () => {
    //await dock.init();
    expect(!!dock.api).toBe(true);
  });

  const registryID = randomAsHex(32);
  const controllerID = randomAsHex(32);

  const treeRegistry = new TypeRegistry();
  treeRegistry.register('Did', Did);

  const controllerSet = new Set();
  controllerSet.add(controllerID);

  const treeSet = new BTreeSet(treeRegistry, Did, controllerSet);

  const policy = new Policy(treeSet);
  const registry = new RevokeRegistry(policy, true);

  test('Can create a registry', async () => {
    console.log('treeSet size', treeSet.size)
    const transaction = dock.revocation.newRegistry(registryID, registry);
    const result = await dock.sendTransaction(transaction);
    if (result) {
      expect(!!result).toBe(true);
    }
  }, 30000);
});
