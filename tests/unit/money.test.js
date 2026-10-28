import test from 'node:test';
import assert from 'node:assert/strict';
import { parseMoney, formatMoney } from '../../src/utils/money.js';
test('money accepts exact positive two-decimal amounts', () => { assert.equal(parseMoney('100.25'), 10025n); assert.equal(formatMoney(10025n), '100.25'); });
test('money rejects malformed, zero, negative, and excessive precision', () => { for (const value of ['0.00', '-1.00', '1', '1.000', 1]) assert.throws(() => parseMoney(value)); });
