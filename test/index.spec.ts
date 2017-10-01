import equal from '@async-generators/equal';
import fromEmitter from '../src';
import { expect } from 'chai';
import { EventEmitter } from 'events';

describe("@async-generator/from-emitter", () => {
  it("should buffer and yield events", async () => {

    let events = new EventEmitter();
    let source = fromEmitter<number>(events);
    let expected = [1, 2, 3, 4];

    events.emit("next", 1);
    events.emit("next", 2);
    events.emit("next", 3);
    events.emit("next", 4);
    events.emit("done");

    expect(await equal(source, expected)).true;
  })

  it("should yield events", async () => {

    let events = new EventEmitter();
    let source = fromEmitter<number>(events);
    let expected = [1, 2, 3, 4];
    let result = equal(source, expected);

    await new Promise(r => setImmediate(r));

    events.emit("next", 1);
    events.emit("next", 2);
    events.emit("next", 3);
    events.emit("next", 4);
    events.emit("done");

    expect(await result).true;
  })

  it("should rethrow error", async () => {

    let events = new EventEmitter();
    let source = fromEmitter<number>(events);
    let result = equal(source, source);

    await new Promise(r => setImmediate(r));

    events.emit("next", 1);
    events.emit("error", new Error("pickle rick!"));

    let error;
    try {
      await result
    } catch (err) { error = err };

    expect(error.message).to.be.eq("pickle rick!");
  })

  it("should throw error after done", async () => {

    let events = new EventEmitter();
    let source = fromEmitter<number>(events);
    let result = equal(source, source);

    await new Promise(r => setImmediate(r));

    events.emit("next", 1);
    events.emit("error", new Error("pickle rick!"));

    let error;
    try {
      await result
    } catch (err) { error = err };

    expect(error.message).to.be.eq("pickle rick!");
  })
})
